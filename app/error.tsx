"use client";

import { useEffect } from "react";
import { Home, RefreshCw } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Application route error", error);
  }, [error]);

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-b from-[#F0F7F0] via-white to-transparent px-6 py-20">
      <div className="w-full max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#E8F0E8] text-4xl font-extrabold text-[#10A968]">!</div>
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#10A968]">Something went wrong</p>
        <h1 className="text-4xl font-extrabold text-[#1F3A26] sm:text-5xl">We couldn’t load this page</h1>
        <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-[#4A6857]">The tool ran into an unexpected problem. Try again, or return to the home page and choose another tool.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={() => reset()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#10A968] px-6 py-3 font-semibold text-white shadow-lg shadow-[#10A968]/20 transition hover:bg-[#0d8f56]"><RefreshCw size={17} />Try again</button>
          <a href="/" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#C5DCC9] bg-[#E8F0E8] px-6 py-3 font-semibold text-[#2D4D35] transition hover:bg-[#D4E8D8]"><Home size={17} />Go home</a>
        </div>
      </div>
    </main>
  );
}
