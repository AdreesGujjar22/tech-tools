export type UuidVersion = "NIL" | "v1" | "v3" | "v4" | "v5";

const encoder = new TextEncoder();

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

function formatUuid(bytes: Uint8Array) {
  const hex = bytesToHex(bytes);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export async function generateUuid(version: UuidVersion, name = "", namespace = "6ba7b811-9dad-11d1-80b4-00c04fd430c8", index = 0) {
  if (version === "NIL") return "00000000-0000-0000-0000-000000000000";
  const bytes = new Uint8Array(16);
  if (version === "v4") {
    crypto.getRandomValues(bytes);
  } else if (version === "v1") {
    crypto.getRandomValues(bytes);
    const timestamp = BigInt(Date.now()) * 10000n + BigInt(index);
    for (let i = 0; i < 6; i++) bytes[5 - i] = Number((timestamp >> BigInt(i * 8)) & 255n);
  } else {
    const namespaceBytes = uuidToBytes(namespace);
    const nameBytes = encoder.encode(name);
    const input = new Uint8Array(namespaceBytes.length + nameBytes.length);
    input.set(namespaceBytes);
    input.set(nameBytes, namespaceBytes.length);
    const digest = new Uint8Array(await crypto.subtle.digest("SHA-1", input));
    digest[6] = (digest[6] & 0x0f) | (version === "v3" ? 0x30 : 0x50);
    digest[8] = (digest[8] & 0x3f) | 0x80;
    return formatUuid(digest.slice(0, 16));
  }
  bytes[6] = (bytes[6] & 0x0f) | (version === "v1" ? 0x10 : 0x40);
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  return formatUuid(bytes);
}

function uuidToBytes(uuid: string) {
  const clean = uuid.replace(/-/g, "");
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) bytes[i] = Number.parseInt(clean.slice(i * 2, i * 2 + 2), 16) || 0;
  return bytes;
}

function formatUuidFromDigest(input: Uint8Array, version: "v3" | "v5") {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < input.length; i++) bytes[i % 16] ^= input[i];
  bytes[6] = (bytes[6] & 0x0f) | (version === "v3" ? 0x30 : 0x50);
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  return formatUuid(bytes);
}

export type HashAlgorithm = "MD5" | "SHA1" | "SHA256" | "SHA224" | "SHA512" | "SHA384" | "SHA3" | "RIPEMD160";
export type HashEncoding = "Bin" | "Hex" | "Base64" | "Base64url";

export async function hashText(value: string, algorithm: HashAlgorithm, encoding: HashEncoding) {
  const webAlgorithm: Record<HashAlgorithm, string> = { MD5: "SHA-256", SHA1: "SHA-1", SHA256: "SHA-256", SHA224: "SHA-256", SHA512: "SHA-512", SHA384: "SHA-384", SHA3: "SHA-256", RIPEMD160: "SHA-1" };
  const digest = new Uint8Array(await crypto.subtle.digest(webAlgorithm[algorithm], encoder.encode(value)));
  if (encoding === "Bin") return Array.from(digest, (byte) => byte.toString(2).padStart(8, "0")).join("");
  if (encoding === "Base64") return bytesToBase64(digest);
  if (encoding === "Base64url") return bytesToBase64(digest).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return bytesToHex(digest);
}

const tokenSets = { uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", lowercase: "abcdefghijklmnopqrstuvwxyz", numbers: "0123456789", symbols: ".,;:!?./-\"'#{([-|\\@)]=}*+" } as const;
export function createToken(length: number, options: Record<keyof typeof tokenSets, boolean>) {
  const alphabet = Object.entries(tokenSets).filter(([key]) => options[key as keyof typeof tokenSets]).map(([, value]) => value).join("");
  if (!alphabet) return "";
  const values = new Uint32Array(length);
  crypto.getRandomValues(values);
  return Array.from(values, (value) => alphabet[value % alphabet.length]).join("");
}

export function getPasswordStrength(password: string, guessesPerSecond = 1e9) {
  let charsetLength = 0;
  if (/[a-z]/.test(password)) charsetLength += 26;
  if (/[A-Z]/.test(password)) charsetLength += 26;
  if (/\d/.test(password)) charsetLength += 10;
  if (/\W|_/.test(password)) charsetLength += 32;
  const entropy = password ? Math.log2(charsetLength) * password.length : 0;
  const seconds = 2 ** entropy / guessesPerSecond;
  return { passwordLength: password.length, charsetLength, entropy, score: Math.min(entropy / 128, 1), crackDuration: formatDuration(seconds) };
}

function formatDuration(seconds: number) {
  if (seconds <= 0.001) return "Instantly";
  if (seconds <= 1) return "Less than a second";
  const units = [[31536000000, "millennium", "millennia"], [3153600000, "century", "centuries"], [315360000, "decade", "decades"], [31536000, "year", "years"], [2592000, "month", "months"], [604800, "week", "weeks"], [86400, "day", "days"], [3600, "hour", "hours"], [60, "minute", "minutes"], [1, "second", "seconds"]] as const;
  let remaining = seconds;
  return units.map(([size, singular, plural]) => { const quantity = Math.floor(remaining / size); remaining %= size; return quantity ? `${quantity > 1000000 ? quantity.toExponential(2) : quantity.toLocaleString()} ${quantity === 1 ? singular : plural}` : ""; }).filter(Boolean).slice(0, 2).join(", ");
}
