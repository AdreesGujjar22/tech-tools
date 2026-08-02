const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bytesToBase64(bytes: Uint8Array) { let binary = ""; for (const byte of bytes) binary += String.fromCharCode(byte); return btoa(binary); }
function base64ToBytes(value: string) { const binary = atob(value); return Uint8Array.from(binary, (character) => character.charCodeAt(0)); }
function bytesToHex(bytes: Uint8Array) { return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(""); }
function concat(...arrays: Uint8Array[]) { const output = new Uint8Array(arrays.reduce((total, array) => total + array.length, 0)); let offset = 0; for (const array of arrays) { output.set(array, offset); offset += array.length; } return output; }

async function deriveAesKey(passphrase: string, salt: Uint8Array, mode: "GCM" | "CBC", usage: KeyUsage[]) {
  const material = await crypto.subtle.importKey("raw", encoder.encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "PBKDF2", salt: salt as unknown as BufferSource, iterations: 100000, hash: "SHA-256" }, material, { name: `AES-${mode}`, length: 256 }, false, usage);
}

export type AesMode = "GCM" | "CBC";
export async function encryptAes(plainText: string, passphrase: string, mode: AesMode) {
  if (!passphrase) throw new Error("Passphrase is required");
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(mode === "GCM" ? 12 : 16));
  const key = await deriveAesKey(passphrase, salt, mode, ["encrypt"]);
  const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: `AES-${mode}`, iv }, key, encoder.encode(plainText)));
  return bytesToBase64(concat(new Uint8Array([1, mode === "GCM" ? 1 : 2]), salt, iv, encrypted));
}

export async function decryptAes(payload: string, passphrase: string, mode: AesMode) {
  if (!passphrase) throw new Error("Passphrase is required");
  const bytes = base64ToBytes(payload.trim());
  const expectedMode = mode === "GCM" ? 1 : 2;
  if (bytes.length < 20 || bytes[0] !== 1 || bytes[1] !== expectedMode) throw new Error("Invalid encrypted payload");
  const salt = bytes.slice(2, 18);
  const ivLength = mode === "GCM" ? 12 : 16;
  const iv = bytes.slice(18, 18 + ivLength);
  const encrypted = bytes.slice(18 + ivLength);
  const key = await deriveAesKey(passphrase, salt, mode, ["decrypt"]);
  try { return decoder.decode(await crypto.subtle.decrypt({ name: `AES-${mode}`, iv }, key, encrypted)); } catch { throw new Error("Unable to decrypt: check the passphrase and mode"); }
}

function leftRotate(value: number, amount: number) { return (value << amount) | (value >>> (32 - amount)); }
function md5(input: Uint8Array) {
  const bitLength = input.length * 8; const paddingLength = ((56 - (input.length % 64) + 64) % 64) || 64; const padding = new Uint8Array(paddingLength); padding[0] = 0x80; const data = concat(input, padding); new DataView(data.buffer).setUint32(data.length - 8, bitLength >>> 0, true); new DataView(data.buffer).setUint32(data.length - 4, Math.floor(bitLength / 0x100000000), true);
  let a0 = 0x67452301; let b0 = 0xefcdab89; let c0 = 0x98badcfe; let d0 = 0x10325476;
  const shifts = [7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21];
  const constants = Array.from({ length: 64 }, (_, index) => Math.floor(Math.abs(Math.sin(index + 1)) * 0x100000000));
  for (let offset = 0; offset < data.length; offset += 64) { const words = Array.from({ length: 16 }, (_, index) => new DataView(data.buffer).getUint32(offset + index * 4, true)); let a = a0; let b = b0; let c = c0; let d = d0; for (let i = 0; i < 64; i++) { let f: number; let g: number; if (i < 16) { f = (b & c) | (~b & d); g = i; } else if (i < 32) { f = (d & b) | (~d & c); g = (5 * i + 1) % 16; } else if (i < 48) { f = b ^ c ^ d; g = (3 * i + 5) % 16; } else { f = c ^ (b | ~d); g = (7 * i) % 16; } const next = d; d = c; c = b; b = (b + leftRotate((a + f + constants[i] + words[g]) >>> 0, shifts[i])) >>> 0; a = next; } a0 = (a0 + a) >>> 0; b0 = (b0 + b) >>> 0; c0 = (c0 + c) >>> 0; d0 = (d0 + d) >>> 0; }
  const output = new Uint8Array(16); const view = new DataView(output.buffer); view.setUint32(0, a0, true); view.setUint32(4, b0, true); view.setUint32(8, c0, true); view.setUint32(12, d0, true); return output;
}

function hmacMd5(message: Uint8Array, secret: Uint8Array) { let key = secret.length > 64 ? md5(secret) : secret; const padded = new Uint8Array(64); padded.set(key); const outer = padded.map((value) => value ^ 0x5c); const inner = padded.map((value) => value ^ 0x36); return md5(concat(outer, md5(concat(inner, message)))); }
export type HmacAlgorithm = "SHA-1" | "SHA-384" | "SHA-256" | "SHA-512" | "MD5";
export type HmacEncoding = "hex" | "base64";
export async function generateHmac(message: string, secret: string, algorithm: HmacAlgorithm, encoding: HmacEncoding) { if (!secret) throw new Error("Secret key is required"); const digest = algorithm === "MD5" ? hmacMd5(encoder.encode(message), encoder.encode(secret)) : new Uint8Array(await crypto.subtle.sign({ name: "HMAC" }, await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: algorithm }, false, ["sign"]), encoder.encode(message))); return encoding === "hex" ? bytesToHex(digest) : bytesToBase64(digest); }

function pem(label: string, bytes: ArrayBuffer) { const base64 = bytesToBase64(new Uint8Array(bytes)); return `-----BEGIN ${label}-----\n${base64.match(/.{1,64}/g)!.join("\n")}\n-----END ${label}-----`; }
export async function generateRsaKeyPair(bits: 1024 | 2048 | 4096) { const pair = await crypto.subtle.generateKey({ name: "RSA-OAEP", modulusLength: bits, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["encrypt", "decrypt"]); return { publicKey: pem("PUBLIC KEY", await crypto.subtle.exportKey("spki", pair.publicKey)), privateKey: pem("PRIVATE KEY", await crypto.subtle.exportKey("pkcs8", pair.privateKey)) }; }

export type PdfSignatureInfo = { index: number; byteRange: string; contentsLength: number; hasSignatureObject: boolean };
export function inspectPdfSignatures(bytes: ArrayBuffer) { const text = new TextDecoder("latin1").decode(bytes); if (!text.startsWith("%PDF-")) throw new Error("The selected file is not a PDF"); const matches = [...text.matchAll(/\/ByteRange\s*\[([^\]]+)\][\s\S]{0,5000}?\/Contents\s*<([0-9a-fA-F\s]+)>/g)]; return matches.map((match, index) => ({ index: index + 1, byteRange: match[1].trim(), contentsLength: match[2].replace(/\s/g, "").length / 2, hasSignatureObject: /\/Sig\b/.test(text.slice(Math.max(0, (match.index ?? 0) - 1000), (match.index ?? 0) + match[0].length)) })); }
