import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ImageIcon, Pipette } from "lucide-react";
import { Toaster } from "sonner";
import { ImageColorExtractor } from "./ImageColorExtractor";
import { AdvancedColorPicker } from "./AdvancedColorPicker";

type Tab = "image" | "picker";

export default function MainColorPicker() {
  const [activeTab, setActiveTab] = useState<Tab>("image");

  const tabs = [
    { id: "image" as Tab, label: "Image", icon: ImageIcon },
    { id: "picker" as Tab, label: "Color Picker", icon: Pipette },
  ];

  return (
    <div className="min-h-screen bg-[#0B1326] text-[#DAE2FD]">
      <main className="pt-32 pb-20 px-6 max-w-[1280px] mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl lg:text-6xl font-bold mb-2">Color Picker</h1>
          <p className="text-lg text-[#C7C4D8]">
            Extract beautiful color palettes from any image or fine-tune and copy individual colors with surgical precision.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="inline-flex gap-2 p-1.5 bg-[rgba(23,31,51,0.40)] backdrop-blur-[20px] border border-[rgba(195,192,255,0.10)] rounded-xl shadow-lg">
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
                      ? "bg-[#4F46E5] text-[#DAD7FF] shadow-md"
                      : "text-[#C7C4D8] hover:text-[#DAE2FD] hover:bg-[rgba(23,31,51,0.60)]"
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

      <Toaster position="bottom-right" richColors theme="dark" />
    </div>
  );
}