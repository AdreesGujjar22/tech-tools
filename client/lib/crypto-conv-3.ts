import bcrypt from "bcryptjs";
import { generateMnemonic, validateMnemonic, wordlists } from "bip39";

const bip39Strength: Record<12 | 15 | 18 | 21 | 24, number> = { 12: 128, 15: 160, 18: 192, 21: 224, 24: 256 };
export type Bip39WordCount = keyof typeof bip39Strength;

export function generateBip39Passphrase(words: Bip39WordCount) {
  return generateMnemonic(bip39Strength[words], undefined, wordlists.english);
}

export function isValidBip39Passphrase(value: string) {
  return validateMnemonic(value.trim(), wordlists.english);
}

export function hashBcrypt(value: string, rounds: number) {
  return bcrypt.hashSync(value, rounds);
}

export function verifyBcrypt(value: string, hash: string) {
  try {
    return bcrypt.compareSync(value, hash);
  } catch {
    return false;
  }
}

const natoEntries: Array<[string, string]> = [
  ...Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ", (letter, index) => [letter, ["Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", "Juliett", "Kilo", "Lima", "Mike", "November", "Oscar", "Papa", "Quebec", "Romeo", "Sierra", "Tango", "Uniform", "Victor", "Whiskey", "X-ray", "Yankee", "Zulu"][index]] as [string, string]),
  ...Array.from("0123456789", (digit, index) => [digit, ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Niner"][index]] as [string, string]),
  [" ", "Space"], [".", "Period"], [",", "Comma"], ["?", "QuestionMark"], ["!", "ExclamationMark"], ["-", "Hyphen"], ["_", "Underscore"], ["/", "Slash"], [":", "Colon"], [";", "Semicolon"], ["@", "At"], ["#", "Hash"], ["$", "Dollar"], ["%", "Percent"], ["&", "Ampersand"], ["(", "LeftParenthesis"], [")", "RightParenthesis"], ["+", "Plus"], ["=", "Equals"], ["*", "Asterisk"], ["'", "Apostrophe"], ["\"", "Quote"], ["\\", "Backslash"],
];
const natoEncode = new Map(natoEntries);
const natoDecode = new Map(natoEntries.map(([character, code]) => [code.toLowerCase(), character]));

export function textToNato(value: string, delimiter = " ") {
  return Array.from(value, character => natoEncode.get(character.toUpperCase()) || character).join(delimiter);
}

export function natoToText(value: string, delimiter = " ") {
  if (!value) return "";
  if (!delimiter) return value;
  return value.split(delimiter).map(token => natoDecode.get(token.trim().toLowerCase()) || token).join("");
}

export function textToUnicode(value: string, format: "codePoint" | "escape" = "codePoint") {
  return Array.from(value, character => {
    const codePoint = character.codePointAt(0)!;
    const hex = codePoint.toString(16).toUpperCase();
    return format === "codePoint" ? `U+${hex.padStart(4, "0")}` : codePoint <= 0xffff ? `\\u${hex.padStart(4, "0")}` : `\\u{${hex}}`;
  }).join(" ");
}

export function unicodeToText(value: string) {
  return value.replace(/(?:U\+([0-9a-fA-F]{2,6})|\\u\{([0-9a-fA-F]{1,6})\}|\\u([0-9a-fA-F]{4}))/g, (token, codePointHex, bracedHex, escapedHex) => {
    const codePoint = Number.parseInt(codePointHex || bracedHex || escapedHex, 16);
    return codePoint <= 0x10ffff && !(codePoint >= 0xd800 && codePoint <= 0xdfff) ? String.fromCodePoint(codePoint) : token;
  });
}
