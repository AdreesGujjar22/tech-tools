import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
  category?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  gradient?: "indigo" | "emerald" | "blue" | "purple" | "orange";
  onClick?: () => void;
}

const gradientClasses = {
  indigo: "from-indigo-500/15 to-blue-500/5",
  emerald: "from-emerald-500/15 to-green-500/5",
  blue: "from-blue-500/15 to-cyan-500/5",
  purple: "from-purple-500/15 to-pink-500/5",
  orange: "from-orange-500/15 to-red-500/5",
};

export function ToolCard({
  title,
  description,
  icon,
  href,
  category,
  isNew = false,
  isFeatured = false,
  gradient = "indigo",
  onClick,
}: ToolCardProps) {
  const cardClassName = cn(
    "premium-card p-6 relative overflow-hidden group cursor-pointer",
    "border border-border/40 rounded-2xl",
    "hover:shadow-lg hover:-translate-y-2 transition-all duration-300",
    `bg-gradient-to-br ${gradientClasses[gradient]}`,
    isFeatured && "lg:col-span-2 lg:row-span-2"
  );

  const cardContent = (
    <>
      {/* Background accent */}
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-20 bg-primary blur-3xl transition-opacity duration-500" />

      {/* Badges */}
      <div className="flex gap-2 mb-4 relative z-10">
        {isNew && <Badge variant="success">New</Badge>}
        {isFeatured && <Badge variant="default">Featured</Badge>}
        {category && (
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
        )}
      </div>

      {/* Icon */}
      <div className="mb-4 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
          <div className="text-primary text-lg">{icon}</div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 mb-4">
        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      {/* Footer with link */}
      <div className="relative z-10 flex items-center justify-between pt-4 border-t border-border/30 group-hover:border-border/60 transition-colors">
        <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          {isFeatured ? "Explore" : "Try Now"}
        </span>
        <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
      </div>

      {/* Animated border glow on hover */}
      <div className="absolute inset-0 rounded-2xl border border-primary/0 group-hover:border-primary/30 transition-colors duration-300 pointer-events-none" />
    </>
  );

  return href ? (
    <a href={href} onClick={onClick} className={cardClassName}>
      <Card className="bg-transparent border-0">
        {cardContent}
      </Card>
    </a>
  ) : (
    <div onClick={onClick} className={cardClassName}>
      <Card className="bg-transparent border-0">
        {cardContent}
      </Card>
    </div>
  );
}

export default ToolCard;
