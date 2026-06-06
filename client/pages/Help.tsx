"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { HelpCircle, Search, Mail, BookOpen, ChevronDown, Check, Users } from "lucide-react";

export default function Help() {
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "Are the productivity tools safe to use?",
      a: "Yes! All calculation, formatting, QR encoding, and color picking processes run fully in your own web browser. Your confidential information never leaves your device or gets saved on external servers."
    },
    {
      q: "Can I use TechTools without an internet connection?",
      a: "Yes! Because the utilities process client-side, the page can be fully loaded once, and core features like the Color Picker, Typing Test, and QR Generator will stay operational offline."
    },
    {
      q: "How accurate is the Internet Speed Test?",
      a: "It connects to edge locations to calculate latency, download metrics, and upload bandwidth. Results are highly precise but can vary briefly depending on network traffic or other apps running in the background."
    },
    {
      q: "How can I contact technical support?",
      a: "Simply use our Contact Us form page or reach out directly via support@techtools.dev for assistance with bulk operations, API licenses, or reporting bugs."
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.q.toLowerCase().includes(search.toLowerCase()) ||
    faq.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <SEO
        title="Help & Frequently Asked Questions"
        description="Get instant help, read user manuals, review FAQs, and connect with technical support."
        keywords="help, support, user guide, faq, tech tools help"
      />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-[1280px] mx-auto">
          {/* Header */}
          <div className="mb-12 text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(76,215,246,0.15)] bg-[#131B2E]">
              <HelpCircle className="w-4 h-4 text-[#4CD7F6]" />
              <span className="text-[#4CD7F6] text-xs font-semibold tracking-wider uppercase">Support Center</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight gradient-text">
              How Can We Help?
            </h1>
            <p className="text-base text-[#C7C4D8]">
              Search our self-help articles, explore documentation guidelines, or get in touch with our tech specialists.
            </p>

            {/* Support search input */}
            <div className="relative max-w-lg mx-auto mt-6">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search resources, topics, or FAQs..."
                className="w-full pl-12 pr-4 py-4 rounded-[12px] border border-[rgba(70,69,85,0.30)] bg-[#131B2E] text-[#DAE2FD] placeholder-[#6B7280] focus:outline-none focus:border-[#4F46E5]"
              />
              <Search className="absolute left-4 top-4 text-[#C7C4D8] w-5 h-5" />
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start mt-12">
            {/* FAQs Accordion */}
            <div className="lg:col-span-8 space-y-4">
              <h2 className="text-2xl font-bold text-[#E2DFFF] mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-[#C3C0FF]" /> Frequently Asked Questions
              </h2>

              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                  <div
                    key={index}
                    className="glass-card-dark rounded-xl overflow-hidden border border-[rgba(195,192,255,0.05)]"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                    >
                      <span className="font-semibold text-[#DAE2FD]">{faq.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#C7C4D8] transition-transform duration-300 ${
                          openFaq === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openFaq === index && (
                      <div className="px-6 pb-6 pt-2 text-[#C7C4D8] text-sm leading-relaxed border-t border-[rgba(195,192,255,0.05)]">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="glass-card-dark rounded-xl p-8 text-center text-[#C7C4D8]">
                  No results found matching "{search}". Try checking different keywords.
                </div>
              )}
            </div>

            {/* Quick Contact & Resource Cards */}
            <div className="lg:col-span-4 space-y-6">
              <div className="glass-card-dark p-6 rounded-[24px] border border-[rgba(195,192,255,0.05)]">
                <Mail className="w-8 h-8 text-[#4CD7F6] mb-4" />
                <h3 className="font-bold text-lg text-[#DAE2FD] mb-2">Still Have Questions?</h3>
                <p className="text-xs text-[#C7C4D8] leading-relaxed mb-6">
                  Our professional support team is ready to assist you. Receive custom guides, license options, or setup parameters.
                </p>
                <div className="flex flex-col gap-2">
                  <a
                    href="/contact-us"
                    className="w-full text-center py-3 rounded-lg bg-[#4F46E5] text-white font-bold text-xs hover:bg-[#4338CA] transition-colors"
                  >
                    Submit Support Ticket
                  </a>
                </div>
              </div>

              <div className="glass-card-dark p-6 rounded-[24px] border border-[rgba(195,192,255,0.05)] space-y-4">
                <h3 className="font-bold text-base text-[#DAE2FD]">Community Support</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[rgba(19,27,46,0.50)] flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#C3C0FF]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#DAE2FD]">Developer Discord Forum</h4>
                    <p className="text-xxs text-[#C7C4D8]">Join 1,200+ online utilities members</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
