import React from "react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  gradient?: "indigo" | "emerald" | "blue" | "purple";
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  gradient = "indigo",
}: FeatureCardProps) {
  const gradientClasses = {
    indigo: "from-indigo-500/20 to-blue-500/5",
    emerald: "from-emerald-500/20 to-green-500/5",
    blue: "from-blue-500/20 to-cyan-500/5",
    purple: "from-purple-500/20 to-pink-500/5",
  };

  return (
    <div className={cn(
      "premium-card p-8 flex flex-col gap-4 h-full",
      "border border-border/40 rounded-2xl",
      "hover:shadow-lg hover:-translate-y-1 transition-all duration-300",
      `bg-gradient-to-br ${gradientClasses[gradient]}`
    )}>
      <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-110">
        <Icon className="w-7 h-7 text-primary" />
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-foreground leading-tight">{title}</h3>

      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
