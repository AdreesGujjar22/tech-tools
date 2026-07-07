"use client";

import { useState, useEffect } from "react";
import SEO from "@/components/SEO";
import { Download, Share2, Copy, Sparkles, Sliders, Check } from "lucide-react";

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
        alert("Copy text manually from the text area");
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
        title="Lorem Ipsum Generator"
        description="Generate placeholder Lorem Ipsum text instantly. Create paragraphs, sentences, or words for your designs and projects."
        keywords="lorem ipsum generator, placeholder text, lorem ipsum, dummy text, filler text"
      />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-[1280px] mx-auto">
          {/* Header */}
          <div className="mb-12 text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(76,215,246,0.15)] bg-[#131B2E]">
              <Sparkles className="w-4 h-4 text-[#4CD7F6]" />
              <span className="text-[#4CD7F6] text-xs font-semibold tracking-wider uppercase">Premium Utility</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight gradient-text">
              Lorem Ipsum Generator
            </h1>
            <p className="text-base text-[#C7C4D8]">
              Generate placeholder Lorem Ipsum text instantly for designs, mockups, and prototypes.
            </p>
          </div>

          {/* Generator Grid */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left controls panel */}
            <div className="lg:col-span-7 glass-card-dark p-8 rounded-[24px] space-y-6">
              <div className="space-y-4">
                <h3 className="text-md font-bold text-[#E2DFFF] flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#C3C0FF]" /> Customize Lorem Text
                </h3>

                {/* Type Selection */}
                <div>
                  <label className="block text-xs text-[#C7C4D8] font-semibold mb-3">Generate Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "paragraphs", label: "Paragraphs" },
                      { value: "sentences", label: "Sentences" },
                      { value: "words", label: "Words" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setType(opt.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                          type === opt.value
                            ? "bg-[#4F46E5] text-white"
                            : "bg-[rgba(45,52,73,0.50)] text-[#DAE2FD] hover:bg-[rgba(45,52,73,0.80)]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Count Slider */}
                <div>
                  <label className="block text-xs text-[#C7C4D8] mb-2">
                    Number of {type}: <span className="text-[#4CD7F6] font-semibold">{count}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max={type === "paragraphs" ? 20 : type === "sentences" ? 50 : 100}
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="w-full accent-[#4F46E5] bg-[#131B2E]"
                  />
                  <div className="flex gap-2 mt-2 text-xs text-[#C7C4D8]">
                    <span>1</span>
                    <span className="flex-1"></span>
                    <span>{type === "paragraphs" ? 20 : type === "sentences" ? 50 : 100}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="border-t border-[rgba(195,192,255,0.10)] pt-4 space-y-2">
                  <div className="flex justify-between text-xs text-[#C7C4D8]">
                    <span>Words:</span>
                    <span className="text-[#4CD7F6] font-semibold">{wordCount}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#C7C4D8]">
                    <span>Characters:</span>
                    <span className="text-[#4CD7F6] font-semibold">{charCount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right output preview */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="glass-card-dark p-8 rounded-[24px] w-full flex flex-col items-center gap-6 text-center">
                <span className="text-[#DAE2FD] text-sm font-semibold tracking-wider uppercase">Generated Text</span>

                {/* Text output container */}
                <div className="relative w-full rounded-[16px] bg-white p-4 flex items-center justify-center shadow-lg border border-[rgba(255,255,255,0.05)] overflow-auto min-h-[300px]">
                  {loremText ? (
                    <textarea
                      value={loremText}
                      readOnly
                      className="w-full h-80 px-4 py-3 rounded-lg bg-[#131B2E] text-[#DAE2FD] font-serif text-sm border border-[rgba(70,69,85,0.30)] focus:outline-none resize-none leading-relaxed"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400 py-8">
                      <Sparkles className="w-12 h-12" />
                      <span>Generating Lorem Ipsum...</span>
                    </div>
                  )}
                </div>

                {loremText && (
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={copyToClipboard}
                      className="flex-1 py-3 px-4 rounded-[12px] bg-gradient-indigo-cyan text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" /> Copy
                        </>
                      )}
                    </button>
                    <button
                      onClick={downloadText}
                      className="px-4 py-3 rounded-[12px] border border-[#464555] bg-[rgba(23,31,51,0.40)] hover:bg-[rgba(23,31,51,0.60)] text-[#DAE2FD] transition-colors"
                      title="Download text"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={shareText}
                      className="px-4 py-3 rounded-[12px] border border-[#464555] bg-[rgba(23,31,51,0.40)] hover:bg-[rgba(23,31,51,0.60)] text-[#DAE2FD] transition-colors"
                      title="Share link"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <span className="text-xs text-[#C7C4D8] max-w-[280px]">
                  All processing is conducted safely in-browser. Perfect for mockups, designs, and prototypes.
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
