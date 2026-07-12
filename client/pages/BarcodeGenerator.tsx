"use client";

import { useState, useEffect, useRef } from "react";
import SEO from "@/components/SEO";
import JsBarcode from "jsbarcode";
import { Download, Share2, Copy, Sparkles, RefreshCw, Layers, Sliders, Check, ImageIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function BarcodeGenerator() {
  const [text, setText] = useState("123456789012");
  const [format, setFormat] = useState("CODE128");
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(100);
  const [displayValue, setDisplayValue] = useState(true);
  const [lineColor, setLineColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const barcodeFormats = [
    { value: "CODE128", label: "CODE128", requirement: "Alphanumeric" },
    { value: "CODE39", label: "CODE39", requirement: "Alphanumeric" },
    { value: "EAN13", label: "EAN13", requirement: "Exactly 13 digits" },
    { value: "EAN8", label: "EAN8", requirement: "Exactly 8 digits" },
    { value: "UPC", label: "UPC", requirement: "11-12 digits" },
    { value: "ITF14", label: "ITF14", requirement: "14 digits" },
  ];

  const validateInput = (value: string, fmt: string): string => {
    if (!value.trim()) {
      return "Barcode content cannot be empty";
    }

    switch (fmt) {
      case "EAN13":
        if (!/^\d{13}$/.test(value)) {
          return "EAN13 requires exactly 13 digits";
        }
        break;
      case "EAN8":
        if (!/^\d{8}$/.test(value)) {
          return "EAN8 requires exactly 8 digits";
        }
        break;
      case "UPC":
        if (!/^\d{11,12}$/.test(value)) {
          return "UPC requires 11-12 digits";
        }
        break;
      case "ITF14":
        if (!/^\d{14}$/.test(value)) {
          return "ITF14 requires exactly 14 digits";
        }
        break;
      case "CODE39":
        if (!/^[A-Z0-9\s\-\.\/\+\$\%]+$/.test(value.toUpperCase())) {
          return "CODE39 supports only alphanumeric characters and special characters (- . / + $ %)";
        }
        break;
      case "CODE128":
        // CODE128 supports most ASCII characters
        break;
    }
    return "";
  };

  const generateBarcode = async () => {
    setIsGenerating(true);
    setError("");
    try {
      const validationError = validateInput(text, format);
      if (validationError) {
        setError(validationError);
        setIsGenerating(false);
        return;
      }

      if (svgRef.current) {
        JsBarcode(svgRef.current, text, {
          format: format,
          width: width,
          height: height,
          displayValue: displayValue,
          lineColor: lineColor,
          background: bgColor,
          margin: 10,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate barcode";
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      generateBarcode();
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [text, format, width, height, displayValue, lineColor, bgColor]);

  const downloadBarcode = () => {
    if (!svgRef.current) return;
    
    const svg = svgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = "techtools-barcode.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
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
        title="Barcode Generator"
        description="Generate barcodes instantly. Create CODE128, CODE39, EAN13, UPC, and more. Instant download and customization."
        keywords="barcode generator, create barcode, barcode maker, CODE128, EAN13, UPC"
      />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-[1280px] mx-auto">
          {/* Header */}
          <div className="mb-12 text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(76,215,246,0.15)] bg-white">
              <Sparkles className="w-4 h-4 text-[#10A968]" />
              <span className="text-[#10A968] text-xs font-semibold tracking-wider uppercase">Premium Utility</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight gradient-text">
              Barcode Generator
            </h1>
            <p className="text-base text-[#4A6857]">
              Instantly create barcodes in multiple formats for products, inventory, and logistics. Fully customizable and printable.
            </p>
          </div>

          {/* Generator Grid */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left controls panel */}
            <div className="lg:col-span-7 glass-card-dark p-8 rounded-[24px] space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#2D4D35] mb-2">
                  Barcode Content (Numbers & Text)
                </label>
                <div className="relative">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter barcode data..."
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

              {/* Advanced Options */}
              <div className="border-t border-[#E0E0E0] pt-6 space-y-4">
                <h3 className="text-md font-bold text-[#1F3A26] flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#10A968]" /> Customize Design Settings
                </h3>

                {/* Barcode Format */}
                <div>
                  <label className="block text-xs text-[#4A6857] mb-2">Barcode Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E0E0E0] bg-white text-[#2D4D35] text-sm"
                  >
                    {barcodeFormats.map((fmt) => (
                      <option key={fmt.value} value={fmt.value}>
                        {fmt.label} ({fmt.requirement})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-[#4A6857] mt-2">
                    Current format: <span className="text-[#10A968] font-semibold">{barcodeFormats.find(f => f.value === format)?.requirement}</span>
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Line Color */}
                  <div>
                    <label className="block text-xs text-[#4A6857] mb-2">Barcode Color (Lines)</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={lineColor}
                        onChange={(e) => setLineColor(e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={lineColor}
                        onChange={(e) => setLineColor(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs rounded-lg border border-[#E0E0E0] bg-white text-[#2D4D35] focus:outline-none focus:border-[#10A968] uppercase"
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
                        className="flex-1 px-3 py-2 text-xs rounded-lg border border-[#E0E0E0] bg-white text-[#2D4D35] focus:outline-none focus:border-[#10A968] uppercase"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  {/* Width slider */}
                  <div>
                    <label className="block text-xs text-[#4A6857] mb-2">
                      Line Width: <span className="text-[#10A968] font-semibold">{width}px</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      className="w-full accent-[#10A968] bg-white"
                    />
                  </div>

                  {/* Height slider */}
                  <div>
                    <label className="block text-xs text-[#4A6857] mb-2">
                      Height: <span className="text-[#10A968] font-semibold">{height}px</span>
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="300"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full accent-[#10A968] bg-white"
                    />
                  </div>
                </div>

                {/* Display Value Toggle */}
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="displayValue"
                    checked={displayValue}
                    onChange={(e) => setDisplayValue(e.target.checked)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="displayValue" className="text-xs text-[#4A6857] cursor-pointer">
                    Display barcode value below image
                  </label>
                </div>
              </div>
            </div>

            {/* Right output preview */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="glass-card-dark p-8 rounded-[24px] w-full flex flex-col items-center gap-6 text-center">
                <span className="text-[#2D4D35] text-sm font-semibold tracking-wider uppercase">Live Barcode Preview</span>

                {/* Error message */}
                {error && (
                  <div className="w-full p-4 rounded-[12px] bg-red-500/20 border border-red-500/40 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="text-left">
                      <p className="text-red-400 text-sm font-medium">Invalid Input</p>
                      <p className="text-red-300/80 text-xs mt-1">{error}</p>
                    </div>
                  </div>
                )}

                {/* Barcode output container */}
                <div className="relative w-full rounded-[16px] bg-white p-4 flex items-center justify-center shadow-lg border border-[#E0E0E0] overflow-auto min-h-[200px]">
                  {isGenerating ? (
                    <div className="flex flex-col items-center gap-2 text-gray-500 py-8">
                      <ImageIcon className="w-12 h-12" />
                      <span>Generating Barcode...</span>
                    </div>
                  ) : error ? (
                    <div className="flex flex-col items-center gap-2 text-gray-500 py-8">
                      <AlertCircle className="w-12 h-12" />
                      <span>Fix the input to generate</span>
                    </div>
                  ) : (
                    <svg ref={svgRef} />
                  )}
                </div>

                <div className="flex gap-3 w-full">
                  <button
                    onClick={downloadBarcode}
                    className="flex-1 py-3 px-4 rounded-[12px] brand-gradient text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
                  >
                    <Download className="w-4 h-4" /> Download PNG
                  </button>
                  <button
                    onClick={async () => {
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
                    title="Share Barcode Link"
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
