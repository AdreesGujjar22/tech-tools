import React from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, Sparkles } from "lucide-react";

export interface CTASectionProps {
  title: string;
  description?: string;
  badge?: string;
  primaryCTA?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  secondaryCTA?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  variant?: "default" | "gradient" | "outlined";
}

const variantClasses = {
  default: "bg-card/50 border border-border/40",
  gradient: "bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20",
  outlined: "bg-transparent border border-border/40 hover:border-border/60",
};

export function CTASection({
  title,
  description,
  badge,
  primaryCTA,
  secondaryCTA,
  variant = "gradient",
}: CTASectionProps) {
  const PrimaryElement = primaryCTA?.href ? "a" : "button";
  const SecondaryElement = secondaryCTA?.href ? "a" : "button";

  return (
    <section className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 -left-20 w-72 h-72 bg-primary/15 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className={`rounded-3xl p-12 md:p-16 lg:p-20 ${variantClasses[variant]} backdrop-blur-sm transition-all duration-300 hover:shadow-lg`}>
          {/* Badge */}
          {badge && (
            <div className="flex justify-center mb-6">
              <Badge className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/40 bg-card/40">
                <Sparkles className="w-4 h-4" />
                {badge}
              </Badge>
            </div>
          )}

          {/* Title */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-center mb-6">
            {title}
          </h2>

          {/* Description */}
          {description && (
            <p className="text-lg sm:text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-8">
              {description}
            </p>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {primaryCTA && (
              <PrimaryElement
                href={primaryCTA.href}
                onClick={primaryCTA.onClick}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl brand-gradient text-white font-semibold hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                {primaryCTA.label}
                <ArrowRight className="w-5 h-5" />
              </PrimaryElement>
            )}
            {secondaryCTA && (
              <SecondaryElement
                href={secondaryCTA.href}
                onClick={secondaryCTA.onClick}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-border/40 hover:border-primary/40 text-foreground font-semibold hover:bg-card/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                {secondaryCTA.label}
                <ArrowRight className="w-5 h-5" />
              </SecondaryElement>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
