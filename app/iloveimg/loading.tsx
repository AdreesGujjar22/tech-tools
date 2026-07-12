import React from "react";

const LoadingSpinner: React.FC<{ content?: React.ReactNode }> = ({ content }) => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F0F7F0] via-white to-transparent flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4 bg-white p-8 rounded-2xl shadow-lg border border-[#C5DCC9] bg-opacity-80">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#C5DCC9] border-t-[#10A968]" />
        {content || (
          <span className="text-sm font-medium text-[#2D4D35] font-mono">Loading image tools...</span>
        )}
      </div>
    </main>
  );
};

export default function ILoveImgLoading() {
  return <LoadingSpinner />;
}
