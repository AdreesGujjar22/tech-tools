import React from "react";
import { cn } from "@/lib/utils";

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  gradient?: "indigo" | "emerald" | "blue" | "purple";
}

export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ label, value, icon, change, gradient = "indigo", className, ...props }, ref) => {
    const gradientClasses = {
      indigo: "bg-gradient-indigo-soft",
      emerald: "bg-gradient-emerald-soft",
      blue: "from-blue-500/10 to-cyan-500/10",
      purple: "from-purple-500/10 to-pink-500/10",
    };

    const changeColor = change?.type === "increase" ? "text-emerald-600" : "text-red-600";

    return (
      <div
        ref={ref}
        className={cn(
          "premium-card p-6 relative group",
          "border border-border/40 rounded-2xl",
          "transition-all duration-300 hover:-translate-y-1",
          className
        )}
        {...props}
      >
        {/* Background gradient accent */}
        <div className={cn("absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300", gradientClasses[gradient])} />

        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">{value}</span>
                {change && (
                  <span className={cn("text-sm font-semibold", changeColor)}>
                    {change.type === "increase" ? "↑" : "↓"} {Math.abs(change.value)}%
                  </span>
                )}
              </div>
            </div>
            {icon && (
              <div className="p-3 rounded-lg bg-accent/40 text-primary group-hover:bg-accent/60 group-hover:scale-110 transition-all duration-300">
                {icon}
              </div>
            )}
          </div>
        </div>

        {/* Animated border on hover */}
        <div className="absolute inset-0 rounded-2xl border border-primary/0 group-hover:border-primary/30 transition-colors duration-300 pointer-events-none" />
      </div>
    );
  }
);

StatCard.displayName = "StatCard";
export default StatCard;
