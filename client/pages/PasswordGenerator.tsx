"use client";

import { useState, useEffect } from "react";
import SEO from "@/components/SEO";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";
import { Download, Share2, Copy, Sparkles, Sliders, Check, Eye, EyeOff, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

export default function PasswordGenerator() {
  const t = useTranslations("Tools.PasswordGenerator");
  const faqs = getFaqsForRoute("password-generator");
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [customChars, setCustomChars] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyType, setCopyType] = useState("");
  const [isAutoGenerate, setIsAutoGenerate] = useState(true);

  const generatePassword = () => {
    let chars = "";

    if (uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (numbers) chars += "0123456789";
    if (symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    if (customChars) chars += customChars;

    if (chars.length === 0) {
      setPassword("");
      return;
    }

    let generated = "";
    for (let i = 0; i < length; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(generated);
  };

  useEffect(() => {
    if (isAutoGenerate) {
      const delayDebounceFn = setTimeout(() => {
        generatePassword();
      }, 250);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [length, uppercase, lowercase, numbers, symbols, customChars, isAutoGenerate]);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyType(type);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      if (err instanceof Error && err.name === "NotAllowedError") {
        alert("Copy manually: " + text);
      } else {
        console.error(err);
      }
    }
  };

  const downloadPassword = () => {
    if (!password) return;
    const element = document.createElement("a");
    const file = new Blob([password], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "password.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const strengthScore = (): { score: number; label: string; color: string } => {
    let score = 0;
    if (length >= 8) score += 1;
    if (length >= 12) score += 1;
    if (length >= 16) score += 1;
    if (uppercase && lowercase) score += 1;
    if (numbers) score += 1;
    if (symbols) score += 1;

    if (score <= 2) return { score, label: t("weak"), color: "bg-red-500" };
    if (score <= 4) return { score, label: t("fair"), color: "bg-yellow-500" };
    if (score <= 5) return { score, label: t("good"), color: "bg-blue-500" };
    return { score, label: t("strong"), color: "bg-green-500" };
  };

  const strength = strengthScore();

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <SEO
        title={t("title")}
        description={t("description")}
        keywords="password generator, strong password, random password, password maker, secure password"
        categoryName="Crypto & Security"
        toolName={t("title")}
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
            <p className="text-base text-[#4A6857]">
              {t("description")}
            </p>
          </div>

          {/* Generator Grid */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left controls panel */}
            <section className="lg:col-span-7 glass-card-dark p-8 rounded-[24px] space-y-6">
              <div className="space-y-4">
                <h2 className="text-md font-bold text-[#1F3A26] flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#10A968]" /> {t("customize")}
                </h2>

                {/* Length Slider */}
                <div>
                  <label className="block text-xs text-[#4A6857] mb-2">
                    {t("length")}: <span className="text-[#10A968] font-semibold">{length} {t("characters")}</span>
                  </label>
                  <input
                    type="range"
                    min="4"
                    max="64"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="w-full accent-[#10A968] bg-white"
                  />
                  <div className="flex gap-2 mt-2 text-xs text-[#4A6857]">
                    <span>4</span>
                    <span className="flex-1"></span>
                    <span>64</span>
                  </div>
                </div>

                {/* Character Options */}
                <div className="border-t border-[#E0E0E0] pt-4 space-y-3">
                  <span className="block text-xs text-[#4A6857] font-semibold mb-3">{t("characterTypes")}</span>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="uppercase"
                      checked={uppercase}
                      onChange={(e) => setUppercase(e.target.checked)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="uppercase" className="text-sm text-[#2D4D35] cursor-pointer">
                      {t("uppercase")}
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="lowercase"
                      checked={lowercase}
                      onChange={(e) => setLowercase(e.target.checked)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="lowercase" className="text-sm text-[#2D4D35] cursor-pointer">
                      {t("lowercase")}
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="numbers"
                      checked={numbers}
                      onChange={(e) => setNumbers(e.target.checked)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="numbers" className="text-sm text-[#2D4D35] cursor-pointer">
                      {t("numbers")}
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="symbols"
                      checked={symbols}
                      onChange={(e) => setSymbols(e.target.checked)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="symbols" className="text-sm text-[#2D4D35] cursor-pointer">
                      {t("symbols")}
                    </label>
                  </div>
                </div>

                {/* Custom Characters */}
                <div className="border-t border-[#E0E0E0] pt-4">
                  <label className="block text-xs text-[#4A6857] font-semibold mb-2">{t("customCharacters")}</label>
                  <input
                    type="text"
                    value={customChars}
                    onChange={(e) => setCustomChars(e.target.value)}
                    placeholder={t("customPlaceholder")}
                    className="w-full px-3 py-2 rounded-lg border border-[#E0E0E0] bg-white text-[#2D4D35] placeholder-[#999B99] focus:outline-none focus:border-[#4F46E5] text-sm"
                  />
                </div>

                {/* Auto-Generate Toggle */}
                <div className="flex items-center gap-3 pt-2 border-t border-[#E0E0E0]">
                  <input
                    type="checkbox"
                    id="autoGenerate"
                    checked={isAutoGenerate}
                    onChange={(e) => setIsAutoGenerate(e.target.checked)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="autoGenerate" className="text-xs text-[#4A6857] cursor-pointer">
                    {t("autoGenerate")}
                  </label>
                </div>

                {/* Generate Button */}
                <button
                  onClick={generatePassword}
                  className="w-full py-3 px-4 rounded-[12px] bg-gradient-indigo-cyan text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-opacity mt-6"
                >
                  <Zap className="w-4 h-4" /> {isAutoGenerate ? t("regenerate") : t("generate")}
                </button>
              </div>
            </section>

            {/* Right output preview */}
            <section className="lg:col-span-5 flex flex-col items-center">
              <div className="glass-card-dark p-8 rounded-[24px] w-full flex flex-col items-center gap-6 text-center">
                <h2 className="text-[#2D4D35] text-sm font-semibold tracking-wider uppercase">{t("generated")}</h2>

                {/* Strength Indicator */}
                {password && (
                  <div className="w-full space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#4A6857]">{t("strength")}</span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${strength.color === 'bg-red-500' ? 'text-red-600' : strength.color === 'bg-yellow-500' ? 'text-yellow-600' : strength.color === 'bg-blue-500' ? 'text-[#10A968]' : 'text-[#10A968]'}`}>
                        {strength.label}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[rgba(70,69,85,0.30)] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strength.color} transition-all duration-300`}
                        style={{ width: `${(strength.score / 6) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Password Display Container */}
                <div className="relative w-full rounded-[16px] bg-white p-6 flex items-center justify-center shadow-lg border border-[rgba(255,255,255,0.05)] min-h-[150px]">
                  {password ? (
                    <div className="w-full space-y-4">
                      <div className="flex items-center gap-3">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          readOnly
                          className="flex-1 px-4 py-3 rounded-lg bg-white text-[#2D4D35] font-mono text-sm border border-[#E0E0E0] focus:outline-none focus:border-[#10A968]"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="p-3 rounded-lg bg-[#E8F0E8] hover:bg-[#D4E8D8] text-[#4A6857] transition-colors"
                          title={showPassword ? t("hide") : t("show")}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <span className="text-xs text-[#4A6857]">
                        {password.length} characters
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Zap className="w-12 h-12" />
                      <span>{t("empty")}</span>
                    </div>
                  )}
                </div>

                {password && (
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={() => copyToClipboard(password, "password")}
                      className="flex-1 py-3 px-4 rounded-[12px] brand-gradient text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
                    >
                      {copied && copyType === "password" ? (
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
                      onClick={() => copyToClipboard(window.location.href, "link")}
                      className="px-4 py-3 rounded-[12px] border border-[#C5DCC9] bg-[#F0F7F0] hover:bg-[#E8F0E8] text-[#2D4D35] transition-colors"
                      title="Share link"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={downloadPassword}
                      className="px-4 py-3 rounded-[12px] border border-[#C5DCC9] bg-[#F0F7F0] hover:bg-[#E8F0E8] text-[#2D4D35] transition-colors"
                      title="Download password"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <span className="text-xs text-[#4A6857] max-w-[280px]">
                  {t("privacy")}
                </span>
              </div>
            </section>
          </div>
        </div>
      </main>

      <FaqSection items={faqs} title="Password Generator FAQs" />
    </div>
  );
}
