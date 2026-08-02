export type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

const bareKey = /^[A-Za-z0-9_-]+$/;
const tomlKey = (key: string) => bareKey.test(key) ? key : JSON.stringify(key);
const tomlString = (value: string) => JSON.stringify(value).replace(/\u2028|\u2029/g, (char) => char === "\u2028" ? "\\u2028" : "\\u2029");
const isRecord = (value: JsonValue): value is Record<string, JsonValue> => typeof value === "object" && value !== null && !Array.isArray(value);
const isPrimitive = (value: JsonValue) => value === null || typeof value === "boolean" || typeof value === "number" || typeof value === "string";

function tomlValue(value: JsonValue): string {
  if (value === null) return '""';
  if (typeof value === "string") return tomlString(value);
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error("TOML does not support non-finite numbers.");
    return String(value);
  }
  if (typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return `[${value.map((item) => isRecord(item) ? `{ ${Object.entries(item).map(([key, nested]) => `${tomlKey(key)} = ${tomlValue(nested)}`).join(", ")} }` : tomlValue(item)).join(", ")}]`;
  throw new Error("Objects must be written as TOML tables.");
}

function writeTable(value: Record<string, JsonValue>, path: string[], output: string[], header = false) {
  if (header) output.push(`[${path.map(tomlKey).join(".")}]`);
  for (const [key, nested] of Object.entries(value)) if (!isRecord(nested) && !(Array.isArray(nested) && nested.some(isRecord))) output.push(`${tomlKey(key)} = ${tomlValue(nested)}`);
  for (const [key, nested] of Object.entries(value)) {
    const childPath = [...path, key];
    if (isRecord(nested)) {
      if (output.length && output.at(-1) !== "") output.push("");
      writeTable(nested, childPath, output, true);
    } else if (Array.isArray(nested) && nested.every(isRecord)) {
      for (const item of nested) {
        if (output.length && output.at(-1) !== "") output.push("");
        output.push(`[[${childPath.map(tomlKey).join(".")}]]`);
        writeTable(item, childPath, output);
      }
    }
  }
}

export function jsonToToml(input: string): string {
  const parsed = JSON.parse(input) as JsonValue;
  if (isRecord(parsed)) {
    const output: string[] = [];
    writeTable(parsed, [], output);
    return output.join("\n").trim();
  }
  return `value = ${tomlValue(parsed)}`;
}

export type DiffLine = { left?: string; right?: string; status: "same" | "added" | "removed" | "modified" };
export function compareLines(left: string, right: string): DiffLine[] {
  const original = left.split("\n");
  const changed = right.split("\n");
  const matrix = Array.from({ length: original.length + 1 }, () => Array<number>(changed.length + 1).fill(0));
  for (let i = original.length - 1; i >= 0; i--) for (let j = changed.length - 1; j >= 0; j--) matrix[i][j] = original[i] === changed[j] ? matrix[i + 1][j + 1] + 1 : Math.max(matrix[i + 1][j], matrix[i][j + 1]);
  const lines: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < original.length || j < changed.length) {
    if (i < original.length && j < changed.length && original[i] === changed[j]) lines.push({ left: original[i++], right: changed[j++], status: "same" });
    else if (j < changed.length && (i === original.length || matrix[i][j + 1] > matrix[i + 1][j])) lines.push({ right: changed[j++], status: "added" });
    else lines.push({ left: original[i++], status: "removed" });
  }
  const merged: DiffLine[] = [];
  for (let index = 0; index < lines.length; index++) {
    const current = lines[index];
    const next = lines[index + 1];
    if (current.status === "removed" && next?.status === "added") { merged.push({ left: current.left, right: next.right, status: "modified" }); index++; }
    else merged.push(current);
  }
  return merged;
}

const toNumber = (ip: string) => { const octets = ip.trim().split(".").map(Number); if (octets.length !== 4 || octets.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) throw new Error("Enter a valid IPv4 address."); return (((octets[0] * 256 + octets[1]) * 256 + octets[2]) * 256 + octets[3]) >>> 0; };
const toIp = (value: number) => [value >>> 24, (value >>> 16) & 255, (value >>> 8) & 255, value & 255].join(".");
export function calculateIpv4Subnet(ipAddress: string, cidr: number) {
  if (!Number.isInteger(cidr) || cidr < 0 || cidr > 32) throw new Error("CIDR prefix must be between 0 and 32.");
  const ip = toNumber(ipAddress);
  const netmaskValue = cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0;
  const networkValue = (ip & netmaskValue) >>> 0;
  const broadcastValue = (networkValue | (~netmaskValue >>> 0)) >>> 0;
  const hostCount = 2 ** (32 - cidr);
  const totalUsable = cidr === 32 ? 1 : cidr === 31 ? 2 : hostCount - 2;
  const first = cidr >= 31 ? networkValue : networkValue + 1;
  const last = cidr >= 31 ? broadcastValue : broadcastValue - 1;
  const firstOctet = ip >>> 24;
  return { netmask: toIp(netmaskValue), wildcard: toIp(~netmaskValue >>> 0), network: toIp(networkValue), broadcast: toIp(broadcastValue), firstUsable: toIp(first), lastUsable: toIp(last), totalUsable, ipClass: firstOctet < 128 ? "A" : firstOctet < 192 ? "B" : firstOctet < 224 ? "C" : firstOctet < 240 ? "D" : "E" };
}

export function calculateCompletionEta(total: number, completed: number, speed: number, unitMs: number, now = Date.now()) {
  const remaining = Math.max(0, total - completed);
  const remainingMs = speed > 0 ? remaining / speed * unitMs : null;
  return { remaining, remainingMs, finishAt: remainingMs === null ? null : now + remainingMs, progress: total > 0 ? Math.min(100, Math.max(0, completed / total * 100)) : 0 };
}

export function formatDuration(milliseconds: number | null) {
  if (milliseconds === null || !Number.isFinite(milliseconds)) return "—";
  const seconds = Math.ceil(Math.max(0, milliseconds) / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return [hours && `${hours}h`, minutes && `${minutes}m`, `${seconds % 60}s`].filter(Boolean).join(" ");
}
