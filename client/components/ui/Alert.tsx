import React from "react";
import { cn } from "@/lib/utils";

export const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "destructive" | "success" | "warning" }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(
      "relative w-full rounded-xl border p-4 flex gap-3 text-left [&>svg]:text-current",
      variant === "default" && "bg-secondary text-foreground border-border",
      variant === "destructive" && "border-destructive/30 bg-destructive/5 text-destructive dark:text-rose-405",
      variant === "success" && "border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-430",
      variant === "warning" && "border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-440",
      className
    )}
    {...props}
  />
));
Alert.displayName = "Alert";

export const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-xs sm:text-sm font-medium opacity-90 leading-relaxed [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";
