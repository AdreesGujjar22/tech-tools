import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  animated?: boolean;
  closeOnEscape?: boolean;
  closeOnBackdropClick?: boolean;
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      onOpenChange,
      title,
      children,
      footer,
      className,
      contentClassName,
      animated = true,
      closeOnEscape = true,
      closeOnBackdropClick = true,
    },
    ref
  ) => {
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (closeOnEscape && e.key === "Escape") {
          onOpenChange(false);
        }
      };

      if (open) {
        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";
      }

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "";
      };
    }, [open, closeOnEscape, onOpenChange]);

    if (!open) return null;

    return (
      <>
        {/* Backdrop */}
        <div
          className={cn(
            "fixed inset-0 z-40 bg-background/60 backdrop-blur-sm transition-opacity duration-300",
            animated ? "animate-fade-in" : ""
          )}
          onClick={() => closeOnBackdropClick && onOpenChange(false)}
        />

        {/* Modal */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            ref={ref}
            className={cn(
              "premium-card w-full max-w-lg p-6 relative",
              "border border-border/40 rounded-3xl shadow-2xl",
              animated ? "animate-fade-in-scale" : "",
              className
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-accent/50 transition-colors duration-200 text-muted-foreground hover:text-foreground"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Header */}
            {title && (
              <div className="mb-6 pr-8">
                <h2 className="text-2xl font-bold text-foreground">{title}</h2>
              </div>
            )}

            {/* Content */}
            <div className={cn("text-foreground", contentClassName)}>{children}</div>

            {/* Footer */}
            {footer && (
              <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-end gap-3">
                {footer}
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
);

Modal.displayName = "Modal";
export default Modal;
