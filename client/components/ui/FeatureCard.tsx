import React from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
}: FeatureCardProps) {
  return (
    <div className="glass-card p-8 flex flex-col gap-4 h-full">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary" />
      </div>

      <h3 className="text-xl font-semibold">{title}</h3>

      <p className="text-base text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}