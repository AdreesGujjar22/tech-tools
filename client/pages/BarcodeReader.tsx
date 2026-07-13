"use client";

import { BrowserMultiFormatReader } from "@zxing/browser";
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import SEO from "@/components/SEO";
import { Barcode, Camera, CheckCircle2, Clipboard, Copy, FileImage, ImageUp, LoaderCircle, RotateCcw, ScanLine, Square, Upload, XCircle } from "lucide-react";

type DetectedCode = {
  rawValue: string;
  format: string;
};

type BarcodeDetectorInstance = {
  detect: (source: HTMLImageElement | HTMLVideoElement) => Promise<DetectedCode[]>;
};

type BarcodeDetectorConstructor = new (options?: { formats?: string[] }) => BarcodeDetectorInstance;

declare global {
  interface Window {
    BarcodeDetector?: BarcodeDetectorConstructor;
  }
}

const supportedFormats = ["qr_code", "code_128", "code_39", "code_93", "codabar", "ean_13", "ean_8", "itf", "upc_a", "upc_e", "data_matrix", "aztec", "pdf417"];

export default function BarcodeReader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanFrameRef = useRef<number | null>(null);
  const zxingReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const zxingControlsRef = useRef<{ stop: () => void } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isScanningImage, setIsScanningImage] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<DetectedCode | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => () => stopCamera(), []);

  const getDetector = () => {
    if (!window.BarcodeDetector) return null;
    return new window.BarcodeDetector({ formats: supportedFormats });
  };

  const getZxingReader = () => {
    if (!zxingReaderRef.current) zxingReaderRef.current = new BrowserMultiFormatReader();
    return zxingReaderRef.current;
  };

  const handleDetectedCode = (code: DetectedCode) => {
    setResult(code);
    setError("");
  };

  const scanImage = async (file: File) => {
    if (!file.type.match(/^image\/(png|jpeg|jpg)$/)) {
      setError("Choose a PNG or JPG image containing a QR code or barcode.");
      return;
    }

    const detector = getDetector();

    setIsScanningImage(true);
    setResult(null);
    setError("");
    const nextPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return nextPreviewUrl;
    });

    try {
      if (detector) {
        const image = new Image();
        image.src = nextPreviewUrl;
        await image.decode();
        const codes = await detector.detect(image);
        if (codes[0]) {
          handleDetectedCode(codes[0]);
          return;
        }
      } else {
        const code = await getZxingReader().decodeFromImageUrl(nextPreviewUrl);
        handleDetectedCode({ rawValue: code.getText(), format: String(code.getBarcodeFormat()).toLowerCase() });
        return;
      }
      setError("No readable code was found. Try a clearer, higher-resolution image.");
    } catch {
      setError("We could not decode that image. Try a clearer QR code or barcode image.");
    } finally {
      setIsScanningImage(false);
    }
  };

  const stopCamera = () => {
    if (scanFrameRef.current) cancelAnimationFrame(scanFrameRef.current);
    zxingControlsRef.current?.stop();
    zxingControlsRef.current = null;
    scanFrameRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    const detector = getDetector();

    setError("");
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (!videoRef.current) return;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      if (detector) {
        const scanVideo = async () => {
          if (!videoRef.current || !streamRef.current) return;
          if (videoRef.current.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
            try {
              const codes = await detector.detect(videoRef.current);
              if (codes[0]) {
                handleDetectedCode(codes[0]);
                stopCamera();
                return;
              }
            } catch {
            }
          }
          scanFrameRef.current = requestAnimationFrame(scanVideo);
        };
        scanFrameRef.current = requestAnimationFrame(scanVideo);
      } else {
        zxingControlsRef.current = await getZxingReader().decodeFromVideoElement(videoRef.current, (code) => {
          if (code) {
            handleDetectedCode({ rawValue: code.getText(), format: String(code.getBarcodeFormat()).toLowerCase() });
            stopCamera();
          }
        });
      }
      setIsCameraActive(true);
    } catch (cameraError) {
      const name = cameraError instanceof DOMException ? cameraError.name : "";
      setError(name === "NotAllowedError" ? "Camera permission was blocked. Allow access in your browser settings and try again." : "We could not start the camera. Check that another app is not using it.");
      stopCamera();
    }
  };

  const clearScan = () => {
    stopCamera();
    setResult(null);
    setError("");
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    if (inputRef.current) inputRef.current.value = "";
  };

  const copyResult = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.rawValue);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) scanImage(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) scanImage(file);
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <SEO title="Barcode & QR Reader" description="Scan QR codes and barcodes from uploaded images or your device camera, securely in your browser." keywords="QR reader, barcode scanner, scan QR image, webcam barcode scanner" />
      <main className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-5 rounded-full border border-[#10A968]/20 bg-[#F0F7F0]">
              <ScanLine className="w-4 h-4 text-[#10A968]" />
              <span className="text-[#10A968] text-xs font-semibold tracking-wider uppercase">Private browser scanning</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight gradient-text">Barcode &amp; QR Reader</h1>
            <p className="mt-4 text-[#4A6857]">Upload a code image or use your camera to instantly reveal its URL, product number, or text.</p>
          </div>


          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
            <section className="glass-card-dark rounded-[24px] p-5 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-[#E8F5ED] text-[#10A968] flex items-center justify-center"><ImageUp className="w-5 h-5" /></div>
                <div><h2 className="font-bold text-lg text-[#1F3A26]">Upload &amp; scan image</h2><p className="text-sm text-[#4A6857]">PNG or JPG, processed on your device.</p></div>
              </div>
              <div onDrop={handleDrop} onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} className={`relative min-h-72 rounded-2xl border-2 border-dashed transition-colors flex flex-col items-center justify-center text-center p-6 ${isDragging ? "border-[#10A968] bg-[#F0F7F0]" : "border-[#C5DCC9] bg-white/70"}`}>
                {previewUrl ? <img src={previewUrl} alt="Uploaded code preview" className="max-h-56 max-w-full object-contain rounded-xl" /> : <><div className="w-14 h-14 rounded-full bg-[#F0F7F0] text-[#10A968] flex items-center justify-center mb-4"><Upload className="w-6 h-6" /></div><p className="font-semibold text-[#2D4D35]">Drop a code image here</p><p className="mt-1 text-sm text-[#4A6857]">or select a file from your device</p></>}
                {isScanningImage && <div className="absolute inset-0 rounded-2xl bg-white/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-[#10A968]"><LoaderCircle className="w-8 h-8 animate-spin" /><span className="text-sm font-semibold">Reading code…</span></div>}
              </div>
              <input ref={inputRef} type="file" accept="image/png,image/jpeg" onChange={handleFileChange} className="hidden" />
              <div className="mt-4 flex gap-3"><button onClick={() => inputRef.current?.click()} disabled={isScanningImage} className="flex-1 py-3 rounded-xl brand-gradient text-white text-sm font-semibold inline-flex justify-center items-center gap-2 disabled:opacity-50"><FileImage className="w-4 h-4" />Choose image</button>{previewUrl && <button onClick={clearScan} className="px-4 py-3 rounded-xl border border-[#C5DCC9] bg-white text-[#2D4D35]" aria-label="Clear image"><RotateCcw className="w-4 h-4" /></button>}</div>
            </section>

            <section className="glass-card-dark rounded-[24px] p-5 sm:p-8">
              <div className="flex items-center gap-3 mb-6"><div className="w-11 h-11 rounded-2xl bg-[#E8F5ED] text-[#10A968] flex items-center justify-center"><Camera className="w-5 h-5" /></div><div><h2 className="font-bold text-lg text-[#1F3A26]">Live webcam scanner</h2><p className="text-sm text-[#4A6857]">Point your camera at a physical code.</p></div></div>
              <div className="relative min-h-72 overflow-hidden rounded-2xl bg-[#183A27] flex items-center justify-center">
                <video ref={videoRef} muted playsInline className={`w-full h-72 object-cover ${isCameraActive ? "block" : "hidden"}`} />
                {!isCameraActive && <div className="text-center text-white/80 px-6"><div className="w-14 h-14 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center"><Barcode className="w-6 h-6" /></div><p className="font-semibold text-white">Ready when you are</p><p className="mt-1 text-sm">Camera access is only used while scanning.</p></div>}
                {isCameraActive && <><div className="absolute inset-8 sm:inset-12 border-2 border-[#69E18B] rounded-2xl pointer-events-none"><span className="absolute left-0 right-0 top-1/2 h-px bg-[#69E18B] shadow-[0_0_12px_2px_#69E18B] animate-pulse" /></div><span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1.5 text-xs text-white">Scanning live</span></>}
              </div>
              <button onClick={isCameraActive ? stopCamera : startCamera} disabled={false} className={`mt-4 w-full py-3 rounded-xl text-sm font-semibold inline-flex justify-center items-center gap-2 transition-colors disabled:opacity-50 ${isCameraActive ? "border border-[#C5DCC9] bg-white text-[#2D4D35]" : "brand-gradient text-white"}`}>{isCameraActive ? <><Square className="w-4 h-4 fill-current" />Stop camera</> : <><Camera className="w-4 h-4" />Start camera scan</>}</button>
            </section>
          </div>

          <section className="mt-6 glass-card-dark rounded-[24px] p-5 sm:p-7 max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-xl flex items-center justify-center ${result ? "bg-[#E8F5ED] text-[#10A968]" : error ? "bg-red-50 text-red-500" : "bg-[#E8F0E8] text-[#4A6857]"}`}>{result ? <CheckCircle2 className="w-5 h-5" /> : error ? <XCircle className="w-5 h-5" /> : <Clipboard className="w-5 h-5" />}</div><div><h2 className="font-bold text-[#1F3A26]">Scan result</h2><p className="text-sm text-[#4A6857]">{result ? `${result.format.replace(/_/g, " ")} detected` : error || "Your decoded content will appear here."}</p></div></div>{result && <button onClick={copyResult} className="px-4 py-2 rounded-xl bg-[#E8F5ED] text-[#176C3B] text-sm font-semibold inline-flex items-center gap-2">{copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? "Copied" : "Copy result"}</button>}</div>
            <div className="mt-5 min-h-16 rounded-xl border border-[#E0EAE1] bg-white px-4 py-3 font-mono text-sm text-[#2D4D35] break-all flex items-center">{result?.rawValue || "—"}</div>
          </section>
        </div>
      </main>
    </div>
  );
}
