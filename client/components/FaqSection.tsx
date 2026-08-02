"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  title?: string;
  subtitle?: string;
  items: FaqItem[];
}

export default function FaqSection({
  title = "Frequently Asked Questions",
  subtitle = "Everything you need to know about privacy, security, and performance.",
  items,
}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!items || items.length === 0) return null;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="mb-8 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#10A968]/20 bg-[#10A968]/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#10A968]">
          <HelpCircle size={15} />
          <span>FAQ Engine</span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-[#1F3A26] sm:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-sm text-[#4A6857] max-w-xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      <div className="space-y-4">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-[#C5DCC9] bg-white shadow-sm transition-all hover:border-[#10A968]/50"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
                className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-[#F0F7F0]/50"
              >
                <h3 className="text-base font-semibold text-[#1F3A26] sm:text-lg pr-4">
                  {item.question}
                </h3>
                <ChevronDown
                  size={20}
                  className={`shrink-0 text-[#10A968] transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div
                  id={`faq-answer-${index}`}
                  className="border-t border-[#C5DCC9]/60 px-5 py-4 text-sm leading-relaxed text-[#4A6857] bg-[#FAFDFB]"
                >
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
