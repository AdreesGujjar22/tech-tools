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
      "group premium-card p-6 sm:p-7 flex flex-col gap-4 h-full min-h-[190px]",
      "border border-[#C5DCC9]/80 rounded-2xl bg-white shadow-sm",
      "hover:shadow-xl hover:-translate-y-1 hover:border-[#10A968]/40 transition-all duration-300",
      `bg-gradient-to-br ${gradientClasses[gradient]}`
    )}>
      <div className="w-14 h-14 rounded-2xl bg-[#E8F0E8] border border-[#C5DCC9] flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:bg-[#D4E8D8] transition-all duration-300 group-hover:scale-105">
        <Icon className="w-7 h-7 text-[#10A968]" />
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-[#1F3A26] leading-tight">{title}</h3>

      <p className="text-sm sm:text-base text-[#4A6857] leading-relaxed">
        {description}
      </p>
    </div>
  );
}
