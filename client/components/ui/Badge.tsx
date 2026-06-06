import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "destructive";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-xl px-2.5 py-0.5 text-2xs sm:text-xs font-bold font-mono tracking-wider uppercase border transition-colors",
        variant === "default" && "bg-primary/10 border-primary/20 text-primary",
        variant === "secondary" && "bg-secondary border-border text-secondary-foreground",
        variant === "outline" && "text-foreground border-border bg-transparent",
        variant === "success" && "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 dark:text-emerald-400",
        variant === "warning" && "bg-amber-500/10 border-amber-500/20 text-amber-500 dark:text-amber-400",
        variant === "destructive" && "bg-destructive/10 border-destructive/20 text-destructive dark:text-rose-400",
        className
      )}
      {...props}
    />
  );
}

export default Badge;
