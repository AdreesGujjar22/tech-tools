export function encodeBase64(value: string, urlSafe = false) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  const encoded = btoa(binary);
  return urlSafe ? encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : encoded;
}

export function decodeBase64(value: string, urlSafe = false) {
  const normalized = value.trim().replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(padded)) throw new Error("Invalid base64");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

function words(value: string) {
  return value.replace(/([a-z\d])([A-Z])/g, "$1 $2").split(/[^\p{L}\p{N}]+/u).filter(Boolean);
}
function title(value: string) { return value ? value[0].toLocaleUpperCase() + value.slice(1).toLocaleLowerCase() : ""; }
export function convertCases(value: string) {
  const parts = words(value).map((part) => part.toLocaleLowerCase());
  return { lowercase: value.toLocaleLowerCase(), uppercase: value.toLocaleUpperCase(), camelCase: parts.map((part, index) => index ? title(part) : part).join(""), capitalCase: parts.map(title).join(" "), constantCase: parts.map((part) => part.toLocaleUpperCase()).join("_"), dotCase: parts.join("."), headerCase: parts.map(title).join(" "), noCase: parts.join(" "), kebabCase: parts.join("-"), PascalCase: parts.map(title).join(""), pathCase: parts.join("/"), sentenceCase: parts.length ? `${title(parts.join(" "))}.` : "", snakeCase: parts.join("_"), mockingCase: [...value].map((char, index) => index % 2 ? char.toLocaleLowerCase() : char.toLocaleUpperCase()).join("") };
}

export function encodeUrl(value: string) { return encodeURIComponent(value); }
export function decodeUrl(value: string) { return decodeURIComponent(value); }

function scalar(value: string): unknown {
  const trimmed = value.trim();
  if (trimmed === "null") return null;
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  if ((trimmed.startsWith("\"") && trimmed.endsWith("\"")) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) return trimmed.slice(1, -1);
  return trimmed;
}

export function jsonToYaml(value: string) {
  const data = JSON.parse(value) as unknown;
  const render = (item: unknown, indent: number): string => {
    const pad = " ".repeat(indent);
    if (Array.isArray(item)) return item.length ? item.map((entry) => typeof entry === "object" && entry !== null ? `${pad}-\n${render(entry, indent + 2)}` : `${pad}- ${formatScalar(entry)}`).join("\n") : `${pad}[]`;
    if (item && typeof item === "object") { const entries = Object.entries(item); return entries.length ? entries.map(([key, entry]) => typeof entry === "object" && entry !== null ? `${pad}${key}:\n${render(entry, indent + 2)}` : `${pad}${key}: ${formatScalar(entry)}`).join("\n") : `${pad}{}`; }
    return `${pad}${formatScalar(item)}`;
  };
  return render(data, 0);
}
function formatScalar(value: unknown) { if (value === null) return "null"; if (typeof value === "string") return /^[\w ./-]+$/.test(value) ? value : JSON.stringify(value); return String(value); }

export function yamlToJson(value: string) {
  const lines = value.split(/\r?\n/).filter((line) => line.trim() && !line.trim().startsWith("#"));
  if (!lines.length) return "";
  const parseBlock = (start: number, indent: number): [unknown, number] => { const array = lines[start].trimStart().startsWith("-"); const result: Record<string, unknown> = {}; const list: unknown[] = []; let i = start; while (i < lines.length) { const line = lines[i]; const currentIndent = line.search(/\S|$/); if (currentIndent < indent) break; if (currentIndent > indent) throw new Error("Invalid YAML indentation"); const text = line.trim(); if (array) { if (!text.startsWith("-")) break; const content = text.slice(1).trim(); if (!content) { const [child, next] = parseBlock(i + 1, indent + 2); list.push(child); i = next; } else { list.push(scalar(content)); i++; } } else { const colon = text.indexOf(":"); if (colon < 1) throw new Error("Invalid YAML mapping"); const key = text.slice(0, colon).trim(); const content = text.slice(colon + 1).trim(); if (content) { result[key] = scalar(content); i++; } else { const [child, next] = parseBlock(i + 1, indent + 2); result[key] = child; i = next; } } } return [array ? list : result, i]; };
  const [parsed] = parseBlock(0, lines[0].search(/\S|$/));
  return JSON.stringify(parsed, null, 3);
}
