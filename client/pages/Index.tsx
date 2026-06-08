import { Link } from "@/lib/router-compat";
import SEO from "@/components/SEO";
import {
  Zap,
  ShieldCheck,
  Target,
  Smartphone,
  Wrench,
  Moon,
  Wifi,
  Contact,
  FileLock2,
  Wallet,
  Sparkles,
  ShieldCheck as ShieldIcon,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Fast & Lightweight",
    desc: "Use tools instantly without heavy downloads or complicated setup.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Private",
    desc: "Your data stays safe. Most processing happens directly in your browser.",
  },
  {
    icon: Target,
    title: "Easy to Use",
    desc: "Clean and beginner-friendly interface built for everyone.",
  },
  {
    icon: Smartphone,
    title: "Fully Responsive",
    desc: "Works smoothly on desktop, tablet, and mobile devices.",
  },
  {
    icon: Wrench,
    title: "Multiple Utilities",
    desc: "Access dozens of useful tools in one centralized platform.",
  },
  {
    icon: Moon,
    title: "Modern Experience",
    desc: "Beautiful dark/light mode with a sleek modern UI.",
  },
];

const integrations = [
  { label: "WiFi Hotspots", icon: Wifi },
  { label: "Digital VCards", icon: Contact },
  { label: "Encrypted Files", icon: FileLock2 },
  { label: "Crypto Wallets", icon: Wallet },
];

const steps = [
  {
    num: "1",
    title: "Inject Data",
    desc: "Paste your URL, upload files, or link your social profiles into our obsidian console.",
  },
  {
    num: "2",
    title: "Stylize Frame",
    desc: "Choose from our library of premium glass templates and adjust colors to match your brand.",
  },
  {
    num: "3",
    title: "Deploy Anywhere",
    desc: "Download in vector (SVG/PDF) or raster formats ready for print and high-res digital display.",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <SEO
        title="Modern Online Productivity Utilities"
        description="Fast, secure, and modern online tools for developers, creators, and daily digital workloads. Includes QR generation, typing speed test, internet speed test, color selector and more."
        keywords="developer utilities, scan qr code, typing tutor, internet speed test, code snippet tools, secure online converter"
      />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 w-full h-[28rem] bg-hero-radial pointer-events-none" style={{ top: 0 }} />

        <div className="max-w-[1280px] mx-auto relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-8 animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 w-fit px-4 py-2 rounded-full border border-border bg-secondary/50 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-primary text-xs font-semibold tracking-[1.2px] uppercase">Next-Gen Encoding</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-5">
              <h1 className="text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-balance">
                All Your Essential <span className="gradient-text">Tech Tools</span> in One Place
              </h1>
              <p className="text-lg text-muted-foreground max-w-[576px] leading-relaxed text-pretty">
                Fast, free, and modern online tools for developers, students, creators, and everyday users. Boost productivity with smart utilities designed to simplify your digital life.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/tools"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl brand-gradient text-white font-semibold hover:brightness-110 transition-all shadow-[0_20px_40px_-16px_hsla(var(--brand-to),0.8)]"
              >
                Start Using Tools
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about-us"
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl border border-border bg-card/50 backdrop-blur-md text-foreground font-semibold hover:bg-accent/50 hover:border-primary/30 transition-all"
              >
                Learn More
              </Link>
            </div>

            {/* Short Intro Paragraph */}
            <p className="text-base text-muted-foreground max-w-[576px] leading-relaxed">
              Welcome to TechTools, your all-in-one platform for powerful online utilities. From QR generators and internet speed tests to image converters, typing tests, color pickers, and developer tools — everything is designed for speed, simplicity, and accuracy.
            </p>
          </div>

          {/* Right Preview */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Glow */}
              <div className="absolute -inset-6 bg-[hsla(var(--brand-to),0.18)] blur-3xl rounded-full pointer-events-none" />
              <div className="relative rounded-[40px] glass-card p-10 shadow-[0_40px_80px_-24px_rgba(8,12,30,0.55)]">
                <div className="aspect-square rounded-2xl bg-white p-6 flex items-center justify-center">
                  <img
                    src="/images/hero-section.png"
                    alt="QR Code preview generated with TechTools"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Badge */}
                <div className="absolute bottom-6 left-6 p-3 rounded-2xl brand-gradient shadow-lg">
                  <ShieldIcon className="w-5 h-5 text-white" />
                </div>

                {/* Info Badge */}
                <div className="absolute top-6 right-6 px-4 py-2 rounded-2xl border border-border bg-card/70 backdrop-blur-md flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span className="text-foreground text-sm font-medium">AES-256 Encoded</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">Why Choose TechTools?</h2>
            <p className="text-base text-muted-foreground max-w-[672px] mx-auto text-pretty">
              Discover why thousands of users trust TechTools for their daily productivity needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="glass-card p-8 flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="section-bg-alt py-20 px-6">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 mb-12">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tight">Limitless Integration</h2>
              <p className="text-base text-muted-foreground max-w-[576px] text-pretty">
                Whatever your data source, Obsidian handles the translation into secure visual data packets.
              </p>
            </div>
            <Link
              to="/generator"
              className="inline-flex items-center gap-1 text-primary font-medium text-sm border-b border-primary/30 pb-1 hover:border-primary transition-colors"
            >
              View All 40+ Types
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {integrations.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="glass-card p-6 flex flex-col items-center gap-4 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm font-semibold">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="text-4xl font-bold tracking-tight text-center mb-16">Seamless Workflow</h2>

          <div className="grid md:grid-cols-3 gap-12 lg:gap-16 relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-px bg-connector-line" />

            {steps.map((step) => (
              <div key={step.num} className="flex flex-col items-center relative z-10">
                <div className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl mb-5 brand-gradient text-white shadow-[0_16px_32px_-12px_hsla(var(--brand-to),0.7)]">
                  {step.num}
                </div>
                <h3 className="text-2xl font-semibold text-center mb-3">{step.title}</h3>
                <p className="text-base text-muted-foreground text-center text-pretty">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-[1232px] mx-auto glass-card p-12 sm:p-16 rounded-[40px] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-cta pointer-events-none" />
          <div className="relative flex flex-col items-center gap-6 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-balance">Ready to Go Obsidian?</h2>
            <p className="text-lg text-muted-foreground max-w-[672px] text-pretty">
              Join the future of encoding. Start creating secure, beautiful QR codes in seconds.
            </p>
            <Link
              to="/tools"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl brand-gradient text-white font-semibold text-lg hover:brightness-110 transition-all shadow-[0_20px_40px_-16px_hsla(var(--brand-to),0.8)]"
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-xs font-semibold text-muted-foreground">
              No credit card required. Enterprise plans available.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
