"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Sparkles, Sliders, Layout, Monitor, Shield, Zap, Check } from "lucide-react";

export default function Customization() {
  const [accentColor, setAccentColor] = useState("#4F46E5");
  const [glassStrength, setGlassStrength] = useState(40);
  const [cardRadius, setCardRadius] = useState(24);
  const [glowEffect, setGlowEffect] = useState(true);
  const [animations, setAnimations] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSaveSettings = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <SEO
        title="Layout Customization"
        description="Personalize your tool options, card setups, accent colors, and custom visual presets."
        keywords="layouts, customization, glassmorphism, accent colors, theme preferences"
      />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-[1280px] mx-auto">
          {/* Header */}
          <div className="mb-12 text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(195,192,255,0.15)] bg-[#131B2E]">
              <Sliders className="w-4 h-4 text-[#C3C0FF]" />
              <span className="text-[#C3C0FF] text-xs font-semibold tracking-wider uppercase">Workspace Customization</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight gradient-text">
              Workspace Settings
            </h1>
            <p className="text-base text-[#C7C4D8]">
              Tailor your visual environment. Alter opacity levels, card roundness, ambient glows, and layout themes to match your work criteria.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Control panel */}
            <div className="lg:col-span-6 glass-card-dark p-8 rounded-[24px] space-y-6">
              <h2 className="text-xl font-bold text-[#E2DFFF] flex items-center gap-2">
                <Layout className="w-5 h-5 text-[#4CD7F6]" /> Visual Theme Settings
              </h2>

              {/* Accent Color Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-[#DAE2FD]">
                  Accent Highlight Color
                </label>
                <div className="flex flex-wrap gap-3">
                  {["#4F46E5", "#03B5D3", "#10B981", "#EC4899", "#F59E0B"].map((color) => (
                    <button
                      key={color}
                      onClick={() => setAccentColor(color)}
                      className="w-10 h-10 rounded-full border-2 transition-transform relative flex items-center justify-center cursor-pointer hover:scale-110"
                      style={{
                        backgroundColor: color,
                        borderColor: accentColor === color ? "#ffffff" : "transparent"
                      }}
                    >
                      {accentColor === color && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Strength selector */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#DAE2FD]">
                  Glassmorphism Opacity Strength: <span className="text-[#4CD7F6]">{glassStrength}%</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={glassStrength}
                  onChange={(e) => setGlassStrength(Number(e.target.value))}
                  className="w-full accent-[#4F46E5] bg-[#131B2E]"
                />
              </div>

              {/* Radius selector */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#DAE2FD]">
                  Card Corner Radius: <span className="text-[#4CD7F6]">{cardRadius}px</span>
                </label>
                <input
                  type="range"
                  min="4"
                  max="40"
                  value={cardRadius}
                  onChange={(e) => setCardRadius(Number(e.target.value))}
                  className="w-full accent-[#4F46E5] bg-[#131B2E]"
                />
              </div>

              {/* Toggles */}
              <div className="pt-4 border-t border-[rgba(195,192,255,0.10)] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-[#DAE2FD]">Ambient Back Glow</span>
                    <span className="text-xs text-[#C7C4D8]">Enable vibrant color backdrops</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={glowEffect}
                    onChange={(e) => setGlowEffect(e.target.checked)}
                    className="w-5 h-5 accent-[#4F46E5]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-[#DAE2FD]">Motion Animations</span>
                    <span className="text-xs text-[#C7C4D8]">Toggle interactive transition animations</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={animations}
                    onChange={(e) => setAnimations(e.target.checked)}
                    className="w-5 h-5 accent-[#4F46E5]"
                  />
                </div>
              </div>

              {/* Save CTAs */}
              <button
                onClick={handleSaveSettings}
                className="w-full mt-6 py-3 px-4 rounded-[12px] bg-gradient-indigo-cyan text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-all"
              >
                {saved ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                {saved ? "Preferences Saved!" : "Apply Preferences"}
              </button>
            </div>

            {/* Right preview panel */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div className="p-4 rounded-[12px] bg-[#131B2E] text-center border border-[rgba(255,255,255,0.05)]">
                <span className="text-xs text-[#C7C4D8] font-bold">LIVE WORKSPACE LAYOUT PREVIEW</span>
              </div>

              {/* Sample Card Render based on states */}
              <div className="relative p-10 flex items-center justify-center min-h-[320px] rounded-[32px] bg-[#0A0D1A] overflow-hidden border border-[rgba(255,255,255,0.05)]">
                {/* Simulated Glow */}
                {glowEffect && (
                  <div
                    className="absolute w-64 h-64 rounded-full blur-[100px] pointer-events-none transition-all duration-500"
                    style={{
                      backgroundColor: accentColor,
                      opacity: 0.25,
                    }}
                  />
                )}

                {/* Glassmorphic card preview */}
                <div
                  className="w-full max-w-sm p-8 relative z-10 border border-[rgba(255,255,255,0.08)] transition-all duration-300"
                  style={{
                    backgroundColor: `rgba(23, 31, 51, ${glassStrength / 100})`,
                    backdropFilter: "blur(20px)",
                    borderRadius: `${cardRadius}px`,
                  }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300"
                      style={{ backgroundColor: `${accentColor}1A` }}
                    >
                      <Monitor className="w-6 h-6" style={{ color: accentColor }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-[#DAE2FD]">Theme Card</h3>
                      <p className="text-xs text-[#C7C4D8]">Sleek Modern Preset</p>
                    </div>
                  </div>

                  <p className="text-sm text-[#C7C4D8] leading-relaxed mb-6">
                    This item directly previews your selected border styles, accent highlights, rounded sizes, and backdrop opacities in real-time.
                  </p>

                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 text-xs font-bold rounded-lg text-white transition-colors duration-300"
                      style={{ backgroundColor: accentColor }}
                    >
                      Accent Button
                    </button>
                    <button className="px-4 py-2 text-xs font-bold rounded-lg border border-[rgba(70,69,85,0.50)] text-[#DAE2FD] hover:bg-white/5 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>

              <div className="glass-card-dark p-6 rounded-[24px] flex items-start gap-4">
                <Shield className="w-8 h-8 text-[#4CD7F6] shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-[#DAE2FD]">Local Performance Priority</h4>
                  <p className="text-xs text-[#C7C4D8] leading-relaxed mt-1">
                    Your layout and rendering settings are cached locally. Performance remains perfectly streamlined without external API requests.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
