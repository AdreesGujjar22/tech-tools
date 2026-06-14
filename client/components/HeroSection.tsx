import React from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, Sparkles } from "lucide-react";

export interface HeroSectionProps {
  badge?: string;
  title: string;
  subtitle: string;
  description?: string;
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
  image?: React.ReactNode;
  imagePosition?: "right" | "bottom";
}

export function HeroSection({
  badge = "Next-Gen Tools",
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  image,
  imagePosition = "right",
}: HeroSectionProps) {
  const ContentElement = primaryCTA?.href ? "a" : "button";
  const SecondaryElement = secondaryCTA?.href ? "a" : "button";

  return (
    <section className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-20 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {imagePosition === "right" ? (
          // Asymmetric 2/3 + 1/3 layout
          <div className="grid lg:grid-cols-3 gap-12 items-center">
            {/* Left content - 2/3 width */}
            <div className="lg:col-span-2 space-y-8 animate-slide-up">
              {/* Badge */}
              {badge && (
                <Badge className="w-fit inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/40 bg-card/40 backdrop-blur-sm">
                  <Sparkles className="w-4 h-4" />
                  {badge}
                </Badge>
              )}

              {/* Main Heading */}
              <div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                  {title.split("\n").map((line, idx) => (
                    <React.Fragment key={idx}>
                      {line}
                      {idx < title.split("\n").length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </h1>
                {subtitle && (
                  <p className="text-xl sm:text-2xl text-primary font-semibold mt-4">
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Description */}
              {description && (
                <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                  {description}
                </p>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {primaryCTA && (
                  <ContentElement
                    href={primaryCTA.href}
                    onClick={primaryCTA.onClick}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl brand-gradient text-white font-semibold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  >
                    {primaryCTA.label}
                    <ArrowRight className="w-5 h-5" />
                  </ContentElement>
                )}
                {secondaryCTA && (
                  <SecondaryElement
                    href={secondaryCTA.href}
                    onClick={secondaryCTA.onClick}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-border/40 hover:border-primary/40 text-foreground font-semibold text-lg hover:bg-card/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  >
                    {secondaryCTA.label}
                    <ArrowRight className="w-5 h-5" />
                  </SecondaryElement>
                )}
              </div>
            </div>

            {/* Right image - 1/3 width */}
            {image && (
              <div className="lg:col-span-1 relative animate-fade-in-scale">
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
                  {/* Image container */}
                  <div className="relative premium-card p-6 rounded-3xl border border-border/40 overflow-hidden">
                    {image}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Bottom image layout
          <div className="space-y-12">
            {/* Content */}
            <div className="max-w-3xl animate-slide-up">
              {badge && (
                <Badge className="w-fit inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/40 bg-card/40 backdrop-blur-sm">
                  <Sparkles className="w-4 h-4" />
                  {badge}
                </Badge>
              )}

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mt-6">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xl sm:text-2xl text-primary font-semibold mt-4">
                  {subtitle}
                </p>
              )}

              {description && (
                <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed mt-6">
                  {description}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                {primaryCTA && (
                  <ContentElement
                    href={primaryCTA.href}
                    onClick={primaryCTA.onClick}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl brand-gradient text-white font-semibold hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  >
                    {primaryCTA.label}
                    <ArrowRight className="w-5 h-5" />
                  </ContentElement>
                )}
                {secondaryCTA && (
                  <SecondaryElement
                    href={secondaryCTA.href}
                    onClick={secondaryCTA.onClick}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-border/40 hover:border-primary/40 text-foreground font-semibold hover:bg-card/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  >
                    {secondaryCTA.label}
                    <ArrowRight className="w-5 h-5" />
                  </SecondaryElement>
                )}
              </div>
            </div>

            {/* Bottom image */}
            {image && (
              <div className="relative animate-fade-in-scale mt-12">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
                  <div className="relative premium-card p-8 rounded-3xl border border-border/40 overflow-hidden w-full">
                    {image}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default HeroSection;
