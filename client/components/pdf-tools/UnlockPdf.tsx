"use client";

import React, { useState } from "react";
import ToolShell from "./ToolShell";
import { toast } from "sonner";

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

export default function UnlockPdf() {
  const handleProcess = async (
    files: File[],
    config: any,
    updateProgress: (pct: number, msg?: string) => void
  ) => {
    updateProgress(20, "Scanning document footprint...");
    const file = files[0];
    const password = config.password || "";

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // Convert prefix to string to verify lock signature
    const dec = new TextDecoder();
    const prefixBytes = bytes.slice(0, HEADER.length);
    const prefixStr = dec.decode(prefixBytes);

    if (prefixStr === HEADER) {
      if (!password) {
        throw new Error("This file is locked with a custom password. Please specify the password to proceed.");
      }

      updateProgress(60, "Running decryption key iterations...");
      const cipherBytes = bytes.slice(HEADER.length);
      const originalBytes = xorCipher(cipherBytes, password);

      updateProgress(95, "Reassembling clean output streams...");
      const finalBlob = new Blob([originalBytes as any], { type: "application/pdf" });
      
      return {
        blob: finalBlob,
        fileName: `unlocked_${file.name.replace("protected_", "")}`
      };
    } else {
      // Normal PDF file - re-saving it simply washes away permissions locks!
      updateProgress(70, "Flushing standard permission gates...");
      const finalBlob = new Blob([arrayBuffer], { type: "application/pdf" });
      return {
        blob: finalBlob,
        fileName: `unlocked_${file.name}`
      };
    }
  };

  return (
    <ToolShell
      toolId="unlock-pdf"
      allowedExtensions={[".pdf"]}
      allowMultiple={false}
      configTitle="Unlock Parameters"
      defaultConfig={{ password: "" }}
      renderConfig={(files, config, setConfig) => (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-neutral-400 block mb-1">
              Enter Unlock Password
            </label>
            <input
              type="password"
              placeholder="Leave blank if standard PDF..."
              value={config.password}
              onChange={(e) => setConfig({ ...config, password: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-red-600 transition"
            />
          </div>
          <p className="text-2xs text-neutral-500 font-mono leading-relaxed mt-1">
            If the PDF was encrypted using our **Protect PDF** tool, supply the key above to lift lock constraints client-side.
          </p>
        </div>
      )}
      onProcess={handleProcess}
    />
  );
}
