export type DiffStatus = "added" | "removed" | "unchanged" | "updated" | "children-updated";
export type JsonDifference = {
  key: string | number;
  type: "object" | "array" | "value";
  status: DiffStatus;
  oldValue: unknown;
  value: unknown;
  children?: JsonDifference[];
};

export function parseJson(value: string) {
  return JSON.parse(value) as unknown;
}

function valueType(value: unknown): JsonDifference["type"] {
  if (Array.isArray(value)) return "array";
  return value !== null && typeof value === "object" ? "object" : "value";
}

function deepEqual(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) return true;
  if (valueType(left) !== valueType(right) || left === null || right === null || typeof left !== "object" || typeof right !== "object") return false;
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  return leftKeys.length === rightKeys.length && leftKeys.every((key) => Object.prototype.hasOwnProperty.call(right, key) && deepEqual((left as Record<string, unknown>)[key], (right as Record<string, unknown>)[key]));
}

function differenceStatus(oldValue: unknown, value: unknown): DiffStatus {
  if (oldValue === undefined) return "added";
  if (value === undefined) return "removed";
  if (deepEqual(oldValue, value)) return "unchanged";
  return valueType(oldValue) === valueType(value) && valueType(value) !== "value" ? "children-updated" : "updated";
}

function buildDifference(oldValue: unknown, value: unknown, key: string | number, onlyShowDifferences: boolean): JsonDifference {
  const type = valueType(oldValue);
  const status = differenceStatus(oldValue, value);
  if (type === "object" && valueType(value) === "object") {
    const keys = [...Object.keys(oldValue as object), ...Object.keys(value as object).filter((childKey) => !Object.prototype.hasOwnProperty.call(oldValue, childKey))];
    const children = keys.map((childKey) => buildDifference((oldValue as Record<string, unknown>)[childKey], (value as Record<string, unknown>)[childKey], childKey, onlyShowDifferences)).filter((child) => !onlyShowDifferences || child.status !== "unchanged");
    return { key, type, status, oldValue, value, children };
  }
  if (type === "array" && valueType(value) === "array") {
    const length = Math.max((oldValue as unknown[]).length, (value as unknown[]).length);
    const children = Array.from({ length }, (_, index) => buildDifference((oldValue as unknown[])[index], (value as unknown[])[index], index, onlyShowDifferences)).filter((child) => !onlyShowDifferences || child.status !== "unchanged");
    return { key, type, status, oldValue, value, children };
  }
  return { key, type, status, oldValue, value };
}

export function jsonDiff(left: unknown, right: unknown, onlyShowDifferences = false) {
  return buildDifference(left, right, "root", onlyShowDifferences);
}

export function formatDiffValue(value: unknown) {
  return value === undefined ? "" : JSON.stringify(value, null, 2);
}

export function slugify(value: string, separator: "-" | "_" | "." = "-") {
  const transliterated = value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[ß]/g, "ss").replace(/[æÆ]/g, "ae").replace(/[œŒ]/g, "oe").replace(/[øØ]/g, "o").replace(/[đĐ]/g, "d").replace(/[łŁ]/g, "l");
  return transliterated.toLocaleLowerCase().replace(/[^\p{Letter}\p{Number}]+/gu, separator).replace(new RegExp(`^${separator}+|${separator}+$`, "g"), "").replace(new RegExp(`${separator}{2,}`, "g"), separator);
}

export type AsciiStyle = "standard" | "block" | "slant" | "framed" | "binary";
const glyphs: Record<string, string[]> = {
  A:[" ### ","#   #","#####","#   #","#   #"], B:["#### ","#   #","#### ","#   #","#### "], C:[" ####","#    ","#    ","#    "," ####"], D:["#### ","#   #","#   #","#   #","#### "], E:["#####","#    ","#### ","#    ","#####"], F:["#####","#    ","#### ","#    ","#    "], G:[" ####","#    ","# ###","#   #"," ####"], H:["#   #","#   #","#####","#   #","#   #"], I:["#####","  #  ","  #  ","  #  ","#####"], J:["  ###","   # ","   # ","#  # "," ##  "], K:["#   #","#  # ","###  ","#  # ","#   #"], L:["#    ","#    ","#    ","#    ","#####"], M:["#   #","## ##","# # #","#   #","#   #"], N:["#   #","##  #","# # #","#  ##","#   #"], O:[" ### ","#   #","#   #","#   #"," ### "], P:["#### ","#   #","#### ","#    ","#    "], Q:[" ### ","#   #","#   #","#  ##"," ####"], R:["#### ","#   #","#### ","#  # ","#   #"], S:[" ####","#    "," ### ","    #","#### "], T:["#####","  #  ","  #  ","  #  ","  #  "], U:["#   #","#   #","#   #","#   #"," ### "], V:["#   #","#   #","#   #"," # # ","  #  "], W:["#   #","#   #","# # #","## ##","#   #"], X:["#   #"," # # ","  #  "," # # ","#   #"], Y:["#   #"," # # ","  #  ","  #  ","  #  "], Z:["#####","   # ","  #  "," #   ","#####"], "0":[" ### ","#  ##","# # #","##  #"," ### "], "1":["  #  "," ##  ","  #  ","  #  ","#####"], "2":[" ### ","#   #","   # ","  #  ","#####"], "3":["#### ","    #"," ### ","    #","#### "], "4":["#  # ","#  # ","#####","   # ","   # "], "5":["#####","#    ","#### ","    #","#### "], "6":[" ### ","#    ","#### ","#   #"," ### "], "7":["#####","   # ","  #  "," #   ","#    "], "8":[" ### ","#   #"," ### ","#   #"," ### "], "9":[" ### ","#   #"," ####","    #"," ### "], "?":[" ### ","#   #","  ## ","     ","  #  "], " ":["   ","   ","   ","   ","   "]
};

export function asciiArt(value: string, style: AsciiStyle) {
  if (style === "binary") return Array.from(value).map((character) => character.codePointAt(0)!.toString(2).padStart(8, "0")).join(" ");
  if (style === "framed") { const width = Math.max(1, value.length); const line = `+${"-".repeat(width + 2)}+`; return `${line}\n| ${value.padEnd(width)} |\n${line}`; }
  const lines = Array.from({ length: 5 }, (_, row) => Array.from(value.toUpperCase()).map((character) => (glyphs[character] ?? glyphs["?"])[row]).join("  "));
  if (style === "block") return lines.map((line) => line.replace(/#/g, "██").replace(/ /g, "  ")).join("\n");
  if (style === "slant") return lines.map((line, index) => `${" ".repeat(4 - index)}${line}`).join("\n");
  return lines.join("\n");
}

export type Ipv4Notation = "dotted" | "decimal" | "hex" | "octal" | "binary";

function ipv4Integer(value: string, notation: Ipv4Notation) {
  const trimmed = value.trim();
  if (notation === "dotted") {
    const parts = trimmed.split(".");
    if (parts.length !== 4 || parts.some((part) => !/^(0|[1-9]\d{0,2})$/.test(part) || Number(part) > 255)) throw new Error("Invalid IPv4 address");
    return parts.reduce((result, part) => result * 256 + Number(part), 0);
  }
  const prefixes: Record<Exclude<Ipv4Notation, "dotted">, RegExp> = { decimal: /^(?:0|[1-9]\d*)$/, hex: /^(?:0x)?[\da-f]+$/i, octal: /^(?:0o)?[0-7]+$/i, binary: /^(?:0b)?[01]+$/i };
  if (!prefixes[notation].test(trimmed)) throw new Error("Invalid IPv4 value");
  const radix = notation === "decimal" ? 10 : notation === "hex" ? 16 : notation === "octal" ? 8 : 2;
  const parsed = Number.parseInt(trimmed.replace(/^0[xob]/i, ""), radix);
  if (!Number.isSafeInteger(parsed) || parsed < 0 || parsed > 0xffffffff) throw new Error("Invalid IPv4 value");
  return parsed;
}

export function convertIPv4(value: string, notation: Ipv4Notation) {
  const integer = ipv4Integer(value, notation);
  const parts = [(integer >>> 24) & 255, (integer >>> 16) & 255, (integer >>> 8) & 255, integer & 255];
  return { dotted: parts.join("."), decimal: String(integer), hexadecimal: `0x${integer.toString(16).toUpperCase().padStart(8, "0")}`, octal: `0o${integer.toString(8).padStart(11, "0")}`, binary: `0b${integer.toString(2).padStart(32, "0")}` };
}
