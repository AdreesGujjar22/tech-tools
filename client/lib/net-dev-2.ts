export type MacDelimiter = ":" | "-" | "." | "";
export type MacCase = "uppercase" | "lowercase";

const ouiVendors: Record<string, string> = {
  "001C42": "Parallels, Inc.",
  "001B63": "Apple, Inc.",
  "3C5A37": "Google, Inc.",
  "B827EB": "Raspberry Pi Foundation",
  "DC:A6:32": "Raspberry Pi Foundation",
  "F0:18:98": "Apple, Inc.",
  "FC:FB:FB": "Apple, Inc.",
};

export function normalizeMac(value: string) {
  return value.replace(/[^0-9a-f]/gi, "").slice(0, 12).toUpperCase();
}

export function formatMac(value: string, delimiter: MacDelimiter = ":", casing: MacCase = "uppercase") {
  const hex = normalizeMac(value);
  const chunks = delimiter === "." ? hex.match(/.{1,4}/g) || [] : hex.match(/.{1,2}/g) || [];
  const formatted = chunks.join(delimiter);
  return casing === "lowercase" ? formatted.toLowerCase() : formatted;
}

export function lookupMacVendor(value: string) {
  const hex = normalizeMac(value);
  if (hex.length < 6) return { oui: hex, vendor: "" };
  const oui = hex.slice(0, 6);
  const colonOui = oui.match(/.{2}/g)!.join(":");
  return { oui, vendor: ouiVendors[oui] || ouiVendors[colonOui] || "Unknown vendor" };
}

function randomHex(length: number) {
  const bytes = new Uint8Array(Math.ceil(length / 2));
  crypto.getRandomValues(bytes);
  return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("").slice(0, length);
}

export function generateIpv6Ula() {
  const globalId = randomHex(10);
  const subnetId = randomHex(4);
  const prefix = `fd${globalId}`;
  const formatted = `${prefix.slice(0, 4)}:${prefix.slice(4, 8)}:${prefix.slice(8, 12)}`;
  return { globalId, subnetId, prefix: `${formatted}::/48`, firstSubnet: `${formatted}:0000::/64`, lastSubnet: `${formatted}:ffff::/64` };
}

export type Permission = { read: boolean; write: boolean; execute: boolean };
export type ChmodPermissions = { owner: Permission; group: Permission; others: Permission };

export function permissionDigit(permission: Permission) {
  return (permission.read ? 4 : 0) + (permission.write ? 2 : 0) + (permission.execute ? 1 : 0);
}

export function chmodOctal(permissions: ChmodPermissions) {
  return `${permissionDigit(permissions.owner)}${permissionDigit(permissions.group)}${permissionDigit(permissions.others)}`;
}

export function chmodSymbolic(permissions: ChmodPermissions) {
  const symbol = (permission: Permission) => `${permission.read ? "r" : "-"}${permission.write ? "w" : "-"}${permission.execute ? "x" : "-"}`;
  return `-${symbol(permissions.owner)}${symbol(permissions.group)}${symbol(permissions.others)}`;
}

export function randomPorts(quantity: number, min: number, max: number) {
  const ports = new Set<number>();
  const count = Math.min(quantity, max - min + 1);
  while (ports.size < count) ports.add(Math.floor(Math.random() * (max - min + 1)) + min);
  return [...ports].sort((a, b) => a - b);
}
