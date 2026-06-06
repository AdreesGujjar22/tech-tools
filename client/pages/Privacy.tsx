"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Shield, Lock, Eye, Server, RefreshCw } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <SEO
        title="Privacy Policy"
        description="Learn how TechTools collects, uses, and protects your local browser details."
        keywords="privacy, terms, cookies, safety, browser storage"
      />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-[800px] mx-auto space-y-8">
          {/* Header */}
          <div className="border-b border-[rgba(195,192,255,0.10)] pb-6">
            <h1 className="text-3xl lg:text-4xl font-bold leading-tight text-[#E2DFFF] mb-2">
              Privacy Policy
            </h1>
            <p className="text-sm text-[#C7C4D8]">
              Updated June 5, 2026 • Real-time Compliance Statement
            </p>
          </div>

          {/* Intro cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl border border-[rgba(76,215,246,0.15)] bg-[rgba(3,181,211,0.05)] text-center flex flex-col items-center">
              <Lock className="w-8 h-8 text-[#4CD7F6] mb-3" />
              <span className="text-xs font-bold text-[#DAE2FD]">100% Client-Side</span>
            </div>
            <div className="p-5 rounded-xl border border-[rgba(195,192,255,0.15)] bg-[rgba(79,70,229,0.05)] text-center flex flex-col items-center">
              <Eye className="w-8 h-8 text-[#C3C0FF] mb-3" />
              <span className="text-xs font-bold text-[#DAE2FD]">Zero Tracking Cookies</span>
            </div>
            <div className="p-5 rounded-xl border border-[rgba(255,180,171,0.15)] bg-[rgba(255,180,171,0.05)] text-center flex flex-col items-center">
              <Server className="w-8 h-8 text-rose-400 mb-3" />
              <span className="text-xs font-bold text-[#DAE2FD]">No Data Sales</span>
            </div>
          </div>

          {/* Policy Text sections */}
          <div className="space-y-6 text-[#C7C4D8] leading-relaxed text-sm">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#E2DFFF]">1. Scope & Core Integrity</h2>
              <p>
                At TechTools, user privacy is our topmost priority. This policy covers how our web interface handles parameters, payloads, or values processed through our Typing Speed Test, Color Selector, and QR Code Generator.
              </p>
              <p>
                Because our platform works natively inside your client-side browser, we do not transmit, analyze, sync, or sell any textual content, URLs, uploaded images, or test samples to our servers.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#E2DFFF]">2. Cookies & Local Storage</h2>
              <p>
                We may use standard HTML5 local storage space or secure keys on your immediate device to temporarily store preferences such as chosen display speeds, color extraction history, or customized themes.
              </p>
              <p>
                These values are stored entirely locally on your machine and can be deleted entirely at any time by clearing your browser cache. We utilize no persistent tracking metrics.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#E2DFFF]">3. Third-Party Integrations & Sizing</h2>
              <p>
                Our contact details use EmailJS. By submitting emails or queries through our forms, only specified name, body text, and sender values are delivered to support agents. None of this data is cached on our structural server blocks.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#E2DFFF]">4. Children's Privacy Guidelines</h2>
              <p>
                Since our educational utilities and diagnostic tests transmit no personal identifiable data, they are fully safe and appropriate for users of all age levels, including children under 13.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
