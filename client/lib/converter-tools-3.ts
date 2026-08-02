export type ListSort = "none" | "alphabetic" | "numeric" | "length";

function escapeXml(value: string) { return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;"); }
function nodeToJson(node: Element): Record<string, unknown> {
  const output: Record<string, unknown> = {};
  if (node.attributes.length) output["@attributes"] = Object.fromEntries(Array.from(node.attributes, (attribute) => [attribute.name, attribute.value]));
  const childGroups: Record<string, unknown[]> = {};
  let text = "";
  for (const child of Array.from(node.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE || child.nodeType === Node.CDATA_SECTION_NODE) { if (child.textContent?.trim()) text += child.textContent.trim(); continue; }
    if (child.nodeType === Node.ELEMENT_NODE) { const element = child as Element; (childGroups[element.tagName] ||= []).push(nodeToJson(element)); }
  }
  for (const [key, values] of Object.entries(childGroups)) output[key] = values.length === 1 ? values[0] : values;
  if (text) output["#text"] = text;
  return output;
}

export function xmlToJson(input: string) {
  const source = input.trim(); if (!source) return "";
  const document = new DOMParser().parseFromString(source, "application/xml");
  if (document.querySelector("parsererror")) throw new Error("Invalid XML syntax");
  const root = document.documentElement; if (!root) throw new Error("XML root element is required");
  return JSON.stringify({ [root.tagName]: nodeToJson(root) }, null, 2);
}

function jsonValueToXml(name: string, value: unknown): string {
  const tag = name.replace(/[^A-Za-z0-9_.:-]/g, "_").replace(/^[^A-Za-z_:]/, "_") || "item";
  if (Array.isArray(value)) return value.map((item) => jsonValueToXml(tag, item)).join("");
  if (value === null || value === undefined) return `<${tag}/>`;
  if (typeof value !== "object") return `<${tag}>${escapeXml(String(value))}</${tag}>`;
  const record = value as Record<string, unknown>; const attributes = record["@attributes"] && typeof record["@attributes"] === "object" ? Object.entries(record["@attributes"] as Record<string, unknown>).map(([key, item]) => ` ${key.replace(/[^A-Za-z0-9_.:-]/g, "_")}="${escapeXml(String(item))}"`).join("") : "";
  const body = Object.entries(record).filter(([key]) => key !== "@attributes").map(([key, item]) => key === "#text" ? escapeXml(String(item)) : jsonValueToXml(key, item)).join("");
  return body ? `<${tag}${attributes}>${body}</${tag}>` : `<${tag}${attributes}/>`;
}
export function jsonToXml(input: string, rootTag: string) { const parsed = JSON.parse(input) as unknown; const tag = rootTag.trim() || "root"; if (!/^[A-Za-z_][A-Za-z0-9_.:-]*$/.test(tag)) throw new Error("Invalid root element name"); if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) return jsonValueToXml(tag, parsed); const entries = Object.entries(parsed as Record<string, unknown>); return `<${tag}>${entries.map(([key, value]) => jsonValueToXml(key, value)).join("")}</${tag}>`; }

export function convertList(input: string, options: { trim: boolean; unique: boolean; sort: ListSort; reverse: boolean; prefix: string; suffix: string; separator: string; listPrefix: string; listSuffix: string }) {
  let items = input.split(/\r?\n/); if (options.trim) items = items.map((item) => item.trim()); items = items.filter(Boolean); if (options.unique) items = [...new Set(items)]; if (options.sort === "alphabetic") items.sort((a, b) => a.localeCompare(b)); if (options.sort === "numeric") items.sort((a, b) => Number(a) - Number(b)); if (options.sort === "length") items.sort((a, b) => a.length - b.length); if (options.reverse) items.reverse(); items = items.map((item) => `${options.prefix}${item}${options.suffix}`); return `${options.listPrefix}${items.join(options.separator)}${options.listSuffix}`; }

function removeTomlComment(line: string) { let quoted = false; for (let i = 0; i < line.length; i += 1) { if (line[i] === '"' && line[i - 1] !== "\\") quoted = !quoted; if (line[i] === "#" && !quoted) return line.slice(0, i); } return line; }
function splitTopLevel(value: string, delimiter: string) { const parts: string[] = []; let start = 0; let depth = 0; let quote = false; for (let i = 0; i < value.length; i += 1) { const char = value[i]; if (char === '"' && value[i - 1] !== "\\") quote = !quote; if (!quote && "[{".includes(char)) depth += 1; if (!quote && "]}".includes(char)) depth -= 1; if (!quote && depth === 0 && char === delimiter) { parts.push(value.slice(start, i).trim()); start = i + 1; } } parts.push(value.slice(start).trim()); return parts.filter(Boolean); }
function parseTomlValue(value: string): unknown { const trimmed = value.trim(); if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) return trimmed.slice(1, -1); if (trimmed === "true" || trimmed === "false") return trimmed === "true"; if (/^[+-]?(?:\d[\d_]*)(?:\.\d+)?$/.test(trimmed)) return Number(trimmed.replace(/_/g, "")); if (trimmed.startsWith("[") && trimmed.endsWith("]")) return splitTopLevel(trimmed.slice(1, -1), ",").map(parseTomlValue); if (trimmed.startsWith("{") && trimmed.endsWith("}")) return Object.fromEntries(splitTopLevel(trimmed.slice(1, -1), ",").map((part) => { const index = part.indexOf("="); return [part.slice(0, index).trim().replace(/^['"]|['"]$/g, ""), parseTomlValue(part.slice(index + 1))]; })); return trimmed; }
function assignPath(target: Record<string, unknown>, path: string[], value: unknown) { let current = target; path.forEach((key, index) => { if (index === path.length - 1) current[key] = value; else { if (!current[key] || typeof current[key] !== "object" || Array.isArray(current[key])) current[key] = {}; current = current[key] as Record<string, unknown>; } }); }
export function tomlToJson(input: string) { const result: Record<string, unknown> = {}; let section: string[] = []; for (const rawLine of input.split(/\r?\n/)) { const line = removeTomlComment(rawLine).trim(); if (!line) continue; if (line.startsWith("[[") && line.endsWith("]]")) { section = line.slice(2, -2).split(".").map((item) => item.trim()); let current: Record<string, unknown> = result; section.slice(0, -1).forEach((key) => { if (!current[key] || typeof current[key] !== "object" || Array.isArray(current[key])) current[key] = {}; current = current[key] as Record<string, unknown>; }); const key = section.at(-1)!; if (!Array.isArray(current[key])) current[key] = []; (current[key] as unknown[]).push({}); } else if (line.startsWith("[") && line.endsWith("]")) section = line.slice(1, -1).split(".").map((item) => item.trim()); else { const index = line.indexOf("="); if (index < 1) throw new Error("Invalid TOML assignment"); const key = line.slice(0, index).trim().replace(/^['"]|['"]$/g, ""); const value = parseTomlValue(line.slice(index + 1)); assignPath(result, [...section, key], value); } } return JSON.stringify(result, null, 2); }
