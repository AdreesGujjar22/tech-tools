"use client";

import { useState, useEffect, useRef } from "react";
import SEO from "@/components/SEO";
import QRCode from "qrcode";
import { Download, Share2, Copy, Sparkles, RefreshCw, Layers, Sliders, Check, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Generator() {
  const [text, setText] = useState("https://www.ilovetechtools.com");
  const [qrUrl, setQrUrl] = useState("");
  const [size, setSize] = useState(300);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [margin, setMargin] = useState(2);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQRCode = async () => {
    if (!text || text.trim() === "") {
      setQrUrl("");
      return;
    }

    setIsGenerating(true);
    try {
      const url = await QRCode.toDataURL(text, {
        width: size,
        margin: margin,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      });
      setQrUrl(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      generateQRCode();
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [text, size, fgColor, bgColor, margin]);

  const downloadQR = () => {
    if (!qrUrl) return;
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = "techtools-qrcode.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <SEO
        title="QR Code Generator"
        description="Generate beautiful, customizable QR codes instantly. Choose background colors, foreground colors, sizing and print formats."
        keywords="qr code generator, create qr code, dynamic qr, customizable qrcode"
      />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-[1280px] mx-auto">
          {/* Header */}
          <div className="mb-12 text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(16,169,104,0.25)] bg-[#F0F7F0]">
              <Sparkles className="w-4 h-4 text-[#10A968]" />
              <span className="text-[#10A968] text-xs font-semibold tracking-wider uppercase">Premium Utility</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight gradient-text">
              QR Code Generator
            </h1>
            <p className="text-base text-[#4A6857]">
              Instantly create fully customized QR codes for websites, WiFi networks, digital business cards, or text payloads.
            </p>
          </div>

          {/* Generator Grid */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left controls panel */}
            <div className="lg:col-span-7 glass-card-dark p-8 rounded-[24px] space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#2D4D35] mb-2">
                  QR Code Content (URL, Text, or Node)
                </label>
                <div className="relative">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter URL or text to encode..."
                    className="w-full h-28 px-4 py-3 rounded-[12px] border border-[#E0E0E0] bg-white text-[#2D4D35] placeholder-[#999B99] focus:outline-none focus:border-[#10A968] resize-none"
                  />
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="p-2 rounded-lg bg-[#E8F0E8] hover:bg-[#D4E8D8] text-[#4A6857] transition-colors"
                      title="Copy content"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setText("")}
                      className="p-2 rounded-lg bg-[#E8F0E8] hover:bg-[#D4E8D8] text-[#4A6857] transition-colors"
                      title="Clear content"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Advanced Options Accordion/Drawer */}
              <div className="border-t border-[#E0E0E0] pt-6 space-y-4">
                <h3 className="text-md font-bold text-[#1F3A26] flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#10A968]" /> Customize Design Settings
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Foreground Color */}
                  <div>
                    <label className="block text-xs text-[#4A6857] mb-2">QR Code Color (Foreground)</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs rounded-lg border border-[#E0E0E0] bg-white text-[#2D4D35] uppercase"
                      />
                    </div>
                  </div>

                  {/* Background Color */}
                  <div>
                    <label className="block text-xs text-[#4A6857] mb-2">Background Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs rounded-lg border border-[#E0E0E0] bg-white text-[#2D4D35] uppercase"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  {/* Size slider */}
                  <div>
                    <label className="block text-xs text-[#4A6857] mb-2">
                      Resolution Sizing: <span className="text-[#10A968] font-semibold">{size} x {size}px</span>
                    </label>
                    <input
                      type="range"
                      min="120"
                      max="800"
                      value={size}
                      onChange={(e) => setSize(Number(e.target.value))}
                      className="w-full accent-[#10A968] bg-white"
                    />
                  </div>

                  {/* Margin slider */}
                  <div>
                    <label className="block text-xs text-[#4A6857] mb-2">
                      Quiet Zone Margin: <span className="text-[#10A968] font-semibold">{margin}px</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={margin}
                      onChange={(e) => setMargin(Number(e.target.value))}
                      className="w-full accent-[#10A968] bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right output preview */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="glass-card-dark p-8 rounded-[24px] w-full flex flex-col items-center gap-6 text-center">
                <span className="text-[#2D4D35] text-sm font-semibold tracking-wider uppercase">Live QR Preview</span>

                {/* QR output image container */}
                <div className="relative aspect-square w-72 h-72 rounded-[16px] bg-white p-4 flex items-center justify-center shadow-lg border border-[#E0E0E0]">
                  {qrUrl ? (
                    <img src={qrUrl} alt="Generated QR code" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <ImageIcon className="w-12 h-12" />
                      <span>Generating QR Code...</span>
                    </div>
                  )}

                  {isGenerating && (
                    <div className="absolute inset-0 bg-white/75 backdrop-blur-sm rounded-[16px] flex items-center justify-center">
                      <RefreshCw className="w-8 h-8 text-[#10A968] animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 w-full">
                  <button
                    onClick={downloadQR}
                    disabled={!qrUrl}
                    className="flex-1 py-3 px-4 rounded-[12px] brand-gradient text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-opacity disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" /> Download PNG
                  </button>
                  <button
                    onClick={async () => {
                      if (!qrUrl) return;
                      try {
                        await navigator.clipboard.writeText(window.location.href);
                        alert("Saved sharing link to your clipboard!");
                      } catch (err) {
                        if (err instanceof Error && err.name === "NotAllowedError") {
                          alert("Link: " + window.location.href);
                        } else {
                          console.error(err);
                        }
                      }
                    }}
                    className="px-4 py-3 rounded-[12px] border border-[#C5DCC9] bg-[#F0F7F0] hover:bg-[#E8F0E8] text-[#2D4D35] transition-colors"
                    title="Share QR Link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                <span className="text-xs text-[#4A6857] max-w-[280px]">
                  All processing is conducted safely in-browser. Your data never leaves your local system.
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
