import { Link } from "@/lib/router-compat";
import { StaggerList } from "@/components/StaggerList";

export default function About() {
  return (
    <div className="min-h-screen bg-transparent text-foreground">
      {/* Hero Section */}
      <section className="section-py section-px relative overflow-hidden">
        {/* Background Gradient */}
        <div
          className="absolute inset-0 w-full h-96 bg-hero-radial pointer-events-none"
          style={{ top: "0" }}
        />

        <div className="container-full relative z-10">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight gradient-text">
              What is TechTools?
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              TechTools is a modern web platform offering a growing collection of online utilities and productivity tools. Whether you need to test internet speed, generate QR codes, compress images, or perform any other task, we've got you covered.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              Built with performance and simplicity in mind, our mission is to save users time by offering easy-to-use digital tools without unnecessary complexity.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className="section-py section-px bg-card/30">
        <div className="container-full">
          <div className="text-center mb-16 space-y-4 max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold">Popular Tools</h2>
            <p className="text-muted-foreground">
              Explore our most used tools trusted by thousands of users daily.
            </p>
          </div>

          <StaggerList staggerDelay={0.1} className="grid-auto-fit">
            {/* Tool 1 */}
            <div className="premium-card p-8 flex flex-col justify-between border border-border/40 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-xl font-semibold">Internet Speed Test</h3>
                <p className="text-muted-foreground text-sm">
                  Measure download speed, upload speed, ping, and network performance in real time.
                </p>
              </div>
              <Link
                to="/speed-test"
                className="mt-6 text-primary font-medium text-sm border-b border-primary/30 pb-1 hover:border-primary transition-colors w-fit"
              >
                Try Now →
              </Link>
            </div>

            {/* Tool 2 */}
            <div className="premium-card p-8 flex flex-col justify-between border border-border/40 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="text-xl font-semibold">Color Picker Tool</h3>
                <p className="text-muted-foreground text-sm">
                  Pick, copy, and convert colors easily with HEX, RGB, and HSL support.
                </p>
              </div>
              <Link
                to="/color-picker"
                className="mt-6 text-primary font-medium text-sm border-b border-primary/30 pb-1 hover:border-primary transition-colors w-fit"
              >
                Try Now →
              </Link>
            </div>

            {/* Tool 3 */}
            <div className="premium-card p-8 flex flex-col justify-between border border-border/40 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center">
                  <span className="text-2xl">⌨️</span>
                </div>
                <h3 className="text-xl font-semibold">Typing Speed Test</h3>
                <p className="text-muted-foreground text-sm">
                  Improve typing speed and accuracy with real-time WPM tracking.
                </p>
              </div>
              <Link
                to="/typing-speed"
                className="mt-6 text-primary font-medium text-sm border-b border-primary/30 pb-1 hover:border-primary transition-colors w-fit"
              >
                Try Now →
              </Link>
            </div>

            {/* Tool 4 */}
            <div className="premium-card p-8 flex flex-col justify-between border border-border/40 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center">
                  <span className="text-2xl">📷</span>
                </div>
                <h3 className="text-xl font-semibold">QR Code Generator</h3>
                <p className="text-muted-foreground text-sm">
                  Generate custom QR codes for URLs, text, WiFi, email, and more.
                </p>
              </div>
              <Link
                to="/qr-generator"
                className="mt-6 text-primary font-medium text-sm border-b border-primary/30 pb-1 hover:border-primary transition-colors w-fit"
              >
                Try Now →
              </Link>
            </div>

            {/* Tool 5 */}
            <div className="premium-card p-8 flex flex-col justify-between border border-border/40 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold">Barcode Generator</h3>
                <p className="text-muted-foreground text-sm">
                  Create barcodes in multiple formats for products, inventory, and logistics.
                </p>
              </div>
              <Link
                to="/barcode-generator"
                className="mt-6 text-primary font-medium text-sm border-b border-primary/30 pb-1 hover:border-primary transition-colors w-fit"
              >
                Try Now →
              </Link>
            </div>

            {/* Tool 6 */}
            <div className="premium-card p-8 flex flex-col justify-between border border-border/40 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center">
                  <span className="text-2xl">🖼</span>
                </div>
                <h3 className="text-xl font-semibold">Image Converter</h3>
                <p className="text-muted-foreground text-sm">
                  Convert images into different formats quickly and easily.
                </p>
              </div>
              <Link
                to="/tools"
                className="mt-6 text-primary font-medium text-sm border-b border-primary/30 pb-1 hover:border-primary transition-colors w-fit"
              >
                Try Now →
              </Link>
            </div>

            {/* Tool 6 */}
            <div className="premium-card p-8 flex flex-col justify-between border border-border/40 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center">
                  <span className="text-2xl">📏</span>
                </div>
                <h3 className="text-xl font-semibold">Unit Converter</h3>
                <p className="text-muted-foreground text-sm">
                  Convert measurements, currencies, sizes, and more instantly.
                </p>
              </div>
              <Link
                to="/tools"
                className="mt-6 text-primary font-medium text-sm border-b border-primary/30 pb-1 hover:border-primary transition-colors w-fit"
              >
                Try Now →
              </Link>
            </div>
          </StaggerList>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="section-bg-alt section-py section-px">
        <div className="container-full">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold">Our Impact</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Trusted by users worldwide for their daily productivity needs.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center space-y-3">
              <div className="text-5xl font-bold gradient-text">50+</div>
              <div className="text-muted-foreground">Useful Tools</div>
            </div>
            <div className="text-center space-y-3">
              <div className="text-5xl font-bold gradient-text">10K+</div>
              <div className="text-muted-foreground">Monthly Users</div>
            </div>
            <div className="text-center space-y-3">
              <div className="text-5xl font-bold gradient-text">Fast</div>
              <div className="text-muted-foreground">& Secure</div>
            </div>
            <div className="text-center space-y-3">
              <div className="text-5xl font-bold gradient-text">24/7</div>
              <div className="text-muted-foreground">Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-py section-px">
        <div className="container-wide">
          <div className="glass-card p-12 sm:p-16 rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-cta pointer-events-none" />
            <div className="relative flex flex-col items-center gap-6 text-center max-w-2xl mx-auto">
              <h2 className="text-4xl sm:text-5xl font-bold">Ready to Get Started?</h2>
              <p className="text-lg text-muted-foreground">
                Explore all our tools and boost your productivity today.
              </p>
              <Link
                to="/tools"
                className="btn-primary px-8"
              >
                Explore All Tools
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
