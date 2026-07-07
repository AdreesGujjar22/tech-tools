"use client";

import { useState, useEffect, useRef } from "react";
import SEO from "@/components/SEO";
import { Download, Share2, Copy, Sparkles, RefreshCw, Sliders, Check, Eye, EyeOff, Zap } from "lucide-react";

export default function PasswordGenerator() {
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

    if (score <= 2) return { score, label: "Weak", color: "bg-red-500" };
    if (score <= 4) return { score, label: "Fair", color: "bg-yellow-500" };
    if (score <= 5) return { score, label: "Good", color: "bg-blue-500" };
    return { score, label: "Strong", color: "bg-green-500" };
  };

  const strength = strengthScore();

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <SEO
        title="Password Generator"
        description="Generate strong, random passwords instantly. Customize length, character types, and create secure passwords for all your accounts."
        keywords="password generator, strong password, random password, password maker, secure password"
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
              Password Generator
            </h1>
            <p className="text-base text-[#C7C4D8]">
              Create strong, random passwords instantly. Customize character types and length for maximum security.
            </p>
          </div>

          {/* Generator Grid */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left controls panel */}
            <div className="lg:col-span-7 glass-card-dark p-8 rounded-[24px] space-y-6">
              {/* Password Options */}
              <div className="space-y-4">
                <h3 className="text-md font-bold text-[#E2DFFF] flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#C3C0FF]" /> Customize Password Settings
                </h3>

                {/* Length Slider */}
                <div>
                  <label className="block text-xs text-[#C7C4D8] mb-2">
                    Password Length: <span className="text-[#4CD7F6] font-semibold">{length} characters</span>
                  </label>
                  <input
                    type="range"
                    min="4"
                    max="64"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="w-full accent-[#4F46E5] bg-[#131B2E]"
                  />
                  <div className="flex gap-2 mt-2 text-xs text-[#C7C4D8]">
                    <span>4</span>
                    <span className="flex-1"></span>
                    <span>64</span>
                  </div>
                </div>

                {/* Character Options */}
                <div className="border-t border-[rgba(195,192,255,0.10)] pt-4 space-y-3">
                  <label className="block text-xs text-[#C7C4D8] font-semibold mb-3">Character Types</label>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="uppercase"
                      checked={uppercase}
                      onChange={(e) => setUppercase(e.target.checked)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="uppercase" className="text-sm text-[#DAE2FD] cursor-pointer">
                      Uppercase (A-Z)
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
                    <label htmlFor="lowercase" className="text-sm text-[#DAE2FD] cursor-pointer">
                      Lowercase (a-z)
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
                    <label htmlFor="numbers" className="text-sm text-[#DAE2FD] cursor-pointer">
                      Numbers (0-9)
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
                    <label htmlFor="symbols" className="text-sm text-[#DAE2FD] cursor-pointer">
                      Symbols (!@#$%^&*...)
                    </label>
                  </div>
                </div>

                {/* Custom Characters */}
                <div className="border-t border-[rgba(195,192,255,0.10)] pt-4">
                  <label className="block text-xs text-[#C7C4D8] font-semibold mb-2">Custom Characters (Optional)</label>
                  <input
                    type="text"
                    value={customChars}
                    onChange={(e) => setCustomChars(e.target.value)}
                    placeholder="Add custom characters to include..."
                    className="w-full px-3 py-2 rounded-lg border border-[rgba(70,69,85,0.30)] bg-[#131B2E] text-[#DAE2FD] placeholder-[#6B7280] focus:outline-none focus:border-[#4F46E5] text-sm"
                  />
                </div>

                {/* Auto-Generate Toggle */}
                <div className="flex items-center gap-3 pt-2 border-t border-[rgba(195,192,255,0.10)]">
                  <input
                    type="checkbox"
                    id="autoGenerate"
                    checked={isAutoGenerate}
                    onChange={(e) => setIsAutoGenerate(e.target.checked)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="autoGenerate" className="text-xs text-[#C7C4D8] cursor-pointer">
                    Auto-generate on change
                  </label>
                </div>

                {/* Generate Button */}
                <button
                  onClick={generatePassword}
                  className="w-full py-3 px-4 rounded-[12px] bg-gradient-indigo-cyan text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-opacity mt-6"
                >
                  <Zap className="w-4 h-4" /> {isAutoGenerate ? "Regenerate" : "Generate"} Password
                </button>
              </div>
            </div>

            {/* Right output preview */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="glass-card-dark p-8 rounded-[24px] w-full flex flex-col items-center gap-6 text-center">
                <span className="text-[#DAE2FD] text-sm font-semibold tracking-wider uppercase">Generated Password</span>

                {/* Strength Indicator */}
                {password && (
                  <div className="w-full space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#C7C4D8]">Password Strength</span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${strength.color === 'bg-red-500' ? 'text-red-400' : strength.color === 'bg-yellow-500' ? 'text-yellow-400' : strength.color === 'bg-blue-500' ? 'text-blue-400' : 'text-green-400'}`}>
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
                          className="flex-1 px-4 py-3 rounded-lg bg-[#131B2E] text-[#DAE2FD] font-mono text-sm border border-[rgba(70,69,85,0.30)] focus:outline-none focus:border-[#4F46E5]"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="p-3 rounded-lg bg-[rgba(45,52,73,0.50)] hover:bg-[rgba(45,52,73,0.80)] text-[#C7C4D8] transition-colors"
                          title={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <span className="text-xs text-[#C7C4D8]">
                        {password.length} characters
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Zap className="w-12 h-12" />
                      <span>Click generate to create password</span>
                    </div>
                  )}
                </div>

                {password && (
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={() => copyToClipboard(password, "password")}
                      className="flex-1 py-3 px-4 rounded-[12px] bg-gradient-indigo-cyan text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
                    >
                      {copied && copyType === "password" ? (
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
                      onClick={() => copyToClipboard(window.location.href, "link")}
                      className="px-4 py-3 rounded-[12px] border border-[#464555] bg-[rgba(23,31,51,0.40)] hover:bg-[rgba(23,31,51,0.60)] text-[#DAE2FD] transition-colors"
                      title="Share link"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={downloadPassword}
                      className="px-4 py-3 rounded-[12px] border border-[#464555] bg-[rgba(23,31,51,0.40)] hover:bg-[rgba(23,31,51,0.60)] text-[#DAE2FD] transition-colors"
                      title="Download password"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <span className="text-xs text-[#C7C4D8] max-w-[280px]">
                  All processing is conducted safely in-browser. Your passwords are never stored or transmitted.
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
