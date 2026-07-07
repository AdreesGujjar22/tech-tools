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
    updateProgress(20, "Loading document binary stream...");
    const file = files[0];
    const password = config.password || "";

    if (!password) {
      throw new Error("Password must not be empty.");
    }

    const fileBytes = new Uint8Array(await file.arrayBuffer());

    updateProgress(60, "Running high-velocity browser XOR ciphers...");
    const cipherBytes = xorCipher(fileBytes, password);

    // Assemble header with payload
    const enc = new TextEncoder();
    const headerBytes = enc.encode(HEADER);
    const outputBuffer = new Uint8Array(headerBytes.length + cipherBytes.length);
    outputBuffer.set(headerBytes, 0);
    outputBuffer.set(cipherBytes, headerBytes.length);

    updateProgress(90, "Sealing secure payload...");
    const finalBlob = new Blob([outputBuffer], { type: "application/pdf" });

    return {
      blob: finalBlob,
      fileName: `protected_${file.name}`
    };
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
            <label className="text-xs font-semibold text-neutral-400 block mb-1">
              Configure Protected Password
            </label>
            <input
              type="password"
              placeholder="Enter secure password..."
              value={config.password}
              onChange={(e) => setConfig({ ...config, password: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-red-600 transition"
            />
          </div>
          <p className="text-2xs text-neutral-500 font-mono leading-relaxed mt-1">
            Encryption locks this document. To unlock, upload this document to the **Unlock PDF** tool and enter the same password.
          </p>
        </div>
      )}
      onProcess={handleProcess}
    />
  );
}
