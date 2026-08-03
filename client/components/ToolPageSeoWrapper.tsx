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

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://www.ilovetechtools.com"
).replace(/\/$/, "");

export default function ToolPageSeoWrapper({
  children,
  title,
  toolDescription,
  faqItems = [],
  relatedToolsCategory,
  includeBreadcrumbs = true,
  includeFaq = true,
  includeRelatedTools = true,
  schemaProps = {},
}: ToolPageSeoWrapperProps) {
  const { toolName = title, applicationCategory = "DeveloperApplication", operatingSystem = "All" } = schemaProps;

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: toolName,
    description: toolDescription,
    url: `${BASE_URL}`,
    applicationCategory: applicationCategory,
    operatingSystem: operatingSystem,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <div>
      {/* Inject SoftwareApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
        suppressHydrationWarning
      />

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
            title="Frequently Asked Questions"
            items={faqItems}
          />
        )}
      </main>
    </div>
  );
}
