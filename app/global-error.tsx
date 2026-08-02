"use client";

import { useEffect } from "react";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    console.error("Application root error", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-[#F0F7F0] text-[#1F3A26]">
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem", textAlign: "center" }}>
          <div style={{ maxWidth: "34rem" }}>
            <div style={{ color: "#10A968", fontSize: "4rem", fontWeight: 800 }}>!</div>
            <h1 style={{ fontSize: "2.25rem", fontWeight: 800, margin: "0.5rem 0" }}>We couldn’t load Tech Tools</h1>
            <p style={{ color: "#4A6857", lineHeight: 1.7 }}>An unexpected error occurred. Please try again or return to the home page.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center", marginTop: "2rem" }}>
              <button onClick={() => window.location.reload()} style={{ border: 0, borderRadius: "0.75rem", padding: "0.75rem 1.5rem", background: "#10A968", color: "white", fontWeight: 700, cursor: "pointer" }}>Try again</button>
              <a href="/" style={{ borderRadius: "0.75rem", padding: "0.75rem 1.5rem", background: "#E8F0E8", color: "#2D4D35", fontWeight: 700, textDecoration: "none" }}>Go home</a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
