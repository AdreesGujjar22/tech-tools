import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, type = "text", id, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={id} className="text-xs sm:text-sm font-semibold text-foreground opacity-85">
            {label}
          </label>
        )}
        <input
          id={id}
          type={type}
          ref={ref}
          className={cn(
            "flex w-full truncate h-10 sm:h-11 px-3 sm:px-4 py-2.5 bg-white/5 dark:bg-white/[0.03] text-foreground border border-white/10 rounded-lg sm:rounded-xl text-xs sm:text-sm placeholder-muted-foreground outline-none",
            "focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 focus:bg-white/10 dark:focus:bg-white/[0.08]",
            "hover:bg-white/10 dark:hover:bg-white/[0.06] hover:border-white/20",
            "disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200",
            "backdrop-blur-sm",
            error && "border-red-500/50 focus:ring-red-500/30 focus:bg-red-500/5",
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-xs font-semibold text-rose-500 font-mono">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
