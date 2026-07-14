import React from "react";

const LoadingSpinner: React.FC<{ content?: React.ReactNode }> = ({ content }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center space-y-4 bg-card p-8 rounded-2xl shadow-lg border border-border">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-border border-t-primary" />
        {content || (
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Loading tools...</span>
        )}
      </div>
    </div>
  );
};

export default function ToolsLoading() {
  return <LoadingSpinner />;
}
