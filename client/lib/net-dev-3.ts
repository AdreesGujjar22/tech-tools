export type Ipv4RangeResult = { start: string; end: string; cidr: string; total: number; addresses: string[]; truncated: boolean };

function ipToNumber(value: string) {
  const parts = value.trim().split(".");
  if (parts.length !== 4 || parts.some((part) => !/^(0|[1-9]\d{0,2})$/.test(part) || Number(part) > 255)) throw new Error("Invalid IPv4 address");
  return parts.reduce((result, part) => result * 256 + Number(part), 0);
}
function numberToIp(value: number) { return [(value >>> 24) & 255, (value >>> 16) & 255, (value >>> 8) & 255, value & 255].join("."); }
function parseCidr(value: string) { const [rawIp, rawPrefix] = value.trim().split("/"); const ip = ipToNumber(rawIp); const prefix = Number(rawPrefix); if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) throw new Error("Invalid CIDR prefix"); const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0; const start = (ip & mask) >>> 0; const end = (start | (~mask >>> 0)) >>> 0; return { start, end, prefix }; }
function cidrForRange(start: number, end: number) { let prefix = 32; for (let bit = 31; bit >= 0; bit -= 1) { if (((start >>> bit) & 1) !== ((end >>> bit) & 1)) { prefix = bit; break; } } const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0; const network = (start & mask) >>> 0; return `${numberToIp(network)}/${prefix}`; }

export function expandIpv4Range(startInput: string, endInput: string, limit = 1024): Ipv4RangeResult {
  const startParsed = startInput.includes("/") ? parseCidr(startInput) : { start: ipToNumber(startInput), end: ipToNumber(startInput) };
  const endParsed = endInput.trim() ? (endInput.includes("/") ? parseCidr(endInput) : { start: ipToNumber(endInput), end: ipToNumber(endInput) }) : startParsed;
  const start = startInput.includes("/") && !endInput.trim() ? startParsed.start : startParsed.start;
  const end = startInput.includes("/") && !endInput.trim() ? startParsed.end : endParsed.end;
  if (end < start) throw new Error("The end address must not be lower than the start address");
  if (!Number.isInteger(limit) || limit < 1 || limit > 65536) throw new Error("The output limit must be between 1 and 65536");
  const total = end - start + 1;
  const addresses = Array.from({ length: Math.min(total, limit) }, (_, index) => numberToIp(start + index));
  return { start: numberToIp(start), end: numberToIp(end), cidr: cidrForRange(start, end), total, addresses, truncated: total > limit };
}

export type XmlIndent = "2" | "4" | "tab";
export function formatXml(input: string, indent: XmlIndent = "2") {
  const source = input.trim();
  if (!source) return "";
  if (!/^<[^>]+>/.test(source) || /<[^>]*$/.test(source)) throw new Error("Invalid XML syntax");
  const tokens = source.replace(/>\s+</g, "><").match(/<[^>]+>|[^<]+/g) ?? [];
  const stack: string[] = [];
  const unit = indent === "tab" ? "\t" : " ".repeat(Number(indent));
  const lines: string[] = [];
  for (const token of tokens) {
    const value = token.trim();
    if (!value) continue;
    if (value.startsWith("<?") || value.startsWith("<!")) { lines.push(`${unit.repeat(stack.length)}${value}`); continue; }
    if (value.startsWith("</")) { if (!stack.length || stack.pop() !== value.slice(2, -1).trim()) throw new Error("Invalid XML nesting"); lines.push(`${unit.repeat(stack.length)}${value}`); continue; }
    const selfClosing = value.endsWith("/>");
    if (value.startsWith("<")) { lines.push(`${unit.repeat(stack.length)}${value}`); if (!selfClosing) stack.push(value.slice(1, -1).trim().split(/\s+/, 1)[0]); }
    else { if (!stack.length) throw new Error("Invalid XML text"); lines[lines.length - 1] += value; }
  }
  if (stack.length) throw new Error("Invalid XML nesting");
  return lines.join("\n");
}

export function decodeOutlookSafelink(value: string) {
  let url: URL;
  try { url = new URL(value.trim()); } catch { throw new Error("Invalid URL"); }
  if (!/\.safelinks\.protection\.outlook\.com$/i.test(url.hostname)) throw new Error("This is not an Outlook SafeLink URL");
  const target = url.searchParams.get("url");
  if (!target) throw new Error("The SafeLink does not contain a target URL");
  try { return decodeURIComponent(target.replace(/&amp;/g, "&")); } catch { return target.replace(/&amp;/g, "&"); }
}

export type GitMemoCommand = { category: string; command: string; description: string };
export const gitMemoCommands: GitMemoCommand[] = [
  { category: "Setup", command: "git config --global user.name \"[name]\"", description: "Set your global author name" },
  { category: "Setup", command: "git config --global user.email \"[email]\"", description: "Set your global author email" },
  { category: "Setup", command: "git init", description: "Create a repository" },
  { category: "Setup", command: "git clone [url]", description: "Clone an existing repository" },
  { category: "Branching", command: "git branch", description: "List local branches" },
  { category: "Branching", command: "git switch -c [branch]", description: "Create and switch to a branch" },
  { category: "Branching", command: "git merge [branch]", description: "Merge a branch into the current branch" },
  { category: "Stashing", command: "git stash", description: "Temporarily save tracked changes" },
  { category: "Stashing", command: "git stash pop", description: "Restore the latest stash" },
  { category: "Inspection", command: "git status", description: "Show working tree status" },
  { category: "Inspection", command: "git log --oneline", description: "View compact commit history" },
  { category: "Inspection", command: "git diff", description: "Show unstaged changes" },
  { category: "Undo", command: "git restore [file]", description: "Discard unstaged file changes" },
  { category: "Undo", command: "git reset HEAD~1", description: "Undo the latest commit and keep changes" },
  { category: "Undo", command: "git commit --amend --no-edit", description: "Add changes to the latest commit" },
];
