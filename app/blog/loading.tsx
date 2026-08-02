"use client";

import React from "react";
import { useTranslations } from "next-intl";

const LoadingSpinner: React.FC<{ content: React.ReactNode }> = ({ content }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center space-y-4 bg-card p-8 rounded-2xl shadow-lg border border-border">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-border border-t-primary" />
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{content}</span>
      </div>
    </div>
  );
};

export default function BlogLoading() {
  const t = useTranslations("Common");
  return <LoadingSpinner content={t("actions.loading")} />;
}
