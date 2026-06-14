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
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 w-full h-[20rem] sm:h-[28rem] bg-hero-radial pointer-events-none" style={{ top: 0 }} />

        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-6 sm:gap-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 w-fit px-3 sm:px-4 py-2 rounded-full border border-white/20 bg-white/5 dark:bg-white/[0.03] backdrop-blur-sm">
              <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-primary" />
              <span className="text-primary text-xs font-semibold tracking-wide uppercase">Next-Gen Tools</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4 sm:space-y-5">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                All Your Essential <span className="gradient-text">Tech Tools</span> in One Place
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-lg leading-relaxed">
                Fast, free, and modern online tools for developers, students, creators. Everything designed for speed and simplicity.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                to="/tools"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-2xl brand-gradient text-white text-sm sm:text-base font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
              >
                Start Tools
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about-us"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-2xl border border-white/20 bg-white/5 dark:bg-white/[0.03] backdrop-blur-md text-foreground text-sm sm:text-base font-semibold hover:bg-white/10 hover:border-white/30 transition-all"
              >
                Learn More
              </Link>
            </div>

            {/* Short Intro Paragraph */}
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg leading-relaxed">
              QR generators, speed tests, image converters, color pickers, developer tools — all in your browser, securely.
            </p>
          </div>

          {/* Right Preview */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Glow */}
              <div className="absolute -inset-6 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
              <div className="relative rounded-2xl sm:rounded-3xl backdrop-blur-md bg-white/10 dark:bg-white/[0.05] border border-white/10 p-6 sm:p-10 shadow-2xl">
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
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 space-y-3 sm:space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Why Choose TechTools?</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Trusted by thousands for fast, secure, and simple online utilities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="p-6 sm:p-8 rounded-lg sm:rounded-2xl backdrop-blur-md bg-white/[0.08] dark:bg-white/[0.05] border border-white/10 hover:border-white/20 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg sm:rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-4">
                    <Icon className="w-5 sm:w-6 h-5 sm:h-6 text-primary" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white/[0.02] dark:bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8 mb-10 sm:mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Flexible Tools</h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-sm">
                All your favorite online utilities in one place.
              </p>
            </div>
            <Link
              to="/generator"
              className="inline-flex items-center gap-1 text-primary font-medium text-xs sm:text-sm hover:text-primary/80 transition-colors"
            >
              View All Tools
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {integrations.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="p-4 sm:p-6 rounded-lg sm:rounded-2xl backdrop-blur-md bg-white/[0.08] dark:bg-white/[0.05] border border-white/10 hover:border-white/20 hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col items-center gap-3 text-center group">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg sm:rounded-xl bg-white/10 border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-5 sm:w-6 h-5 sm:h-6 text-primary" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-12 sm:mb-16">Simple Workflow</h2>

          <div className="grid md:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {steps.map((step) => (
              <div key={step.num} className="flex flex-col items-center relative z-10">
                <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full flex items-center justify-center font-bold text-xl sm:text-2xl mb-4 sm:mb-5 brand-gradient text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all">
                  {step.num}
                </div>
                <h3 className="text-lg sm:text-2xl font-semibold text-center mb-2 sm:mb-3">{step.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground text-center leading-relaxed max-w-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto p-8 sm:p-12 lg:p-16 rounded-2xl sm:rounded-3xl backdrop-blur-md bg-white/[0.08] dark:bg-white/[0.05] border border-white/10 hover:border-white/20 hover:shadow-2xl transition-all relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
          <div className="relative flex flex-col items-center gap-4 sm:gap-6 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">Ready to Get Started?</h2>
            <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl">
              Join thousands of users with powerful tools in your browser.
            </p>
            <Link
              to="/tools"
              className="inline-flex items-center gap-2 px-6 sm:px-10 py-3 sm:py-4 rounded-lg sm:rounded-2xl brand-gradient text-white text-sm sm:text-lg font-semibold hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all"
            >
              Get Started
              <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
            </Link>
            <p className="text-xs text-muted-foreground">
              No credit card required.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
