"use client";

import { Link } from "@/lib/router-compat";
import { useLocale } from "@/lib/locale";
import { allDashboardTools, DASHBOARD_CATEGORIES } from "@/lib/dashboards-config";
import { ArrowRight } from "lucide-react";

interface RelatedToolsGridProps {
  category: string;
  limit?: number;
}

export default function RelatedToolsGrid({ category, limit = 4 }: RelatedToolsGridProps) {
  const { locale } = useLocale();

  // Find tools in the specified category
  const toolsInCategory = allDashboardTools.filter(
    (tool) => tool.dashboard === category
  );

  // If no tools or only one, don't render
  if (toolsInCategory.length <= 1) {
    return null;
  }

  // Get 3-4 sibling tools (excluding self if applicable)
  const relatedTools = toolsInCategory.slice(0, limit);

  // Find the category dashboard info for the section heading
  const categoryInfo = DASHBOARD_CATEGORIES.find((cat) => cat.slug === category);
  const categoryName = categoryInfo?.title || category;
  const categoryRoute = categoryInfo?.route || `/${category}`;

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-[#1F3A26] sm:text-4xl mb-2">
          Related Tools
        </h2>
        <p className="text-[#4A6857]">
          Explore more tools in{" "}
          <Link
            to={categoryRoute}
            className="text-[#10A968] font-semibold hover:underline"
          >
            {categoryName}
          </Link>
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {relatedTools.map((tool) => (
          <Link
            key={tool.route}
            to={tool.route}
            className="group relative rounded-2xl border border-[#C5DCC9] bg-white p-6 transition-all hover:border-[#10A968] hover:shadow-lg"
          >
            <div className="flex h-full flex-col">
              <h3 className="text-lg font-semibold text-[#1F3A26] group-hover:text-[#10A968] transition-colors mb-2">
                {tool.title}
              </h3>
              <p className="text-sm text-[#4A6857] flex-grow mb-4">
                {tool.description || "Quick access to this tool"}
              </p>
              <div className="flex items-center text-[#10A968] font-medium text-sm">
                <span>Visit Tool</span>
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
