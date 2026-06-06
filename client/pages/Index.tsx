import { Link } from "@/lib/router-compat";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

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
        <div
          className="absolute inset-0 w-full h-96 bg-hero-radial pointer-events-none"
          style={{ top: "0" }}
        />

        <div className="max-w-[1280px] mx-auto relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 w-fit px-4 py-2 rounded-full border border-[rgba(70,69,85,0.30)] bg-[#222A3D]">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 4.66667L9.77083 3.0625L8.16667 2.33333L9.77083 1.60417L10.5 0L11.2292 1.60417L12.8333 2.33333L11.2292 3.0625L10.5 4.66667V4.66667M10.5 12.8333L9.77083 11.2292L8.16667 10.5L9.77083 9.77083L10.5 8.16667L11.2292 9.77083L12.8333 10.5L11.2292 11.2292L10.5 12.8333V12.8333M4.66667 11.0833L3.20833 7.875L0 6.41667L3.20833 4.95833L4.66667 1.75L6.125 4.95833L9.33333 6.41667L6.125 7.875L4.66667 11.0833V11.0833" fill="#4CD7F6"/>
              </svg>
              <span className="text-[#4CD7F6] text-xs font-semibold tracking-[1.2px] uppercase">Next-Gen Encoding</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight gradient-text">
                All Your Essential Tech Tools in One Place
              </h1>
              <p className="text-lg text-[#C7C4D8] max-w-[576px] leading-relaxed">
                Fast, free, and modern online tools for developers, students, creators, and everyday users. Boost productivity with smart utilities designed to simplify your digital life.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/tools"
                className="px-24 py-4 rounded-[12px] bg-gradient-indigo-cyan text-white font-semibold text-md text-center hover:opacity-90 transition-opacity shadow-[0_25px_50px_-12px_rgba(195,192,255,0.20)]"
              >
                Start Using Tools
              </Link>
              <Link
                to="/about-us"
                className="px-24 py-4 rounded-[12px] border border-[#464555] bg-[rgba(23,31,51,0.40)] backdrop-blur-[20px] text-[#DAE2FD] font-semibold text-md text-center hover:bg-[rgba(23,31,51,0.60)] transition-colors"
              >
                Learn More
              </Link>
            </div>

            {/* Short Intro Paragraph */}
            <div className="flex flex-col gap-4">
              <p className="text-base text-[#C7C4D8] max-w-[576px] leading-relaxed">
                Welcome to TechTools, your all-in-one platform for powerful online utilities. From QR generators and internet speed tests to image converters, typing tests, color pickers, and developer tools — everything is designed for speed, simplicity, and accuracy.
              </p>
            </div>
          </div>

          {/* Right Preview */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="rounded-[40px] border border-[rgba(195,192,255,0.10)] bg-[rgba(23,31,51,0.40)] backdrop-blur-[20px] p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
                <div className="aspect-square rounded-[16px] bg-white p-6 flex items-center justify-center">
                  <img
                    src="/images/hero-section.png"
                    alt="QR Code Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Badge */}
                <div className="absolute bottom-6 left-6 p-2 rounded-[12px] bg-[#03B5D3]">
                  <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.6 21L5.7 17.8L2.1 17L2.45 13.3L0 10.5L2.45 7.7L2.1 4L5.7 3.2L7.6 0L11 1.45L14.4 0L16.3 3.2L19.9 4L19.55 7.7L22 10.5L19.55 13.3L19.9 17L16.3 17.8L14.4 21L11 19.55L7.6 21V21M9.95 14.05L15.6 8.4L14.2 6.95L9.95 11.2L7.8 9.1L6.4 10.5L9.95 14.05V14.05" fill="#00424E"/>
                  </svg>
                </div>

                {/* Info Badge */}
                <div className="absolute top-6 right-6 px-4 py-2 rounded-[16px] border border-[rgba(195,192,255,0.30)] bg-[rgba(23,31,51,0.40)] backdrop-blur-[20px] flex items-center gap-2">
                  <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 20C5.68333 19.4167 3.77083 18.0875 2.2625 16.0125C0.754167 13.9375 0 11.6333 0 9.1V3L8 0L16 3V9.1C16 11.6333 15.2458 13.9375 13.7375 16.0125C12.2292 18.0875 10.3167 19.4167 8 20V20M8 17.9C9.73333 17.35 11.1667 16.25 12.3 14.6C13.4333 12.95 14 11.1167 14 9.1V4.375L8 2.125L2 4.375V9.1C2 11.1167 2.56667 12.95 3.7 14.6C4.83333 16.25 6.26667 17.35 8 17.9V17.9M8 10V10V10V10V10V10V10V10V10V10" fill="#C3C0FF"/>
                  </svg>
                  <span className="text-[#C3C0FF] text-sm font-medium">AES-256 Encoded</span>
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
            <h2 className="text-4xl font-semibold text-[#DAE2FD]">Why Choose TechTools?</h2>
            <p className="text-base text-[#C7C4D8] max-w-[672px] mx-auto">
              Discover why thousands of users trust TechTools for their daily productivity needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="glass-card-dark p-10 rounded-[24px] flex flex-col justify-between">
              <div className="space-y-4 mb-8">
                <div className="w-12 h-12 rounded-[12px] bg-[rgba(195,192,255,0.10)] flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-2xl font-semibold text-[#DAE2FD]">Fast & Lightweight</h3>
                <p className="text-base text-[#C7C4D8]">
                  Use tools instantly without heavy downloads or complicated setup.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="glass-card-dark p-10 rounded-[24px] flex flex-col justify-between">
              <div className="space-y-4 mb-8">
                <div className="w-12 h-12 rounded-[12px] bg-[rgba(76,215,246,0.10)] flex items-center justify-center">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="text-2xl font-semibold text-[#DAE2FD]">Secure & Private</h3>
                <p className="text-base text-[#C7C4D8]">
                  Your data stays safe. Most processing happens directly in your browser.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="glass-card-dark p-10 rounded-[24px] flex flex-col justify-between">
              <div className="space-y-4 mb-8">
                <div className="w-12 h-12 rounded-[12px] bg-[rgba(255,180,171,0.10)] flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-2xl font-semibold text-[#DAE2FD]">Easy to Use</h3>
                <p className="text-base text-[#C7C4D8]">
                  Clean and beginner-friendly interface built for everyone.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="glass-card-dark p-10 rounded-[24px] flex flex-col justify-between">
              <div className="space-y-4 mb-8">
                <div className="w-12 h-12 rounded-[12px] bg-[rgba(195,192,255,0.10)] flex items-center justify-center">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="text-2xl font-semibold text-[#DAE2FD]">Fully Responsive</h3>
                <p className="text-base text-[#C7C4D8]">
                  Works smoothly on desktop, tablet, and mobile devices.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="glass-card-dark p-10 rounded-[24px] flex flex-col justify-between">
              <div className="space-y-4 mb-8">
                <div className="w-12 h-12 rounded-[12px] bg-[rgba(76,215,246,0.10)] flex items-center justify-center">
                  <span className="text-2xl">🛠</span>
                </div>
                <h3 className="text-2xl font-semibold text-[#DAE2FD]">Multiple Utilities</h3>
                <p className="text-base text-[#C7C4D8]">
                  Access dozens of useful tools in one centralized platform.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="glass-card-dark p-10 rounded-[24px] flex flex-col justify-between">
              <div className="space-y-4 mb-8">
                <div className="w-12 h-12 rounded-[12px] bg-[rgba(255,180,171,0.10)] flex items-center justify-center">
                  <span className="text-2xl">🌙</span>
                </div>
                <h3 className="text-2xl font-semibold text-[#DAE2FD]">Modern Experience</h3>
                <p className="text-base text-[#C7C4D8]">
                  Beautiful dark/light mode with a sleek modern UI.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="section-bg-alt py-20 px-6">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 mb-12">
            <div className="space-y-2">
              <h2 className="text-4xl font-semibold text-[#DAE2FD]">Limitless Integration</h2>
              <p className="text-base text-[#C7C4D8] max-w-[576px]">
                Whatever your data source, Obsidian handles the translation into secure visual data packets.
              </p>
            </div>
            <Link to="/generator" className="text-[#C3C0FF] font-medium text-sm border-b border-[rgba(195,192,255,0.30)] pb-1 hover:border-[#C3C0FF] transition-colors">
              View All 40+ Types →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["WiFi Hotspots", "Digital VCards", "Encrypted Files", "Crypto Wallets"].map((type) => (
              <div key={type} className="glass-card p-6 rounded-[16px] flex flex-col items-center gap-4 text-center">
                <svg width="36" height="26" viewBox="0 0 36 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 25.5C16.95 25.5 16.0625 25.1375 15.3375 24.4125C14.6125 23.6875 14.25 22.8 14.25 21.75C14.25 20.7 14.6125 19.8125 15.3375 19.0875C16.0625 18.3625 16.95 18 18 18C19.05 18 19.9375 18.3625 20.6625 19.0875C21.3875 19.8125 21.75 20.7 21.75 21.75C21.75 22.8 21.3875 23.6875 20.6625 24.4125C19.9375 25.1375 19.05 25.5 18 25.5V25.5M9.525 17.025L6.375 13.8C7.85 12.325 9.58125 11.1562 11.5688 10.2937C13.5563 9.43125 15.7 9 18 9C20.3 9 22.4437 9.4375 24.4312 10.3125C26.4187 11.1875 28.15 12.375 29.625 13.875L26.475 17.025C25.375 15.925 24.1 15.0625 22.65 14.4375C21.2 13.8125 19.65 13.5 18 13.5C16.35 13.5 14.8 13.8125 13.35 14.4375C11.9 15.0625 10.625 15.925 9.525 17.025V17.025M3.15 10.65L0 7.5C2.3 5.15 4.9875 3.3125 8.0625 1.9875C11.1375 0.6625 14.45 0 18 0C21.55 0 24.8625 0.6625 27.9375 1.9875C31.0125 3.3125 33.7 5.15 36 7.5L32.85 10.65C30.925 8.725 28.6937 7.21875 26.1562 6.13125C23.6188 5.04375 20.9 4.5 18 4.5C15.1 4.5 12.3812 5.04375 9.84375 6.13125C7.30625 7.21875 5.075 8.725 3.15 10.65V10.65" fill="#C3C0FF"/>
                </svg>
                <span className="text-sm font-bold text-[#DAE2FD]">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="text-4xl font-semibold text-center text-[#DAE2FD] mb-16">Seamless Workflow</h2>

          <div className="grid md:grid-cols-3 gap-16 relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-px bg-connector-line" />

            {[
              {
                num: "1",
                title: "Inject Data",
                desc: "Paste your URL, upload files, or link your social profiles into our obsidian console.",
                color: "bg-[#C3C0FF]",
                textColor: "#1D00A5",
              },
              {
                num: "2",
                title: "Stylize Frame",
                desc: "Choose from our library of premium glass templates and adjust colors to match your brand.",
                color: "bg-[#4CD7F6]",
                textColor: "#003640",
              },
              {
                num: "3",
                title: "Deploy Anywhere",
                desc: "Download in vector (SVG/PDF) or raster formats ready for print and high-res digital display.",
                color: "bg-[#4F46E5]",
                textColor: "#FFF",
              },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl mb-4 ${step.color}`}
                  style={{ color: step.textColor }}
                >
                  {step.num}
                </div>
                <h3 className="text-2xl font-semibold text-[#DAE2FD] text-center mb-4">{step.title}</h3>
                <p className="text-base text-[#C7C4D8] text-center">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-[1232px] mx-auto glass-card-dark p-16 rounded-[40px] bg-gradient-cta">
          <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="text-5xl font-bold text-[#DAE2FD]">Ready to Go Obsidian?</h2>
            <p className="text-lg text-[#C7C4D8] max-w-[672px]">
              Join the future of encoding. Start creating secure, beautiful QR codes in seconds.
            </p>
            <Link
              to="/tools"
              className="px-16 py-4 rounded-[12px] bg-[#C3C0FF] text-[#1D00A5] font-semibold text-lg hover:bg-opacity-90 transition-opacity"
            >
              Get Started for Free
            </Link>
            <p className="text-xs font-semibold text-[#C7C4D8]">
              No credit card required. Enterprise plans available.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
