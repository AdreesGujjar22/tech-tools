"use client";

import React, { useRef, useState, useEffect } from "react";
import ToolShell from "./ToolShell";
import { 
  Sliders, 
  Paintbrush, 
  Type, 
  Check, 
  Sparkles, 
  Undo2, 
  X, 
  RefreshCw,
  Sun,
  Eye,
  Trash2
} from "lucide-react";

export default function ImageEditor() {
  const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp", ".svg"];

  const renderConfig = (files: any[], config: any, setConfig: any) => {
    const [imgUrl, setImgUrl] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);

    // Filter controls
    const [filters, setFilters] = useState({
      brightness: 100,
      contrast: 100,
      grayscale: 0,
      sepia: 0,
      invert: 0,
      blur: 0
    });

    // Drawing parameters
    const [brushColor, setBrushColor] = useState("#2dd4bf"); // teal-400
    const [brushSize, setBrushSize] = useState(6);
    const [isDrawing, setIsDrawing] = useState(false);
    
    // Text layers
    const [textInput, setTextInput] = useState("");
    const [textColor, setTextColor] = useState("#ffffff");
    const [texts, setTexts] = useState<{ id: number; text: string; x: number; y: number; color: string; size: number }[]>([]);
    
    // Editor modes
    const [editorMode, setEditorMode] = useState<"filters" | "draw" | "text">("filters");

    // Track path lines
    const paths = useRef<{ x: number; y: number; color: string; size: number; isStart: boolean }[]>([]);

    useEffect(() => {
      if (files.length > 0) {
        const url = URL.createObjectURL(files[0]);
        setImgUrl(url);

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          setOriginalImage(img);
          resetEditor();
        };
        img.src = url;

        return () => {
          URL.revokeObjectURL(url);
        };
      }
    }, [files]);

    const resetEditor = () => {
      setFilters({
        brightness: 100,
        contrast: 105,
        grayscale: 0,
        sepia: 0,
        invert: 0,
        blur: 0
      });
      paths.current = [];
      setTexts([]);
      setTextInput("");
    };

    // Redraw Canvas loop whenever parameters change
    useEffect(() => {
      if (!originalImage || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Fit canvas size to image aspect ratio nicely
      canvas.width = originalImage.width;
      canvas.height = originalImage.height;

      // Apply Filter Matrix using Canvas filter directive (supported natively)
      ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) grayscale(${filters.grayscale}%) sepia(${filters.sepia}%) invert(${filters.invert}%) blur(${filters.blur}px)`;

      // Draw original image
      ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);

      // Reset filter for annotations so drawing and text are NOT blurred
      ctx.filter = "none";

      // Draw Sketch Paths
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      paths.current.forEach((pt, i) => {
        if (pt.isStart) {
          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y);
        } else {
          ctx.strokeStyle = pt.color;
          ctx.lineWidth = pt.size;
          ctx.lineTo(pt.x, pt.y);
          ctx.stroke();
        }
      });

      // Draw Text Overlays
      texts.forEach((txt) => {
        const calculatedFontSize = Math.round(canvas.width * (txt.size / 100));
        ctx.font = `bold ${calculatedFontSize}px Inter, sans-serif`;
        ctx.fillStyle = txt.color;
        
        // Shadow depth
        ctx.shadowColor = "rgba(0, 0, 0, 0.75)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        ctx.fillText(txt.text, txt.x, txt.y);

        // Reset shadows
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      });

      // Sync final outputs onto Shell component config state
      syncToConfig();
    }, [originalImage, filters, texts, editorMode]);

    const syncToConfig = () => {
      if (!canvasRef.current) return;
      setConfig((prev: any) => ({
        ...prev,
        editedCanvas: canvasRef.current
      }));
    };

    // Handle interactive Drawing Sketch operations
    const handleDrawingMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (editorMode !== "draw" || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Absolute coordinates (mapping client positioning back to native pixel canvas width/height)
      const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
      const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

      const scaleFactor = canvas.width / rect.width;
      const adjustedBrushSize = brushSize * scaleFactor;

      if (e.type === "mousedown") {
        setIsDrawing(true);
        paths.current.push({ x, y, color: brushColor, size: adjustedBrushSize, isStart: true });
      } else if (e.type === "mousemove" && isDrawing) {
        paths.current.push({ x, y, color: brushColor, size: adjustedBrushSize, isStart: false });
        // Force manual quick re-render trigger
        setFilters((prev) => ({ ...prev }));
      } else if (e.type === "mouseup" || e.type === "mouseleave") {
        setIsDrawing(false);
      }
    };

    // Add Text Overlays
    const handleAddText = () => {
      if (!textInput.trim() || !canvasRef.current) return;
      const canvas = canvasRef.current;
      setTexts((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: textInput,
          x: canvas.width / 2,
          y: canvas.height / 2,
          color: textColor,
          size: 6 // 6% of canvas size
        }
      ]);
      setTextInput("");
    };

    const clearTexts = () => {
      setTexts([]);
    };

    const undoDrawingPaths = () => {
      if (paths.current.length === 0) return;
      // Undo last path (from isStart to end)
      let lastStartIdx = -1;
      for (let i = paths.current.length - 1; i >= 0; i--) {
        if (paths.current[i].isStart) {
          lastStartIdx = i;
          break;
        }
      }
      if (lastStartIdx !== -1) {
        paths.current = paths.current.slice(0, lastStartIdx);
        setFilters((prev) => ({ ...prev })); // trigger redraw
      }
    };

    return (
      <div className="space-y-6">
        {/* Editor Modes Tab Rail */}
        <div className="grid grid-cols-3 gap-1 bg-neutral-900 border border-neutral-850 p-1 rounded-xl">
          {[
            { id: "filters", label: "Filters", icon: Sliders },
            { id: "draw", label: "Scribble", icon: Paintbrush },
            { id: "text", label: "Branding", icon: Type }
          ].map((tab) => {
            const active = editorMode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setEditorMode(tab.id as any)}
                className={`py-2 text-3xs font-mono uppercase tracking-wider rounded-lg flex flex-col items-center justify-center gap-1 transition ${
                  active
                    ? "bg-teal-950/40 text-teal-400 border border-teal-850/"
                    : "text-neutral-500 hover:text-white"
                }`}
              >
                <tab.icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Controls depending on mode selected */}
        {editorMode === "filters" && (
          <div className="space-y-3 font-mono text-2xs text-neutral-400">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span>Brightness ({filters.brightness}%)</span>
                <Sun className="w-3.5 h-3.5 text-neutral-600" />
              </div>
              <input
                type="range"
                min="20"
                max="250"
                value={filters.brightness}
                onChange={(e) => setFilters({ ...filters, brightness: parseInt(e.target.value) })}
                className="w-full accent-teal-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span>Contrast ({filters.contrast}%)</span>
              </div>
              <input
                type="range"
                min="20"
                max="250"
                value={filters.contrast}
                onChange={(e) => setFilters({ ...filters, contrast: parseInt(e.target.value) })}
                className="w-full accent-teal-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="flex items-center gap-1.5 cursor-pointer text-neutral-400">
                  <input
                    type="checkbox"
                    checked={filters.grayscale === 100}
                    onChange={(e) => setFilters({ ...filters, grayscale: e.target.checked ? 100 : 0 })}
                    className="accent-teal-500 rounded"
                  />
                  Monochrome
                </label>
              </div>
              <div>
                <label className="flex items-center gap-1.5 cursor-pointer text-neutral-400">
                  <input
                    type="checkbox"
                    checked={filters.sepia === 100}
                    onChange={(e) => setFilters({ ...filters, sepia: e.target.checked ? 100 : 0 })}
                    className="accent-teal-500 rounded"
                  />
                  Sepia Tone
                </label>
              </div>
              <div>
                <label className="flex items-center gap-1.5 cursor-pointer text-neutral-400">
                  <input
                    type="checkbox"
                    checked={filters.invert === 100}
                    onChange={(e) => setFilters({ ...filters, invert: e.target.checked ? 100 : 0 })}
                    className="accent-teal-500 rounded"
                  />
                  Invert Pixels
                </label>
              </div>
            </div>
          </div>
        )}

        {editorMode === "draw" && (
          <div className="space-y-4 font-mono text-2xs text-neutral-400 text-left">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-neutral-500 block mb-1">BRUSH SIZE ({brushSize}px)</label>
                <input
                  type="range"
                  min="2"
                  max="40"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-full accent-teal-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-500 block mb-1">BRUSH COLOR</label>
                <input
                  type="color"
                  value={brushColor}
                  onChange={(e) => setBrushColor(e.target.value)}
                  className="w-full h-8 bg-neutral-900 border border-neutral-850 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={undoDrawingPaths}
                className="w-full py-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-850 rounded-lg flex items-center justify-center gap-1 text-[10px] transition"
              >
                <Undo2 className="w-3.5 h-3.5" /> Undo Draw
              </button>
              <button
                onClick={() => { paths.current = []; setFilters({ ...filters }); }}
                className="w-full py-1 bg-neutral-950 hover:bg-neutral-900 text-red-400 border border-neutral-850 rounded-lg flex items-center justify-center gap-1 text-[10px] transition"
              >
                Clear Scribble
              </button>
            </div>
          </div>
        )}

        {editorMode === "text" && (
          <div className="space-y-4 text-left font-mono text-2xs">
            <div className="space-y-2">
              <label className="text-neutral-500 block">LABEL TEXT</label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type anything..."
                  className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-850 focus:border-teal-500 focus:outline-none rounded-xl text-xs text-white"
                />
                <button
                  onClick={handleAddText}
                  className="py-1.5 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shrink-0"
                >
                  Stamp
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[10px] text-neutral-500 block mb-1">COLOR</label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full h-[32px] bg-neutral-900 border border-neutral-850 rounded-xl cursor-pointer p-0.5"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={clearTexts}
                  className="w-full py-2 bg-neutral-950 text-red-400 border border-neutral-850 rounded-xl flex items-center justify-center gap-1.5 hover:bg-neutral-900 transition font-bold"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Wipe Stamped Texts
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Visual Workspace Container */}
        {imgUrl && (
          <div className="space-y-2 text-left">
            <span className="text-[10px] font-bold text-neutral-400 block font-mono uppercase flex items-center gap-1">
              Interactive Design Board {editorMode === "draw" && "(Click & drag on image to scribble)"}
            </span>
            <div 
              ref={containerRef}
              className="relative border border-neutral-900 bg-neutral-950 rounded-2xl overflow-hidden select-none max-h-[300px] flex items-center justify-center p-3"
            >
              <div className="relative inline-block overflow-hidden max-h-[260px]">
                {/* Real-time paint dynamic Canvas */}
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleDrawingMove}
                  onMouseMove={handleDrawingMove}
                  onMouseUp={handleDrawingMove}
                  onMouseLeave={handleDrawingMove}
                  className={`max-h-[260px] w-auto border border-neutral-900 shadow-xl rounded-lg ${
                    editorMode === "draw" ? "cursor-pencil animate-pulse border-teal-500" : "cursor-default"
                  }`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Config Summary metrics list */}
        <div className="flex gap-2">
          <button
            onClick={resetEditor}
            className="w-full py-2 bg-neutral-950 border border-neutral-850 hover:bg-neutral-900 text-neutral-400 rounded-xl text-3xs font-mono uppercase transition flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3 h-3" /> Reset Board
          </button>
        </div>
      </div>
    );
  };

  const onProcessFile = async (
    file: File,
    config: any,
    index: number,
    updateProgress: (percentage: number, msg?: string) => void
  ) => {
    updateProgress(35, `Packaging active custom canvases layers...`);
    
    // Read the fully updated edited canvas
    const editedCanvas = config.editedCanvas as HTMLCanvasElement;
    if (!editedCanvas) {
      throw new Error("No operations were recorded on the design canvas board. Please scribble or adjust filters first.");
    }

    updateProgress(75, `Encoding high-fidelity PNG raster matrix...`);

    // Output is PNG to preserve annotations cleanly
    const finalBlob = await new Promise<Blob>((resolve, reject) => {
      editedCanvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to save edited design layout."));
        }
      }, "image/png");
    });

    let outName = file.name;
    const splitDot = outName.lastIndexOf(".");
    const baseName = splitDot !== -1 ? outName.substring(0, splitDot) : outName;

    return {
      blob: finalBlob,
      fileName: `${baseName}_edited.png`
    };
  };

  return (
    <ToolShell
      toolId="image-editor"
      allowedExtensions={allowedExtensions}
      allowMultiple={false}
      configTitle="Creative Canvas Tools"
      renderConfig={renderConfig}
      defaultConfig={{
        editedCanvas: null
      }}
      onProcessFile={onProcessFile}
    />
  );
}
