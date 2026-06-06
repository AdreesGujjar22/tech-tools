import React from "react";

const LoadingSpinner: React.FC<{ content?: React.ReactNode }> = ({ content }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="flex flex-col items-center space-y-4 bg-white dark:bg-slate-900 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 dark:border-slate-700 border-t-indigo-600 dark:border-t-indigo-500" />
        {content || (
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Loading color picker...</span>
        )}
      </div>
    </div>
  );
};

export default function ColorPickerLoading() {
  return <LoadingSpinner />;
}
