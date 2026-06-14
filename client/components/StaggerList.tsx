import React from "react";
import { cn } from "@/lib/utils";

export interface StaggerListProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  className?: string;
  itemClassName?: string;
}

export const StaggerList = React.forwardRef<HTMLDivElement, StaggerListProps>(
  ({ children, staggerDelay = 0.1, className, itemClassName }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-4", className)}>
        {React.Children.map(children, (child, index) => (
          <div
            key={index}
            style={{
              animation: `fade-in-up 0.5s ease-out ${index * staggerDelay}s both`,
            }}
            className={itemClassName}
          >
            {child}
          </div>
        ))}
      </div>
    );
  }
);

StaggerList.displayName = "StaggerList";
export default StaggerList;
