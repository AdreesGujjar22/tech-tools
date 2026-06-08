import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link" | "destructive" | "glass";
  size?: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, disabled, isLoading, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer",
          // Variants
          variant === "primary" &&
            "brand-gradient text-white shadow-[0_10px_24px_-10px_hsla(var(--brand-to),0.7)] hover:shadow-[0_14px_30px_-10px_hsla(var(--brand-to),0.8)] hover:brightness-110",
          variant === "secondary" &&
            "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border",
          variant === "outline" &&
            "bg-transparent border border-border text-foreground hover:bg-accent hover:text-accent-foreground hover:border-primary/40",
          variant === "ghost" && "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
          variant === "link" &&
            "bg-transparent text-primary hover:underline underline-offset-4 !p-0 !h-auto active:scale-100",
          variant === "destructive" &&
            "bg-destructive text-destructive-foreground hover:brightness-110 shadow-md",
          variant === "glass" &&
            "glass-card text-foreground hover:text-foreground border border-border/60 hover:border-primary/40 !shadow-none backdrop-blur-md",
          // Sizes
          size === "xs" && "h-8 px-3 text-xs rounded-lg",
          size === "sm" && "h-9 px-4 text-xs sm:text-sm rounded-lg",
          size === "md" && "h-11 px-6 text-sm sm:text-base",
          size === "lg" && "h-13 px-8 text-base sm:text-lg rounded-2xl",
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
