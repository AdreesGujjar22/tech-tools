import React from "react";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesGrid } from "@/components/FeaturesGrid";
import { CTASection } from "@/components/CTASection";
import { ToolCard } from "@/components/ToolCard";
import { StaggerList } from "@/components/StaggerList";
import {
  Zap,
  Shield,
  Smartphone,
  Cloud,
  Sparkles,
  Workflow,
  BarChart3,
  Lock,
} from "lucide-react";

// Example: Modern homepage structure using all new components
export default function ModernHomepage() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get results instantly without lag or slowdowns. Optimized performance.",
      gradient: "indigo" as const,
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data stays private. All processing happens directly in your browser.",
      gradient: "emerald" as const,
    },
    {
      icon: Smartphone,
      title: "Fully Responsive",
      description: "Works seamlessly on desktop, tablet, and mobile devices everywhere.",
      gradient: "blue" as const,
    },
    {
      icon: Cloud,
      title: "Cloud Enabled",
      description: "Access your work from anywhere. Sync across all your devices.",
      gradient: "purple" as const,
    },
    {
      icon: Sparkles,
      title: "AI Powered",
      description: "Intelligent features that adapt to your workflow and improve over time.",
      gradient: "indigo" as const,
    },
    {
      icon: Lock,
      title: "Open Source",
      description: "Transparent and community-driven. Check the code on GitHub anytime.",
      gradient: "emerald" as const,
    },
  ];

  const tools = [
    {
      title: "PDF Tools",
      description: "Merge, split, compress, convert, edit, and optimize PDF files instantly.",
      icon: "📄",
      category: "Documents",
      isNew: false,
      isFeatured: true,
      gradient: "indigo" as const,
    },
    {
      title: "Image Tools",
      description: "Resize, crop, compress, convert formats, remove backgrounds, and more.",
      icon: "🖼️",
      category: "Media",
      isNew: true,
      isFeatured: false,
      gradient: "emerald" as const,
    },
    {
      title: "Color Picker",
      description: "Extract colors from images, convert color formats, create palettes.",
      icon: "🎨",
      category: "Design",
      isNew: false,
      isFeatured: false,
      gradient: "blue" as const,
    },
    {
      title: "QR Generator",
      description: "Create custom QR codes with colors, logos, and real-time previews.",
      icon: "📱",
      category: "Utilities",
      isNew: false,
      isFeatured: false,
      gradient: "purple" as const,
    },
    {
      title: "Speed Test",
      description: "Test your internet speed with detailed analytics and history.",
      icon: "⚡",
      category: "Network",
      isNew: false,
      isFeatured: false,
      gradient: "orange" as const,
    },
    {
      title: "Typing Speed",
      description: "Improve your typing speed with engaging practice sessions.",
      icon: "⌨️",
      category: "Practice",
      isNew: true,
      isFeatured: false,
      gradient: "indigo" as const,
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <HeroSection
        badge="Modern Tool Suite"
        title="Powerful Online Tools"
        subtitle="Everything you need, nothing you don't"
        description="Free, fast, and secure online utilities for productivity. Process files, extract data, and build with confidence."
        primaryCTA={{
          label: "Explore Tools",
          onClick: () => {},
        }}
        secondaryCTA={{
          label: "Learn More",
          href: "#features",
        }}
        imagePosition="right"
      />

      {/* Features Section */}
      <FeaturesGrid
        title="Why Choose Us?"
        subtitle="Built with modern web standards and best practices for reliability and performance."
        features={features}
        columns="3"
        animate={true}
      />

      {/* Tools Grid */}
      <section className="py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-card/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Popular Tools
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Choose from our collection of carefully crafted online utilities.
            </p>
          </div>

          {/* Tools Grid with Stagger */}
          <StaggerList
            staggerDelay={0.1}
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}
          >
            {tools.map((tool, idx) => (
              <ToolCard
                key={idx}
                title={tool.title}
                description={tool.description}
                icon={tool.icon}
                category={tool.category}
                isNew={tool.isNew}
                isFeatured={tool.isFeatured}
                gradient={tool.gradient}
                onClick={() => {}}
              />
            ))}
          </StaggerList>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        badge="Get Started Today"
        title="Ready to boost your productivity?"
        description="Join thousands of users who trust our tools for their daily work. No signup required to start."
        variant="gradient"
        primaryCTA={{
          label: "Start Now",
          onClick: () => {},
        }}
        secondaryCTA={{
          label: "View Pricing",
          href: "/pricing",
        }}
      />
    </div>
  );
}
