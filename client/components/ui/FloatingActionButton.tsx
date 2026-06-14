import React from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export interface FloatingActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label?: string;
  variant?: "primary" | "secondary" | "glass";
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  animated?: boolean;
}

export const FloatingActionButton = React.forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  (
    { icon = <Sparkles size={24} />, label, variant = "primary", position = "bottom-right", animated = true, className, ...props },
    ref
  ) => {
    const positionClasses = {
      "bottom-right": "bottom-6 right-6",
      "bottom-left": "bottom-6 left-6",
      "top-right": "top-6 right-6",
      "top-left": "top-6 left-6",
    };

    const variantClasses = {
      primary:
        "brand-gradient text-white shadow-[0_12px_28px_-8px_hsla(var(--brand-to),0.75)] hover:shadow-[0_16px_36px_-12px_hsla(var(--brand-to),0.85)]",
      secondary:
        "bg-secondary text-secondary-foreground border border-border shadow-md hover:shadow-lg hover:border-primary/40",
      glass: "glass-card text-foreground border border-border/60 backdrop-blur-xl hover:border-primary/40 hover:shadow-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "fixed z-40 flex items-center justify-center gap-2 px-4 py-3 rounded-full font-semibold text-sm",
          "transition-all duration-300 ease-out",
          "hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-ring",
          "active:scale-95 cursor-pointer",
          animated && "animate-fade-in-scale",
          positionClasses[position],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        <span className="flex-shrink-0">{icon}</span>
        {label && <span className="hidden sm:inline">{label}</span>}
      </button>
    );
  }
);

FloatingActionButton.displayName = "FloatingActionButton";
export default FloatingActionButton;
