import { Link } from "@/lib/router-compat";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-transparent text-foreground">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        {/* Background Gradient */}
        <div
          className="absolute inset-0 w-full h-96 bg-hero-radial pointer-events-none"
          style={{ top: "0" }}
        />

        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="text-center space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight gradient-text">
              What is TechTools?
            </h1>
            <p className="text-lg text-[#C7C4D8] max-w-[800px] mx-auto leading-relaxed">
              TechTools is a modern web platform offering a growing collection of online utilities and productivity tools. Whether you need to test internet speed, generate QR codes, compress images, pick colors, calculate values, or improve typing speed — TechTools provides quick and reliable solutions directly from your browser.
            </p>
            <p className="text-base text-[#C7C4D8] max-w-[800px] mx-auto leading-relaxed">
              Built with performance and simplicity in mind, our mission is to save users time by offering easy-to-use digital tools without unnecessary complexity.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className="py-20 px-6">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-semibold text-[#DAE2FD]">Popular Tools</h2>
            <p className="text-base text-[#C7C4D8] max-w-[672px] mx-auto">
              Explore our most used tools trusted by thousands of users daily.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tool 1 */}
            <div className="glass-card-dark p-10 rounded-[24px] flex flex-col justify-between hover:border-[rgba(195,192,255,0.30)] transition-colors">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-[12px] bg-[rgba(195,192,255,0.10)] flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-2xl font-semibold text-[#DAE2FD]">Internet Speed Test</h3>
                <p className="text-base text-[#C7C4D8]">
                  Measure download speed, upload speed, ping, and network performance in real time.
                </p>
              </div>
              <Link
                to="/speed-test"
                className="mt-6 text-[#C3C0FF] font-medium text-sm border-b border-[rgba(195,192,255,0.30)] pb-1 hover:border-[#C3C0FF] transition-colors w-fit"
              >
                Try Now →
              </Link>
            </div>

            {/* Tool 2 */}
            <div className="glass-card-dark p-10 rounded-[24px] flex flex-col justify-between hover:border-[rgba(76,215,246,0.30)] transition-colors">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-[12px] bg-[rgba(76,215,246,0.10)] flex items-center justify-center">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="text-2xl font-semibold text-[#DAE2FD]">Color Picker Tool</h3>
                <p className="text-base text-[#C7C4D8]">
                  Pick, copy, and convert colors easily with HEX, RGB, and HSL support.
                </p>
              </div>
              <Link
                to="/color-picker"
                className="mt-6 text-[#4CD7F6] font-medium text-sm border-b border-[rgba(76,215,246,0.30)] pb-1 hover:border-[#4CD7F6] transition-colors w-fit"
              >
                Try Now →
              </Link>
            </div>

            {/* Tool 3 */}
            <div className="glass-card-dark p-10 rounded-[24px] flex flex-col justify-between hover:border-[rgba(255,180,171,0.30)] transition-colors">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-[12px] bg-[rgba(255,180,171,0.10)] flex items-center justify-center">
                  <span className="text-2xl">⌨️</span>
                </div>
                <h3 className="text-2xl font-semibold text-[#DAE2FD]">Typing Speed Test</h3>
                <p className="text-base text-[#C7C4D8]">
                  Improve typing speed and accuracy with real-time WPM tracking.
                </p>
              </div>
              <Link
                to="/typing-speed"
                className="mt-6 text-[#FFB4AB] font-medium text-sm border-b border-[rgba(255,180,171,0.30)] pb-1 hover:border-[#FFB4AB] transition-colors w-fit"
              >
                Try Now →
              </Link>
            </div>

            {/* Tool 4 */}
            <div className="glass-card-dark p-10 rounded-[24px] flex flex-col justify-between hover:border-[rgba(195,192,255,0.30)] transition-colors">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-[12px] bg-[rgba(195,192,255,0.10)] flex items-center justify-center">
                  <span className="text-2xl">📷</span>
                </div>
                <h3 className="text-2xl font-semibold text-[#DAE2FD]">QR Code Generator</h3>
                <p className="text-base text-[#C7C4D8]">
                  Generate custom QR codes for URLs, text, WiFi, email, and more.
                </p>
              </div>
              <Link
                to="/qr-generator"
                className="mt-6 text-[#C3C0FF] font-medium text-sm border-b border-[rgba(195,192,255,0.30)] pb-1 hover:border-[#C3C0FF] transition-colors w-fit"
              >
                Try Now →
              </Link>
            </div>

            {/* Tool 5 */}
            <div className="glass-card-dark p-10 rounded-[24px] flex flex-col justify-between hover:border-[rgba(76,215,246,0.30)] transition-colors">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-[12px] bg-[rgba(76,215,246,0.10)] flex items-center justify-center">
                  <span className="text-2xl">🖼</span>
                </div>
                <h3 className="text-2xl font-semibold text-[#DAE2FD]">Image Converter</h3>
                <p className="text-base text-[#C7C4D8]">
                  Convert images into different formats quickly and easily.
                </p>
              </div>
              <Link
                to="/tools"
                className="mt-6 text-[#4CD7F6] font-medium text-sm border-b border-[rgba(76,215,246,0.30)] pb-1 hover:border-[#4CD7F6] transition-colors w-fit"
              >
                Try Now →
              </Link>
            </div>

            {/* Tool 6 */}
            <div className="glass-card-dark p-10 rounded-[24px] flex flex-col justify-between hover:border-[rgba(255,180,171,0.30)] transition-colors">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-[12px] bg-[rgba(255,180,171,0.10)] flex items-center justify-center">
                  <span className="text-2xl">📏</span>
                </div>
                <h3 className="text-2xl font-semibold text-[#DAE2FD]">Unit Converter</h3>
                <p className="text-base text-[#C7C4D8]">
                  Convert measurements, currencies, sizes, and more instantly.
                </p>
              </div>
              <Link
                to="/tools"
                className="mt-6 text-[#FFB4AB] font-medium text-sm border-b border-[rgba(255,180,171,0.30)] pb-1 hover:border-[#FFB4AB] transition-colors w-fit"
              >
                Try Now →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="section-bg-alt py-20 px-6">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-semibold text-[#DAE2FD]">Our Impact</h2>
            <p className="text-base text-[#C7C4D8] max-w-[672px] mx-auto">
              Trusted by users worldwide for their daily productivity needs.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-[#C3C0FF]">50+</div>
              <div className="text-base text-[#C7C4D8]">Useful Tools</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-[#4CD7F6]">10K+</div>
              <div className="text-base text-[#C7C4D8]">Monthly Users</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-[#FFB4AB]">Fast</div>
              <div className="text-base text-[#C7C4D8]">& Secure Platform</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-[#C3C0FF]">24/7</div>
              <div className="text-base text-[#C7C4D8]">Accessibility</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-[1232px] mx-auto glass-card-dark p-16 rounded-[40px] bg-gradient-cta">
          <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="text-5xl font-bold text-[#DAE2FD]">Ready to Get Started?</h2>
            <p className="text-lg text-[#C7C4D8] max-w-[672px]">
              Explore all our tools and boost your productivity today.
            </p>
            <Link
              to="/tools"
              className="px-16 py-4 rounded-[12px] bg-[#C3C0FF] text-[#1D00A5] font-semibold text-lg hover:bg-opacity-90 transition-opacity"
            >
              Explore All Tools
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
