import { useEffect, useRef, useState } from "react";
import { Download, Upload, Zap } from "lucide-react";
import "../../styles/speed-test/styles.css";

type Phase = "idle" | "download" | "upload" | "done";

export function SpeedTest() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [speed, setSpeed] = useState(0);
  const [download, setDownload] = useState<number | null>(null);
  const [upload, setUpload] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const animatingRef = useRef(false);

  const stopAnimating = () => {
    animatingRef.current = false;
  };

  useEffect(() => () => stopAnimating(), []);

  const measureDownload = async () => {
    const sizes = [10_000_000, 25_000_000];
    let lastMbps = 0;
    for (const bytes of sizes) {
      const url = `https://speed.cloudflare.com/__down?bytes=${bytes}&cacheBust=${Date.now()}`;
      const start = performance.now();
      const res = await fetch(url, { cache: "no-store" });
      const reader = res.body!.getReader();
      let received = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        received += value.length;
        const elapsed = (performance.now() - start) / 1000;
        if (elapsed > 0.05) {
          lastMbps = (received * 8) / 1_000_000 / elapsed;
          setSpeed(lastMbps);
          setProgress(Math.min(85, (elapsed / 10) * 100));
        }
      }
    }
    return lastMbps;
  };

  const measureUpload = async () => {
    const chunkSize = 2_000_000;
    const raw = new Uint8Array(chunkSize);
    crypto.getRandomValues(raw.subarray(0, Math.min(65536, chunkSize)));
    const blob = new Blob([raw]);

    const overallStart = performance.now();
    let totalBytes = 0;
    let lastMbps = 0;
    const maxDuration = 6000;
    let failures = 0;

    while (performance.now() - overallStart < maxDuration) {
      const url = `https://speed.cloudflare.com/__up?bytes=${chunkSize}&r=${Math.random()}`;
      try {
        const res = await fetch(url, {
          method: "POST",
          body: blob,
          mode: "cors",
          cache: "no-store",
          credentials: "omit",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        await res.arrayBuffer();
        totalBytes += chunkSize;
        const elapsed = (performance.now() - overallStart) / 1000;
        lastMbps = (totalBytes * 8) / 1_000_000 / elapsed;
        setSpeed(lastMbps);
        setProgress(Math.min(85, (elapsed / 6) * 100));
      } catch (err) {
        failures++;
        if (failures >= 2) throw err;
      }
    }
    return lastMbps;
  };

  const start = async () => {
    setDownload(null);
    setUpload(null);
    setSpeed(0);
    setProgress(0);
    animatingRef.current = true;

    try {
      setPhase("download");
      const dl = await measureDownload();
      setDownload(dl);
      setProgress(100);
      
      await new Promise((r) => setTimeout(r, 1000));
      
      setPhase("upload");
      setSpeed(0);
      setProgress(0);
      const ul = await measureUpload();
      setUpload(ul);
      setProgress(100);
      
      setPhase("done");
    } catch (e) {
      console.error(e);
      setPhase("idle");
      setProgress(0);
    } finally {
      stopAnimating();
    }
  };

  const isLoading = phase === "download" || phase === "upload";
  const displaySpeed = Math.max(0, Math.round(speed * 10) / 10);

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4 sm:px-6 py-8">
      {/* Main Card */}
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              Speed Test
            </h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            Test your internet speed with Cloudflare's network
          </p>
        </div>

        {/* Main Speed Display */}
        <div className="bg-card border-2 border-border rounded-2xl p-8 sm:p-12 mb-8 shadow-sm">
          {/* Current Speed */}
          <div className="text-center mb-8">
            <div className="text-6xl sm:text-7xl lg:text-8xl font-bold text-primary tabular-nums tracking-tight">
              {displaySpeed}
            </div>
            <div className="text-base sm:text-lg text-muted-foreground mt-3 font-semibold">
              {phase === "download" ? "Download Speed (Mbps)" : phase === "upload" ? "Upload Speed (Mbps)" : "Mbps"}
            </div>
          </div>

          {/* Progress Bar */}
          {isLoading && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-muted-foreground min-w-[40px] text-right">
                  {Math.round(progress)}%
                </span>
              </div>
              <p className="text-center text-xs sm:text-sm text-muted-foreground font-semibold">
                {phase === "download" ? "Testing Download…" : "Testing Upload…"}
              </p>
            </div>
          )}

          {/* Status Message */}
          {!isLoading && (
            <div className="text-center">
              {phase === "idle" && (
                <p className="text-base sm:text-lg text-foreground font-semibold">Ready to test your speed?</p>
              )}
              {phase === "done" && (
                <p className="text-base sm:text-lg text-primary font-bold">✓ Test Complete!</p>
              )}
            </div>
          )}
        </div>

        {/* Results Grid */}
        {(download !== null || upload !== null) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {/* Download Result */}
            <div className="bg-card border-2 border-border rounded-xl p-6 sm:p-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Download className="w-6 h-6 text-primary" />
                <h3 className="text-lg sm:text-xl font-bold text-foreground">Download</h3>
              </div>
              <div className="text-4xl sm:text-5xl font-bold text-primary tabular-nums tracking-tight">
                {download !== null ? download.toFixed(1) : "—"}
              </div>
              <p className="text-sm text-muted-foreground mt-2 font-semibold">Mbps</p>
            </div>

            {/* Upload Result */}
            <div className="bg-card border-2 border-border rounded-xl p-6 sm:p-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Upload className="w-6 h-6 text-primary" />
                <h3 className="text-lg sm:text-xl font-bold text-foreground">Upload</h3>
              </div>
              <div className="text-4xl sm:text-5xl font-bold text-primary tabular-nums tracking-tight">
                {upload !== null ? upload.toFixed(1) : "—"}
              </div>
              <p className="text-sm text-muted-foreground mt-2 font-semibold">Mbps</p>
            </div>
          </div>
        )}

        {/* Start Button */}
        <div className="text-center">
          <button
            onClick={start}
            disabled={isLoading}
            className={`px-8 sm:px-12 py-4 sm:py-5 text-base sm:text-lg font-bold rounded-xl transition-all transform ${
              isLoading
                ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                : "bg-primary text-primary-foreground hover:shadow-lg hover:-translate-y-1 active:scale-95 shadow-md"
            }`}
          >
            {isLoading ? "Testing…" : "Start Speed Test"}
          </button>
        </div>

        {/* Info */}
        <div className="text-center mt-8 text-xs sm:text-sm text-muted-foreground">
          <p>Your results will appear here once testing is complete.</p>
          <p className="mt-2">Powered by Cloudflare's global network</p>
        </div>
      </div>
    </main>
  );
}
