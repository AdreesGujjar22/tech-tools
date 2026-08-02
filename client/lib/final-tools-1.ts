export type Base64File = { dataUri: string; mimeType: string; extension: string; payload: string };

const extensionByMime: Record<string, string> = { "application/pdf": "pdf", "application/json": "json", "text/plain": "txt", "text/html": "html", "text/csv": "csv", "image/png": "png", "image/jpeg": "jpg", "image/gif": "gif", "image/webp": "webp", "audio/mpeg": "mp3", "video/mp4": "mp4", "application/zip": "zip" };
export function parseBase64File(value: string, fallbackExtension = "bin"): Base64File {
  const input = value.trim();
  const match = input.match(/^data:([^;,]+)?(?:;[^,]*)?;base64,([A-Za-z0-9+/=\s]+)$/i);
  const payload = (match ? match[2] : input).replace(/\s/g, "");
  if (!payload || !/^[A-Za-z0-9+/]*={0,2}$/.test(payload) || payload.length % 4 === 1) throw new Error("Invalid Base64 data.");
  const mimeType = match?.[1] || "application/octet-stream";
  return { dataUri: match ? input : `data:${mimeType};base64,${payload}`, mimeType, extension: extensionByMime[mimeType] || fallbackExtension, payload };
}
export function fileToDataUri(file: File) { return new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(reader.error || new Error("Unable to read file.")); reader.readAsDataURL(file); }); }
export const downloadBase64File = (file: Base64File, filename: string) => { const link = document.createElement("a"); link.href = file.dataUri; link.download = filename.includes(".") ? filename : `${filename}.${file.extension}`; document.body.appendChild(link); link.click(); link.remove(); };

const countryLengths: Record<string, number> = { AL: 28, AD: 24, AT: 20, AZ: 28, BH: 22, BE: 16, BA: 20, BR: 29, BG: 22, CR: 22, HR: 21, CY: 28, CZ: 24, DK: 18, DO: 28, EE: 20, FO: 18, FI: 18, FR: 27, GE: 22, DE: 22, GI: 23, GR: 27, GL: 18, GT: 28, HU: 28, IS: 26, IE: 22, IL: 23, IT: 27, JO: 30, KZ: 20, XK: 20, KW: 30, LV: 21, LB: 28, LI: 21, LT: 20, LU: 20, MK: 19, MT: 31, MR: 27, MU: 30, MC: 27, MD: 24, ME: 22, NL: 18, NO: 15, PK: 24, PS: 29, PL: 28, PT: 25, QA: 29, RO: 24, SM: 27, SA: 24, RS: 22, SK: 24, SI: 19, ES: 24, SE: 24, CH: 21, TN: 24, TR: 26, AE: 23, GB: 22, VG: 24 };
const bankIdentifierLength: Record<string, number> = { AT: 5, BE: 3, DE: 8, ES: 8, FR: 5, GB: 4, IT: 5, NL: 4, PT: 4, TR: 5 };
const bbanRules: Record<string, RegExp> = { DE: /^\d{18}$/, FR: /^[0-9A-Z]{23}$/, GB: /^[A-Z]{4}\d{14}$/, ES: /^\d{20}$/, IT: /^[A-Z]\d{10}[0-9A-Z]{12}$/, NL: /^[A-Z]{4}\d{10}$/ };
export function validateIban(raw: string) {
  const normalized = raw.toUpperCase().replace(/[\s-]/g, "");
  const country = normalized.slice(0, 2);
  const checkDigits = normalized.slice(2, 4);
  const bban = normalized.slice(4);
  const errors: string[] = [];
  if (!normalized) errors.push("No IBAN provided");
  else if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(normalized)) errors.push("Invalid IBAN format");
  if (country && country.length === 2 && !countryLengths[country]) errors.push("No IBAN country");
  if (countryLengths[country] && normalized.length !== countryLengths[country]) errors.push("Wrong IBAN length");
  if (bbanRules[country] && !bbanRules[country].test(bban)) errors.push("Wrong BBAN format");
  if (!/^\d{2}$/.test(checkDigits)) errors.push("Checksum is not a number");
  if (!errors.some((error) => ["Invalid IBAN format", "No IBAN country", "Wrong IBAN length", "Wrong BBAN format", "Checksum is not a number"].includes(error))) {
    let remainder = 0;
    for (const char of `${bban}${country}${checkDigits}`) { const value = /[A-Z]/.test(char) ? char.charCodeAt(0) - 55 : Number(char); remainder = (remainder * 10 + value) % 97; }
    if (remainder !== 1) errors.push("Wrong IBAN checksum");
  }
  const bankLength = bankIdentifierLength[country] || 0;
  return { normalized, country, checkDigits, bban, bankIdentifier: bankLength ? bban.slice(0, bankLength) : bban.slice(0, 4), accountDetails: bankLength ? bban.slice(bankLength) : bban, valid: errors.length === 0, errors, friendly: errors.join(", ") || "Valid IBAN" };
}

export const percentageOf = (percentage: number, value: number) => percentage / 100 * value;
export const percentOf = (value: number, total: number) => total === 0 ? null : value / total * 100;
export const percentageChange = (from: number, to: number) => from === 0 ? null : (to - from) / from * 100;
export const valueAfterPercentage = (value: number, percentage: number, increase: boolean) => value * (1 + (increase ? percentage : -percentage) / 100);
export const formatNumber = (value: number | null) => value === null || !Number.isFinite(value) ? "" : value.toLocaleString(undefined, { maximumFractionDigits: 8 });
