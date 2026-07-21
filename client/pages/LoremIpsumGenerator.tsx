"use client";

import { useState, useEffect } from "react";
import SEO from "@/components/SEO";
import { Download, Share2, Copy, Sparkles, Sliders, Check } from "lucide-react";
import { useTranslations } from "next-intl";

const LOREM_IPSUM_TEXT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const LOREM_WORDS = LOREM_IPSUM_TEXT.split(/\s+/);

const generateLoremParagraphs = (count: number): string => {
  let result = "";
  for (let i = 0; i < count; i++) {
    const sentences = Math.floor(Math.random() * 4) + 3;
    let paragraph = "";
    for (let j = 0; j < sentences; j++) {
      const sentenceLength = Math.floor(Math.random() * 8) + 4;
      let sentence = "";
      for (let k = 0; k < sentenceLength; k++) {
        sentence += LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)] + " ";
      }
      paragraph += sentence.charAt(0).toUpperCase() + sentence.slice(1).trim() + ". ";
    }
    result += paragraph.trim() + "\n\n";
  }
  return result.trim();
};

const generateLoremWords = (count: number): string => {
  let result = "";
  for (let i = 0; i < count; i++) {
    result += LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)] + " ";
  }
  return result.trim();
};

const generateLoremSentences = (count: number): string => {
  let result = "";
  for (let i = 0; i < count; i++) {
    const sentenceLength = Math.floor(Math.random() * 8) + 4;
    let sentence = "";
    for (let k = 0; k < sentenceLength; k++) {
      sentence += LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)] + " ";
    }
    result += sentence.charAt(0).toUpperCase() + sentence.slice(1).trim() + ". ";
  }
  return result.trim();
};

export default function LoremIpsumGenerator() {
  const t = useTranslations("Tools.LoremGenerator");
  const [loremText, setLoremText] = useState("");
  const [type, setType] = useState("paragraphs");
  const [count, setCount] = useState(5);
  const [copied, setCopied] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    let generated = "";
    if (type === "paragraphs") {
      generated = generateLoremParagraphs(count);
    } else if (type === "words") {
      generated = generateLoremWords(count);
    } else if (type === "sentences") {
      generated = generateLoremSentences(count);
    }

    setLoremText(generated);
    setWordCount(generated.split(/\s+/).filter((w) => w.length > 0).length);
    setCharCount(generated.length);
  }, [type, count]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(loremText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      if (err instanceof Error && err.name === "NotAllowedError") {
        alert(t("copyManual"));
      } else {
        console.error(err);
      }
    }
  };

  const downloadText = () => {
    if (!loremText) return;
    const element = document.createElement("a");
    const file = new Blob([loremText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "lorem-ipsum.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const shareText = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch (err) {
      if (err instanceof Error && err.name === "NotAllowedError") {
        alert("Link: " + window.location.href);
      } else {
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <SEO
        title={t("title")}
        description={t("description")}
        keywords="lorem ipsum generator, placeholder text, lorem ipsum, dummy text, filler text"
      />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-[1280px] mx-auto">
          {/* Header */}
          <div className="mb-12 text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(76,215,246,0.15)] bg-white">
              <Sparkles className="w-4 h-4 text-[#10A968]" />
              <span className="text-[#10A968] text-xs font-semibold tracking-wider uppercase">{t("premium")}</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight gradient-text">
              {t("title")}
            </h1>
            <p className="text-base text-[#4A6857]">{t("description")}</p>
          </div>

          {/* Generator Grid */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left controls panel */}
            <div className="lg:col-span-7 glass-card-dark p-8 rounded-[24px] space-y-6">
              <div className="space-y-4">
                <h3 className="text-md font-bold text-[#1F3A26] flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#10A968]" /> {t("customize")}
                </h3>

                {/* Type Selection */}
                <div>
                  <label className="block text-xs text-[#4A6857] font-semibold mb-3">{t("generateType")}</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "paragraphs", label: t("paragraphs") },
                      { value: "sentences", label: t("sentences") },
                      { value: "words", label: t("words") },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setType(opt.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                          type === opt.value
                            ? "brand-gradient text-white"
                            : "bg-[#E8F0E8] text-[#2D4D35] hover:bg-[#D4E8D8]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Count Slider */}
                <div>
                  <label className="block text-xs text-[#4A6857] mb-2">
                    {t("numberOf", { type: t(type) })}: <span className="text-[#10A968] font-semibold">{count}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max={type === "paragraphs" ? 20 : type === "sentences" ? 50 : 100}
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="w-full accent-[#10A968] bg-white"
                  />
                  <div className="flex gap-2 mt-2 text-xs text-[#4A6857]">
                    <span>1</span>
                    <span className="flex-1"></span>
                    <span>{type === "paragraphs" ? 20 : type === "sentences" ? 50 : 100}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="border-t border-[#E0E0E0] pt-4 space-y-2">
                  <div className="flex justify-between text-xs text-[#4A6857]">
                    <span>{t("wordCount")}</span>
                    <span className="text-[#10A968] font-semibold">{wordCount}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#4A6857]">
                    <span>{t("characterCount")}</span>
                    <span className="text-[#10A968] font-semibold">{charCount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right output preview */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="glass-card-dark p-8 rounded-[24px] w-full flex flex-col items-center gap-6 text-center">
                <span className="text-[#2D4D35] text-sm font-semibold tracking-wider uppercase">{t("generatedText")}</span>

                {/* Text output container */}
                <div className="relative w-full rounded-[16px] bg-white p-4 flex items-center justify-center shadow-lg border border-[rgba(255,255,255,0.05)] overflow-auto min-h-[300px]">
                  {loremText ? (
                    <textarea
                      value={loremText}
                      readOnly
                      className="w-full h-80 px-4 py-3 rounded-lg bg-white text-[#2D4D35] font-serif text-sm border border-[#E0E0E0] focus:outline-none resize-none leading-relaxed"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400 py-8">
                      <Sparkles className="w-12 h-12" />
                      <span>{t("generating")}</span>
                    </div>
                  )}
                </div>

                {loremText && (
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={copyToClipboard}
                      className="flex-1 py-3 px-4 rounded-[12px] brand-gradient text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" /> {t("copied")}
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" /> {t("copy")}
                        </>
                      )}
                    </button>
                    <button
                      onClick={downloadText}
                      className="px-4 py-3 rounded-[12px] border border-[#C5DCC9] bg-[#F0F7F0] hover:bg-[#E8F0E8] text-[#2D4D35] transition-colors"
                      title={t("download")}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={shareText}
                      className="px-4 py-3 rounded-[12px] border border-[#C5DCC9] bg-[#F0F7F0] hover:bg-[#E8F0E8] text-[#2D4D35] transition-colors"
                      title={t("share")}
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <span className="text-xs text-[#4A6857] max-w-[280px]">
                  {t("privacy")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
