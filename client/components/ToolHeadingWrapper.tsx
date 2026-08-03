"use client";

import { ReactNode } from "react";
import { useTranslations } from "next-intl";

interface ToolHeadingWrapperProps {
  children: ReactNode;
  titleKey: string; // e.g., "title" from translation
  descriptionKey: string; // e.g., "description"
  namespace: string; // e.g., "Tools.QrGenerator"
  showSections?: boolean;
}

export default function ToolHeadingWrapper({
  children,
  titleKey = "title",
  descriptionKey = "description",
  namespace,
  showSections = true,
}: ToolHeadingWrapperProps) {
  const t = useTranslations(namespace);

  const h1Title = t(titleKey);
  const h1Description = t(descriptionKey);

  return (
    <>
      {/* Main tool heading with proper H1/H2 structure */}
      <section className="mx-auto max-w-5xl px-6 py-8 sm:py-12 pt-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#1F3A26] sm:text-5xl mb-4">
          {h1Title}
        </h1>
        <p className="text-lg text-[#4A6857] mb-8 max-w-3xl">
          {h1Description}
        </p>
      </section>

      {/* Tool UI content */}
      <div className="mx-auto max-w-5xl px-6 pb-12">
        {children}
      </div>

      {/* Section headings for common sections */}
      {showSections && (
        <div className="mx-auto max-w-5xl px-6 py-12 space-y-16">
          <section>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#1F3A26] mb-6">
              How to Use This Tool
            </h2>
            {/* Content would be inserted here by parent component if needed */}
          </section>

          <section>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#1F3A26] mb-6">
              Key Features
            </h2>
            {/* Content would be inserted here by parent component if needed */}
          </section>
        </div>
      )}
    </>
  );
}
