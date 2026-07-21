import { motion } from "motion/react";
import { Copy, Lock, LockOpen, Check } from "lucide-react";
import { Color, getTextColor } from "../../utils/color-picker/colorUtils";
import { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface ColorCardProps {
  color: Color;
  index: number;
  onToggleLock: (id: string) => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
}

const ItemType = "COLOR_CARD";

export function ColorCard({ color, index, onToggleLock, onMove }: ColorCardProps) {
  const t = useTranslations("Tools.ColorPicker");
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const textColor = getTextColor(color.hex);

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        onMove(item.index, index);
        item.index = index;
      }
    },
  });

  const copyToClipboard = async (text: string, format: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    toast.success(t("copied", { format }));
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <motion.div
      ref={(node) => { drag(drop(node)); }}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: isDragging ? 0.5 : 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="relative group cursor-move rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
      style={{ backgroundColor: color.hex }}
    >
      <div className="aspect-[3/4] flex flex-col justify-between p-4 md:p-6">
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggleLock(color.id)}
            className="p-2 rounded-lg backdrop-blur-sm transition-colors"
            style={{
              backgroundColor: `${color.hex}33`,
              color: textColor,
            }}
          >
            {color.locked ? <Lock size={18} /> : <LockOpen size={18} />}
          </motion.button>
        </div>

        <div className="space-y-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => copyToClipboard(color.hex.toUpperCase(), "HEX")}
            className="w-full p-3 rounded-lg backdrop-blur-sm transition-all flex items-center justify-between group/btn"
            style={{
              backgroundColor: `${color.hex}44`,
              color: textColor,
            }}
          >
            <span className="font-mono text-sm md:text-base font-semibold">
              {color.hex.toUpperCase()}
            </span>
            {copiedFormat === "HEX" ? (
              <Check size={16} className="text-green-400" />
            ) : (
              <Copy size={16} className="opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              copyToClipboard(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`, "RGB")
            }
            className="w-full p-2.5 rounded-lg backdrop-blur-sm transition-all flex items-center justify-between group/btn"
            style={{
              backgroundColor: `${color.hex}33`,
              color: textColor,
            }}
          >
            <span className="font-mono text-xs md:text-sm">
              RGB({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
            </span>
            {copiedFormat === "RGB" ? (
              <Check size={14} className="text-green-400" />
            ) : (
              <Copy size={14} className="opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              copyToClipboard(`hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`, "HSL")
            }
            className="w-full p-2.5 rounded-lg backdrop-blur-sm transition-all flex items-center justify-between group/btn"
            style={{
              backgroundColor: `${color.hex}33`,
              color: textColor,
            }}
          >
            <span className="font-mono text-xs md:text-sm">
              HSL({color.hsl.h}, {color.hsl.s}%, {color.hsl.l}%)
            </span>
            {copiedFormat === "HSL" ? (
              <Check size={14} className="text-green-400" />
            ) : (
              <Copy size={14} className="opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
