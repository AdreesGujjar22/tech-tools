import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "destructive";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-2xs sm:text-xs font-bold font-mono tracking-wider uppercase border transition-all duration-200 backdrop-blur-sm",
        "hover:shadow-sm hover:-translate-y-0.5",
        variant === "default" && "bg-primary/10 border-primary/20 text-primary hover:bg-primary/15 hover:border-primary/30",
        variant === "secondary" && "bg-secondary/60 border-border/40 text-secondary-foreground hover:bg-secondary/70 hover:border-border/50",
        variant === "outline" && "text-foreground border-border/40 bg-transparent hover:bg-accent/30 hover:border-border/60",
        variant === "success" && "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 hover:border-emerald-500/40",
        variant === "warning" && "bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25 hover:border-amber-500/40",
        variant === "destructive" && "bg-destructive/15 border-destructive/30 text-destructive dark:text-rose-400 hover:bg-destructive/25 hover:border-destructive/40",
        className
      )}
      {...props}
    />
  );
}

export default Badge;
