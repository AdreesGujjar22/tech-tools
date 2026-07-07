"use client";

import { useState, useEffect, useRef } from "react";
import SEO from "@/components/SEO";
import JsBarcode from "jsbarcode";
import { Download, Share2, Copy, Sparkles, RefreshCw, Layers, Sliders, Check, ImageIcon } from "lucide-react";
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
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const barcodeFormats = [
    { value: "CODE128", label: "CODE128" },
    { value: "CODE39", label: "CODE39" },
    { value: "EAN13", label: "EAN13" },
    { value: "EAN8", label: "EAN8" },
    { value: "UPC", label: "UPC" },
    { value: "ITF14", label: "ITF14" },
  ];

  const generateBarcode = async () => {
    setIsGenerating(true);
    try {
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
      console.error(err);
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(76,215,246,0.15)] bg-[#131B2E]">
              <Sparkles className="w-4 h-4 text-[#4CD7F6]" />
              <span className="text-[#4CD7F6] text-xs font-semibold tracking-wider uppercase">Premium Utility</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight gradient-text">
              Barcode Generator
            </h1>
            <p className="text-base text-[#C7C4D8]">
              Instantly create barcodes in multiple formats for products, inventory, and logistics. Fully customizable and printable.
            </p>
          </div>

          {/* Generator Grid */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left controls panel */}
            <div className="lg:col-span-7 glass-card-dark p-8 rounded-[24px] space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#DAE2FD] mb-2">
                  Barcode Content (Numbers & Text)
                </label>
                <div className="relative">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter barcode data..."
                    className="w-full h-28 px-4 py-3 rounded-[12px] border border-[rgba(70,69,85,0.30)] bg-[#131B2E] text-[#DAE2FD] placeholder-[#6B7280] focus:outline-none focus:border-[#4F46E5] resize-none"
                  />
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="p-2 rounded-lg bg-[rgba(45,52,73,0.50)] hover:bg-[rgba(45,52,73,0.80)] text-[#C7C4D8] transition-colors"
                      title="Copy content"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setText("")}
                      className="p-2 rounded-lg bg-[rgba(45,52,73,0.50)] hover:bg-[rgba(45,52,73,0.80)] text-[#C7C4D8] transition-colors"
                      title="Clear content"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Advanced Options */}
              <div className="border-t border-[rgba(195,192,255,0.10)] pt-6 space-y-4">
                <h3 className="text-md font-bold text-[#E2DFFF] flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#C3C0FF]" /> Customize Design Settings
                </h3>

                {/* Barcode Format */}
                <div>
                  <label className="block text-xs text-[#C7C4D8] mb-2">Barcode Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[rgba(70,69,85,0.30)] bg-[#131B2E] text-[#DAE2FD] text-sm"
                  >
                    {barcodeFormats.map((fmt) => (
                      <option key={fmt.value} value={fmt.value}>
                        {fmt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Line Color */}
                  <div>
                    <label className="block text-xs text-[#C7C4D8] mb-2">Barcode Color (Lines)</label>
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
                        className="flex-1 px-3 py-2 text-xs rounded-lg border border-[rgba(70,69,85,0.30)] bg-[#131B2E] text-[#DAE2FD] uppercase"
                      />
                    </div>
                  </div>

                  {/* Background Color */}
                  <div>
                    <label className="block text-xs text-[#C7C4D8] mb-2">Background Color</label>
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
                        className="flex-1 px-3 py-2 text-xs rounded-lg border border-[rgba(70,69,85,0.30)] bg-[#131B2E] text-[#DAE2FD] uppercase"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  {/* Width slider */}
                  <div>
                    <label className="block text-xs text-[#C7C4D8] mb-2">
                      Line Width: <span className="text-[#4CD7F6] font-semibold">{width}px</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      className="w-full accent-[#4F46E5] bg-[#131B2E]"
                    />
                  </div>

                  {/* Height slider */}
                  <div>
                    <label className="block text-xs text-[#C7C4D8] mb-2">
                      Height: <span className="text-[#4CD7F6] font-semibold">{height}px</span>
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="300"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full accent-[#4F46E5] bg-[#131B2E]"
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
                  <label htmlFor="displayValue" className="text-xs text-[#C7C4D8] cursor-pointer">
                    Display barcode value below image
                  </label>
                </div>
              </div>
            </div>

            {/* Right output preview */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="glass-card-dark p-8 rounded-[24px] w-full flex flex-col items-center gap-6 text-center">
                <span className="text-[#DAE2FD] text-sm font-semibold tracking-wider uppercase">Live Barcode Preview</span>

                {/* Barcode output container */}
                <div className="relative w-full rounded-[16px] bg-white p-4 flex items-center justify-center shadow-lg border border-[rgba(255,255,255,0.05)] overflow-auto">
                  {isGenerating ? (
                    <div className="flex flex-col items-center gap-2 text-gray-400 py-8">
                      <ImageIcon className="w-12 h-12" />
                      <span>Generating Barcode...</span>
                    </div>
                  ) : (
                    <svg ref={svgRef} />
                  )}
                </div>

                <div className="flex gap-3 w-full">
                  <button
                    onClick={downloadBarcode}
                    className="flex-1 py-3 px-4 rounded-[12px] bg-gradient-indigo-cyan text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
                  >
                    <Download className="w-4 h-4" /> Download PNG
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(window.location.href);
                        alert("Saved sharing link to your clipboard!");
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    className="px-4 py-3 rounded-[12px] border border-[#464555] bg-[rgba(23,31,51,0.40)] hover:bg-[rgba(23,31,51,0.60)] text-[#DAE2FD] transition-colors"
                    title="Share Barcode Link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                <span className="text-xs text-[#C7C4D8] max-w-[280px]">
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
