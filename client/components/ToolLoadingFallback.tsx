import React from "react";

export default function ToolLoadingFallback() {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center p-8">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        <span className="text-xs font-medium text-slate-500">Loading tool...</span>
      </div>
    </div>
  );
}
