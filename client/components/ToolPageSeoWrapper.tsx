import { ReactNode } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqSection, { type FaqItem } from "@/components/FaqSection";
import RelatedToolsGrid from "@/components/RelatedToolsGrid";

interface ToolPageSeoWrapperProps {
  children: ReactNode;
  title: string;
  toolDescription: string;
  faqItems?: FaqItem[];
  relatedToolsCategory?: string;
  includeBreadcrumbs?: boolean;
  includeFaq?: boolean;
  includeRelatedTools?: boolean;
  schemaProps?: {
    toolName?: string;
    applicationCategory?: string;
    operatingSystem?: string;
  };
}

export default function ToolPageSeoWrapper({
  children,
  title,
  toolDescription,
  faqItems = [],
  relatedToolsCategory,
  includeBreadcrumbs = true,
  includeFaq = true,
  includeRelatedTools = true,
  schemaProps: _schemaProps = {},
}: ToolPageSeoWrapperProps) {
  return (
    <div>
      {/* Breadcrumbs with Schema */}
      {includeBreadcrumbs && <Breadcrumbs />}

      {/* Main Tool Content with Semantic H1 */}
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-6 py-8 sm:py-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#1F3A26] sm:text-5xl mb-4">
            {title}
          </h1>
          <p className="text-lg text-[#4A6857] mb-8 max-w-3xl">
            {toolDescription}
          </p>
        </div>

        {/* Tool Interface */}
        <div className="mx-auto max-w-5xl px-6 pb-12">
          {children}
        </div>

        {/* Related Tools Grid */}
        {includeRelatedTools && relatedToolsCategory && (
          <RelatedToolsGrid category={relatedToolsCategory} />
        )}

        {/* FAQ Section with H2 heading */}
        {includeFaq && faqItems && faqItems.length > 0 && (
          <FaqSection
            items={faqItems}
          />
        )}
      </main>
    </div>
  );
}
