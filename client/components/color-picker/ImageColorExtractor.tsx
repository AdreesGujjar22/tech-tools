import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, X, Copy, Check, Plus, Minus, Download, Image as ImageIcon } from "lucide-react";
import { getAllColorFormats, rgbToHex } from "../../utils/color-picker/colorConversions";
import { toast } from "sonner";

interface ExtractedColor {
  hex: string;
  count: number;
}

export function ImageColorExtractor() {
  const [image, setImage] = useState<string | null>(null);
  const [colors, setColors] = useState<ExtractedColor[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImage(event.target?.result as string);
        extractColors(img);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const extractColors = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    const colorMap = new Map<string, number>();

    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const a = pixels[i + 3];

      if (a < 128) continue;

      const roundedR = Math.round(r / 10) * 10;
      const roundedG = Math.round(g / 10) * 10;
      const roundedB = Math.round(b / 10) * 10;

      const hex = rgbToHex(roundedR, roundedG, roundedB);
      colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
    }

    const sortedColors = Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([hex, count]) => ({ hex, count }));

    setColors(sortedColors);
    if (sortedColors.length > 0) {
      setSelectedColor(sortedColors[0].hex);
    }
  };

  const removeImage = () => {
    setImage(null);
    setColors([]);
    setSelectedColor(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const copyToClipboard = async (text: string, format: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    toast.success(`${format} copied!`);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const formats = selectedColor ? getAllColorFormats(selectedColor) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card-dark rounded-2xl p-6 border border-[rgba(195,192,255,0.10)]"
    >
      <canvas ref={canvasRef} className="hidden" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-[#DAE2FD]">Image Color Extractor</h3>

          {!image ? (
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="relative border-2 border-dashed border-[rgba(195,192,255,0.20)] bg-[rgba(195,192,255,0.05)] rounded-xl p-8 text-center cursor-pointer hover:border-[#4F46E5] transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <ImageIcon size={48} className="mx-auto mb-4 text-[#C7C4D8]" />
              <p className="text-[#DAE2FD] font-semibold mb-2">
                Upload an image
              </p>
              <p className="text-sm text-[#C7C4D8]">
                Click to browse or drag and drop
              </p>
            </motion.div>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-[rgba(195,192,255,0.1)]">
              <img src={image} alt="Uploaded" className="w-full h-auto rounded-xl" />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={removeImage}
                className="absolute top-3 right-3 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg shadow-lg cursor-pointer"
              >
                <X size={20} />
              </motion.button>
            </div>
          )}

          {colors.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-[#C7C4D8] tracking-[1px] uppercase">
                  Color Palette
                </h4>
              </div>

              <div className="flex gap-3 flex-wrap">
                {colors.map((color) => (
                  <motion.button
                    key={color.hex}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedColor(color.hex)}
                    className={`w-14 h-14 rounded-lg shadow-md transition-all cursor-pointer ${
                      selectedColor === color.hex ? "ring-4 ring-[#4F46E5] ring-offset-2 ring-offset-[#0B1326]" : ""
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = image || "";
                    link.download = `extracted-palette-${Date.now()}.png`;
                    link.click();
                  }}
                  className="flex-1 px-4 py-3 bg-[#31394D] hover:bg-[#3d4561] rounded-lg text-sm font-medium text-[#DAD7FF] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download size={16} />
                  Download
                </button>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(colors.map(c => c.hex).join(", "));
                    toast.success("All colors copied to clipboard!");
                  }}
                  className="flex-1 px-4 py-3 bg-[#31394D] hover:bg-[#3d4561] rounded-lg text-sm font-medium text-[#DAD7FF] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Copy size={16} />
                  Copy all
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-[#DAE2FD]">Extracted Color Details</h3>

          {selectedColor && formats ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-4 p-4 bg-[#1D263B] border border-[rgba(195,192,255,0.05)] rounded-xl justify-center">
                <div
                  className="w-24 h-24 rounded-xl shadow-md border border-[rgba(195,192,255,0.1)]"
                  style={{ backgroundColor: selectedColor }}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-[#1D263B] border border-[rgba(195,192,255,0.05)] rounded-lg group">
                  <div>
                    <div className="text-xs text-[#C7C4D8] mb-1 font-semibold">HEX</div>
                    <div className="font-mono font-semibold text-[#DAE2FD] text-lg">
                      {formats.hex.toUpperCase()}
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => copyToClipboard(formats.hex.toUpperCase(), "HEX")}
                    className="p-2.5 bg-[#31394D] hover:bg-[#3d4561] text-[#DAE2FD] rounded-lg transition-all cursor-pointer"
                  >
                    {copiedFormat === "HEX" ? (
                      <Check size={16} className="text-green-400" />
                    ) : (
                      <Copy size={16} className="text-[#C7C4D8]" />
                    )}
                  </motion.button>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#1D263B] border border-[rgba(195,192,255,0.05)] rounded-lg group">
                  <div>
                    <div className="text-xs text-[#C7C4D8] mb-1 font-semibold">RGB</div>
                    <div className="font-mono text-sm text-[#DAE2FD] text-lg">
                      rgb({formats.rgb.r}, {formats.rgb.g}, {formats.rgb.b})
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => copyToClipboard(`rgb(${formats.rgb.r}, ${formats.rgb.g}, ${formats.rgb.b})`, "RGB")}
                    className="p-2.5 bg-[#31394D] hover:bg-[#3d4561] text-[#DAE2FD] rounded-lg transition-all cursor-pointer"
                  >
                    {copiedFormat === "RGB" ? (
                      <Check size={16} className="text-green-400" />
                    ) : (
                      <Copy size={16} className="text-[#C7C4D8]" />
                    )}
                  </motion.button>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#1D263B] border border-[rgba(195,192,255,0.05)] rounded-lg group">
                  <div>
                    <div className="text-xs text-[#C7C4D8] mb-1 font-semibold">HSL</div>
                    <div className="font-mono text-sm text-[#DAE2FD] text-lg">
                      hsl({formats.hsl.h}, {formats.hsl.s}%, {formats.hsl.l}%)
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => copyToClipboard(`hsl(${formats.hsl.h}, ${formats.hsl.s}%, ${formats.hsl.l}%)`, "HSL")}
                    className="p-2.5 bg-[#31394D] hover:bg-[#3d4561] text-[#DAE2FD] rounded-lg transition-all cursor-pointer"
                  >
                    {copiedFormat === "HSL" ? (
                      <Check size={16} className="text-green-400" />
                    ) : (
                      <Copy size={16} className="text-[#C7C4D8]" />
                    )}
                  </motion.button>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-3 bg-gradient-indigo-cyan text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <Upload size={18} />
                  Use another image
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="h-[250px] flex flex-col items-center justify-center text-[#C7C4D8] border border-dashed border-[rgba(195,192,255,0.20)] bg-[rgba(195,192,255,0.02)] rounded-xl p-6">
              <p className="font-medium text-center">Upload an image of your choice to automatically extract its color palettes</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
