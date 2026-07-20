import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ImageIcon, Pipette } from "lucide-react";
import { Toaster } from "sonner";
import { useTranslations } from "next-intl";
import { ImageColorExtractor } from "./ImageColorExtractor";
import { AdvancedColorPicker } from "./AdvancedColorPicker";

type Tab = "image" | "picker";

export default function MainColorPicker() {
  const t = useTranslations("Tools.ColorPicker");
  const [activeTab, setActiveTab] = useState<Tab>("image");

  const tabs = [
    { id: "image" as Tab, label: "Image", icon: ImageIcon },
    { id: "picker" as Tab, label: "Color Picker", icon: Pipette },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F7F0] via-white to-transparent text-[#2D4D35]">
      <main className="pt-32 pb-20 px-6 max-w-[1280px] mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl lg:text-6xl font-bold mb-2 text-[#1F3A26]">{t("title")}</h1>
          <p className="text-lg text-[#4A6857] font-medium">
            Extract beautiful color palettes from any image or fine-tune and copy individual colors with surgical precision.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="inline-flex gap-2 p-1.5 bg-white backdrop-blur-[20px] border border-[#C5DCC9] rounded-xl shadow-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-[#10A968] text-white shadow-md"
                      : "text-[#4A6857] hover:text-[#2D4D35] hover:bg-[#F0F7F0]"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === "image" && (
            <motion.div
              key="image"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ImageColorExtractor />
            </motion.div>
          )}

          {activeTab === "picker" && (
            <motion.div
              key="picker"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              <AdvancedColorPicker />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Toaster position="bottom-right" richColors theme="light" />
    </div>
  );
}
