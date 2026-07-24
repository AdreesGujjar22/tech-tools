import React from "react";
import { useTranslations } from "next-intl";

const LoadingSpinner: React.FC<{ content?: React.ReactNode }> = ({ content }) => {
  const t = useTranslations("Tools.Loading");

  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6 bg-card p-12 rounded-3xl shadow-xl border border-border">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-border border-t-primary" />
        {content || (
          <span className="text-base font-semibold text-[#2D4D35] font-mono">{t("pdfTools")}</span>
        )}
      </div>
    </main>
  );
};

export default function ILovePdfLoading() {
  return <LoadingSpinner />;
}
