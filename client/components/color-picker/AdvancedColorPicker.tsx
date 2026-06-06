import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Copy, Check, Share2 } from "lucide-react";
import { hsvToRgb, rgbToHex, getAllColorFormats, ColorFormats } from "../../utils/color-picker/colorConversions";
import { toast } from "sonner";

export function AdvancedColorPicker() {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [value, setValue] = useState(100);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const gradientRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const isDraggingGradient = useRef(false);
  const isDraggingHue = useRef(false);

  const rgb = hsvToRgb(hue, saturation, value);
  const currentColor = rgbToHex(rgb.r, rgb.g, rgb.b);
  const formats = getAllColorFormats(currentColor);

  const handleGradientMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingGradient.current = true;
    updateGradientPosition(e);
  };

  const handleGradientMouseMove = (e: MouseEvent) => {
    if (isDraggingGradient.current) {
      updateGradientPosition(e as any);
    }
  };

  const handleGradientMouseUp = () => {
    isDraggingGradient.current = false;
  };

  const updateGradientPosition = (e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    if (!gradientRef.current) return;

    const rect = gradientRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

    const newSaturation = (x / rect.width) * 100;
    const newValue = 100 - (y / rect.height) * 100;

    setSaturation(newSaturation);
    setValue(newValue);
  };

  const handleHueMouseDown = () => {
    isDraggingHue.current = true;
  };

  const handleHueMouseMove = (e: MouseEvent) => {
    if (isDraggingHue.current) {
      updateHuePosition(e);
    }
  };

  const handleHueMouseUp = () => {
    isDraggingHue.current = false;
  };

  const updateHuePosition = (e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    if (!hueRef.current) return;

    const rect = hueRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const newHue = (x / rect.width) * 360;

    setHue(newHue);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleGradientMouseMove);
    document.addEventListener("mouseup", handleGradientMouseUp);
    document.addEventListener("mousemove", handleHueMouseMove);
    document.addEventListener("mouseup", handleHueMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleGradientMouseMove);
      document.removeEventListener("mouseup", handleGradientMouseUp);
      document.removeEventListener("mousemove", handleHueMouseMove);
      document.removeEventListener("mouseup", handleHueMouseUp);
    };
  }, []);

  const copyToClipboard = async (text: string, format: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    toast.success(`${format} copied!`);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const formatDisplays = [
    {
      label: "HEX",
      value: formats.hex.toUpperCase(),
      copyValue: formats.hex.toUpperCase(),
    },
    {
      label: "RGB",
      value: `${formats.rgb.r}, ${formats.rgb.g}, ${formats.rgb.b}`,
      copyValue: `rgb(${formats.rgb.r}, ${formats.rgb.g}, ${formats.rgb.b})`,
    },
    {
      label: "CMYK",
      value: `${formats.cmyk.c}%, ${formats.cmyk.m}%, ${formats.cmyk.y}%, ${formats.cmyk.k}%`,
      copyValue: `cmyk(${formats.cmyk.c}%, ${formats.cmyk.m}%, ${formats.cmyk.y}%, ${formats.cmyk.k}%)`,
    },
    {
      label: "HSV",
      value: `${formats.hsv.h}°, ${formats.hsv.s}%, ${formats.hsv.v}%`,
      copyValue: `hsv(${formats.hsv.h}, ${formats.hsv.s}%, ${formats.hsv.v}%)`,
    },
    {
      label: "HSL",
      value: `${formats.hsl.h}°, ${formats.hsl.s}%, ${formats.hsl.l}%`,
      copyValue: `hsl(${formats.hsl.h}, ${formats.hsl.s}%, ${formats.hsl.l}%)`,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card-dark rounded-2xl p-6 border border-[rgba(195,192,255,0.10)]"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-[#DAE2FD]">Color Picker</h2>
        <button className="p-2 hover:bg-[rgba(23,31,51,0.60)] rounded-lg transition-colors">
          <Share2 size={20} className="text-[#C7C4D8]" />
        </button>
      </div>

      <div
        ref={gradientRef}
        className="relative w-full h-80 rounded-xl cursor-crosshair mb-6 overflow-hidden border border-[rgba(195,192,255,0.10)]"
        style={{
          background: `linear-gradient(to bottom, transparent, #000), linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))`,
        }}
        onMouseDown={handleGradientMouseDown}
      >
        <div
          className="absolute w-6 h-6 border-4 border-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            left: `${saturation}%`,
            top: `${100 - value}%`,
            boxShadow: "0 0 0 1px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.3)",
          }}
        />
      </div>

      <div
        ref={hueRef}
        className="hue-slider relative w-full h-12 rounded-lg cursor-pointer mb-6 border border-[rgba(195,192,255,0.10)]"
        style={{
          background: "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
        }}
        onMouseDown={(e) => {
          handleHueMouseDown();
          updateHuePosition(e);
        }}
      >
        <div
          className="absolute w-6 h-14 bg-white border-2 border-[#131B2E] rounded-lg shadow-lg transform -translate-x-1/2 -translate-y-1 pointer-events-none"
          style={{ left: `${(hue / 360) * 100}%` }}
        />
      </div>

      <div className="space-y-3">
        <div className="bg-[#1D263B] border border-[rgba(195,192,255,0.05)] rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-lg shadow-lg border border-[rgba(195,192,255,0.20)]"
              style={{ backgroundColor: currentColor }}
            />
            <div>
              <div className="text-[#C7C4D8] text-sm mb-1 font-semibold">HEX</div>
              <div className="text-[#DAE2FD] text-xl font-mono font-semibold">{formats.hex.toUpperCase()}</div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => copyToClipboard(formats.hex.toUpperCase(), "HEX")}
            className="p-3 bg-[#31394D] hover:bg-[#3d4561] text-[#DAE2FD] rounded-lg transition-colors cursor-pointer"
          >
            {copiedFormat === "HEX" ? (
              <Check size={20} className="text-green-400" />
            ) : (
              <Copy size={20} className="text-[#C3C0FF]" />
            )}
          </motion.button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {formatDisplays.slice(1).map((format) => (
            <div key={format.label} className="bg-[#1D263B] border border-[rgba(195,192,255,0.05)] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[#C7C4D8] text-sm font-semibold">{format.label}</div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => copyToClipboard(format.copyValue, format.label)}
                  className="p-1.5 hover:bg-[#31394D] rounded transition-colors cursor-pointer"
                >
                  {copiedFormat === format.label ? (
                    <Check size={16} className="text-green-400" />
                  ) : (
                    <Copy size={16} className="text-[#C7C4D8]" />
                  )}
                </motion.button>
              </div>
              <div className="text-[#DAE2FD] text-sm font-mono">{format.value}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
