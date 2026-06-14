import React from "react";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { StaggerList } from "@/components/StaggerList";

export interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient?: "indigo" | "emerald" | "blue" | "purple";
}

export interface FeaturesGridProps {
  title?: string;
  subtitle?: string;
  features: Feature[];
  columns?: "2" | "3" | "4";
  animate?: boolean;
}

export function FeaturesGrid({
  title,
  subtitle,
  features,
  columns = "3",
  animate = true,
}: FeaturesGridProps) {
  const gridClasses = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  };

  const featureElements = features.map((feature, idx) => (
    <FeatureCard
      key={idx}
      icon={feature.icon}
      title={feature.title}
      description={feature.description}
      gradient={feature.gradient || (["indigo", "emerald", "blue", "purple"][idx % 4] as any)}
    />
  ));

  return (
    <section className="py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-12 md:mb-16 animate-fade-in">
            {title && (
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Features Grid */}
        {animate ? (
          <StaggerList staggerDelay={0.1} className={`grid grid-cols-1 ${gridClasses[columns]} gap-6`}>
            {featureElements}
          </StaggerList>
        ) : (
          <div className={`grid grid-cols-1 ${gridClasses[columns]} gap-6`}>
            {featureElements}
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturesGrid;
