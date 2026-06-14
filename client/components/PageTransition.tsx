import React from "react";
import { cn } from "@/lib/utils";

export interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-in" | "fade-in-scale" | "slide-up" | "slide-down";
  duration?: "fast" | "normal" | "slow";
}

export const PageTransition = React.forwardRef<HTMLDivElement, PageTransitionProps>(
  ({ children, className, animation = "fade-in-scale", duration = "normal" }, ref) => {
    const durationClasses = {
      fast: "duration-300",
      normal: "duration-500",
      slow: "duration-700",
    };

    return (
      <div
        ref={ref}
        className={cn(
          `animate-${animation} ${durationClasses[duration]}`,
          className
        )}
      >
        {children}
      </div>
    );
  }
);

PageTransition.displayName = "PageTransition";
export default PageTransition;
