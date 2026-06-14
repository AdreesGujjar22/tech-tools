"use client";

import { useState } from "react";
import SEO from "@/components/SEO";
import { HelpCircle, Search, Mail, BookOpen, ChevronDown, Users } from "lucide-react";
import { StaggerList } from "@/components/StaggerList";
import { Badge } from "@/components/ui/Badge";

export default function Help() {
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "Are the productivity tools safe to use?",
      a: "Yes! All calculation, formatting, QR encoding, and color picking processes run fully in your own web browser. Your confidential information never leaves your device or gets saved on external servers.",
    },
    {
      q: "Can I use TechTools without an internet connection?",
      a: "Yes! Because the utilities process client-side, the page can be fully loaded once, and core features like the Color Picker, Typing Test, and QR Generator will stay operational offline.",
    },
    {
      q: "How accurate is the Internet Speed Test?",
      a: "It connects to edge locations to calculate latency, download metrics, and upload bandwidth. Results are highly precise but can vary slightly depending on network traffic or other apps running.",
    },
    {
      q: "How can I contact technical support?",
      a: "Simply use our Contact Us form page or reach out directly via support@techtools.dev for assistance with bulk operations, API licenses, or reporting bugs.",
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

      <main className="section-py section-px">
        <div className="container-full">
          {/* Header */}
          <div className="mb-12 text-center max-w-2xl mx-auto space-y-4 animate-fade-in">
            <Badge className="inline-flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Support Center
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight gradient-text">
              How Can We Help?
            </h1>
            <p className="text-base text-muted-foreground">
              Search our self-help articles, explore documentation guidelines, or get in touch with our tech specialists.
            </p>

            {/* Support search input */}
            <div className="relative max-w-lg mx-auto mt-8">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search resources, topics, or FAQs..."
                className="input-modern w-full pl-12"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start mt-12">
            {/* FAQs Accordion */}
            <div className="lg:col-span-8 space-y-4 animate-slide-up">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" /> Frequently Asked Questions
              </h2>

              {filteredFaqs.length > 0 ? (
                <StaggerList staggerDelay={0.1}>
                  {filteredFaqs.map((faq, index) => (
                    <div
                      key={index}
                      className="premium-card rounded-xl overflow-hidden border border-border/40 hover:shadow-lg transition-all"
                    >
                      <button
                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-accent/30 transition-colors"
                      >
                        <span className="font-semibold">{faq.q}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-muted-foreground transition-transform duration-300 flex-shrink-0 ${
                            openFaq === index ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {openFaq === index && (
                        <div className="px-6 pb-6 pt-2 text-muted-foreground text-sm leading-relaxed border-t border-border">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </StaggerList>
              ) : (
                <div className="premium-card rounded-xl p-8 text-center text-muted-foreground border border-border/40">
                  No results found matching "{search}". Try checking different keywords.
                </div>
              )}
            </div>

            {/* Quick Contact & Resource Cards */}
            <div className="lg:col-span-4 space-y-6 animate-slide-down">
              <div className="premium-card p-6 rounded-xl border border-border/40 hover:shadow-lg transition-all">
                <Mail className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold text-lg mb-2">Still Have Questions?</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                  Our professional support team is ready to assist you. Receive custom guides, license options, or setup parameters.
                </p>
                <a
                  href="/contact-us"
                  className="inline-flex items-center justify-center w-full px-4 py-2 rounded-lg brand-gradient text-white font-semibold text-sm hover:brightness-110 transition-all"
                >
                  Submit Support Ticket
                </a>
              </div>

              <div className="premium-card p-6 rounded-xl space-y-4 border border-border/40 hover:shadow-lg transition-all">
                <h3 className="font-bold text-base">Community Support</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">Developer Discord Forum</h4>
                    <p className="text-xs text-muted-foreground">Join 1,200+ online utilities members</p>
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
