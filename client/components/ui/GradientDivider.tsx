import React from "react";
import { cn } from "@/lib/utils";

export interface GradientDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "horizontal" | "vertical";
  gradient?: "indigo-cyan" | "emerald-cyan" | "blue-purple" | "soft";
  animated?: boolean;
}

export const GradientDivider = React.forwardRef<HTMLDivElement, GradientDividerProps>(
  ({ variant = "horizontal", gradient = "indigo-cyan", animated = false, className, ...props }, ref) => {
    const gradientClasses = {
      "indigo-cyan": "from-indigo-500/0 via-indigo-500/60 to-cyan-500/0",
      "emerald-cyan": "from-emerald-500/0 via-emerald-500/60 to-cyan-500/0",
      "blue-purple": "from-blue-500/0 via-blue-500/60 to-purple-500/0",
      soft: "from-slate-400/0 via-slate-400/30 to-slate-400/0",
    };

    return (
      <div
        ref={ref}
        className={cn(
          variant === "horizontal"
            ? "h-px w-full bg-gradient-to-r"
            : "w-px h-full bg-gradient-to-b",
          gradientClasses[gradient],
          animated && "animate-shimmer",
          className
        )}
        {...props}
      />
    );
  }
);

GradientDivider.displayName = "GradientDivider";
export default GradientDivider;
