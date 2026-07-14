import React from "react";

const LoadingSpinner: React.FC<{ content?: React.ReactNode }> = ({ content }) => {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4 bg-card p-8 rounded-2xl shadow-lg border border-border">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-border border-t-primary" />
        {content || (
          <span className="text-sm font-medium text-[#2D4D35] font-mono">Loading typing test...</span>
        )}
      </div>
    </main>
  );
};

export default function TypingSpeedLoading() {
  return <LoadingSpinner />;
}
