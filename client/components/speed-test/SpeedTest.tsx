import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Moon, Sun } from "lucide-react";
import "../../styles/speed-test/styles.css";
type Phase = "idle" | "download" | "upload" | "done";

const TICKS = [0, 1, 5, 10, 20, 50, 100];
// log scale 0..100+
const toAngle = (mbps: number) => {
  const v = Math.max(0.1, Math.min(mbps, 100));
  const t = Math.log10(v + 1) / Math.log10(101); // 0..1
  return -210 + t * 240; // arc from -210deg to 30deg (240deg sweep)
};

const ARC_START = -210;
const ARC_SWEEP = 240;
const R = 130;
const CX = 160;
const CY = 160;

const polar = (angleDeg: number, radius = R) => {
  const a = (angleDeg * Math.PI) / 180;
  return { x: CX + radius * Math.cos(a), y: CY + radius * Math.sin(a) };
};

const arcPath = (startA: number, endA: number) => {
  const s = polar(startA);
  const e = polar(endA);
  const large = Math.abs(endA - startA) > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${R} ${R} 0 ${large} 1 ${e.x} ${e.y}`;
};

export function SpeedTest() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [speed, setSpeed] = useState(0); // displayed (smoothed)
  const [download, setDownload] = useState<number | null>(null);
  const [upload, setUpload] = useState<number | null>(null);
  const targetRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const animatingRef = useRef(false);
  const sweepRafRef = useRef<number | null>(null);
  const sweepingRef = useRef(false);

  const startAnimating = () => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    const tick = () => {
      setSpeed((prev) => {
        const next = prev + (targetRef.current - prev) * 0.18;
        return Math.abs(next - targetRef.current) < 0.01 ? targetRef.current : next;
      });
      if (animatingRef.current) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };
  const stopAnimating = () => {
    animatingRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
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
        }
      }
    }
    return lastMbps;
  };

  const measureUpload = async () => {
    const chunkSize = 2_000_000; // 2MB
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
      } catch (err) {
        failures++;
        if (failures >= 2) throw err;
      }
    }
    return lastMbps;
  };

  const startSweep = () => {
    const t0 = performance.now();
    const loop = () => {
      if (!sweepingRef.current) return;
      const t = ((performance.now() - t0) % 2000) / 2000;
      const v = t < 0.5 ? t * 2 * 50 : (1 - t) * 2 * 50;
      targetRef.current = v;
      sweepRafRef.current = requestAnimationFrame(loop);
    };
    sweepingRef.current = true;
    sweepRafRef.current = requestAnimationFrame(loop);
  };
  const stopSweep = () => {
    sweepingRef.current = false;
    if (sweepRafRef.current) cancelAnimationFrame(sweepRafRef.current);
  };

  const start = async () => {
    setDownload(null);
    setUpload(null);
    targetRef.current = 0;
    setSpeed(0);
    startAnimating();
    startSweep();
    try {
      setPhase("download");
      const dl = await measureDownload();
      stopSweep();
      targetRef.current = dl;
      await new Promise((r) => setTimeout(r, 700));
      setDownload(dl);

      setPhase("upload");
      targetRef.current = 0;
      setSpeed(0);
      startSweep();
      const ul = await measureUpload();
      stopSweep();
      targetRef.current = ul;
      await new Promise((r) => setTimeout(r, 700));
      setUpload(ul);
      setPhase("done");
    } catch (e) {
      console.error(e);
      stopSweep();
      setPhase("idle");
    } finally {
      setTimeout(stopAnimating, 600);
    }
  };

  const angle = toAngle(speed);
  const knob = polar(angle);
  const trackPath = arcPath(ARC_START, ARC_START + ARC_SWEEP);
  const progressPath = arcPath(ARC_START, angle);

  const status =
    phase === "idle"
      ? "Tap start to begin"
      : phase === "download"
        ? "Testing download…"
        : phase === "upload"
          ? "Testing upload…"
          : "Test complete";

  const Icon = phase === "upload" ? ArrowUp : ArrowDown;

  return (
    <main className="relative min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6 py-[150px] font-sans">
      <h1 className="text-sm uppercase tracking-[0.25em] text-muted-foreground mb-10">
        Internet speed test
      </h1>

      <div className="relative w-full max-w-[360px] aspect-[1/1.2]">
        <svg viewBox="0 0 320 320" className="w-full h-full -rotate-0">
          <path
            d={trackPath}
            fill="none"
            stroke="var(--speed-track)"
            strokeWidth={14}
            strokeLinecap="round"
          />
          <path
            d={progressPath}
            fill="none"
            stroke="var(--speed-accent)"
            strokeWidth={14}
            strokeLinecap="round"
            
          />
          <circle
            cx={knob.x}
            cy={knob.y}
            r={10}
            fill="var(--background)"
            stroke="var(--speed-accent)"
            strokeWidth={3}
          />
          {TICKS.map((t) => {
            const a = toAngle(t === 0 ? 0.1 : t);
            const p = polar(a, R + 28);
            const px = Math.round(p.x * 100) / 100;
            const py = Math.round(p.y * 100) / 100;
            return (
              <text
                key={t}
                x={px}
                y={py}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground"
                fontSize={13}
              >
                {t === 100 ? "100+" : t}
              </text>
            );
          })}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-6xl font-light tabular-nums tracking-tight">
            {speed.toFixed(0.1)}
          </div>
          <div className="mt-1 text-xs text-muted-foreground tracking-wide">
            Megabits per second
          </div>
          <Icon className="mt-6 h-5 w-5 text-muted-foreground" />
          <div className="mt-2 text-sm text-muted-foreground">{status}</div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-10 text-center min-w-[260px]">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Mbps download
          </div>
          <div className="mt-2 text-2xl font-light tabular-nums">
            {download !== null ? download.toFixed(1) : "—"}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Mbps upload
          </div>
          <div className="mt-2 text-2xl font-light tabular-nums">
            {upload !== null ? upload.toFixed(1) : "—"}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <button
          onClick={start}
          disabled={phase === "download" || phase === "upload"}
          className="px-8 py-2.5 rounded-full border border-[var(--speed-accent)] text-[var(--speed-accent)] text-sm tracking-wide hover:bg-[var(--speed-accent)] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {phase === "idle" || phase === "done" ? "Start test" : "Testing…"}
        </button>
      </div>
    </main>
  );
}
