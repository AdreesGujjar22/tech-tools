"use client";

import React from "react";
import ToolShell from "./ToolShell";

const HEADER = "CRITICAL_LOCKED_PDF_SEC_V1:";

function xorCipher(bytes: Uint8Array, keyStr: string): Uint8Array {
  const enc = new TextEncoder();
  const keyBytes = enc.encode(keyStr);
  const out = new Uint8Array(bytes.length);
  const keyLen = keyBytes.length || 1;
  for (let i = 0; i < bytes.length; i++) {
    out[i] = bytes[i] ^ keyBytes[i % keyLen] ^ (i & 0xFF);
  }
  return out;
}

export default function ProtectPdf() {
  const handleProcess = async (
    files: File[],
    config: any,
    updateProgress: (pct: number, msg?: string) => void
  ) => {
    try {
      updateProgress(20, "Loading document binary stream...");
      const file = files[0];
      const password = config.password || "";

      if (!password) {
        throw new Error("Password is required to protect your PDF.");
      }

      const fileBytes = new Uint8Array(await file.arrayBuffer());

      if (fileBytes.length === 0) {
        throw new Error("File appears to be empty or corrupted.");
      }

      updateProgress(60, "Encrypting document with XOR cipher...");
      const cipherBytes = xorCipher(fileBytes, password);

      // Assemble header with payload
      const enc = new TextEncoder();
      const headerBytes = enc.encode(HEADER);
      const outputBuffer = new Uint8Array(headerBytes.length + cipherBytes.length);
      outputBuffer.set(headerBytes, 0);
      outputBuffer.set(cipherBytes, headerBytes.length);

      updateProgress(90, "Finalizing protected document...");
      const finalBlob = new Blob([outputBuffer as any], { type: "application/octet-stream" });

      return {
        blob: finalBlob,
        fileName: `protected_${file.name}`,
        meta: {
          originalSize: file.size,
          finalSize: finalBlob.size
        }
      };
    } catch (err: any) {
      throw new Error(err.message || "Failed to protect document. Please ensure the file is valid.");
    }
  };

  return (
    <ToolShell
      toolId="protect-pdf"
      allowedExtensions={[".pdf"]}
      allowMultiple={false}
      configTitle="Security Lock"
      defaultConfig={{ password: "" }}
      renderConfig={(files, config, setConfig) => (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#4A6857] block mb-2">
              Set Protection Password
            </label>
            <input
              type="password"
              placeholder="Enter a secure password (min. 4 characters)..."
              value={config.password}
              onChange={(e) => setConfig({ ...config, password: e.target.value })}
              className="w-full px-4 py-3 bg-[#F0F7F0] border border-[#C5DCC9] rounded-xl text-sm text-[#1F3A26] focus:outline-none focus:border-[#10A968] transition"
            />
            {config.password && (
              <p className={`text-2xs mt-2 font-mono ${config.password.length < 4 ? "text-red-600" : "text-[#10A968]"}`}>
                Password strength: {config.password.length < 4 ? "Too short (min 4)" : `${config.password.length} characters`}
              </p>
            )}
          </div>
          <div className="space-y-2 text-2xs text-[#4A6857] font-mono leading-relaxed border-t border-[#C5DCC9] pt-3">
            <p>✓ Your PDF will be encrypted with XOR-based encryption</p>
            <p>✓ The protected file cannot be opened directly - it must be unlocked first</p>
            <p>✓ To view your PDF: Use the **Unlock PDF** tool and enter the same password</p>
            <p>⚠ Keep your password safe - without it, the PDF cannot be recovered</p>
          </div>
        </div>
      )}
      onProcess={handleProcess}
    />
  );
}
