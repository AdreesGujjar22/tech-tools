import React from "react";

const LoadingSpinner: React.FC<{ content?: React.ReactNode }> = ({ content }) => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F0F7F0] via-white to-transparent flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6 bg-white p-12 rounded-3xl shadow-xl border border-[#C5DCC9] bg-opacity-95">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#C5DCC9] border-t-[#10A968]" />
        {content || (
          <span className="text-base font-semibold text-[#2D4D35] font-mono">Loading PDF tools...</span>
        )}
      </div>
    </main>
  );
};

export default function ILovePdfLoading() {
  return <LoadingSpinner />;
}
