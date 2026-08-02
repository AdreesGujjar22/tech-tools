"use client";

import dynamic from "next/dynamic";
import ToolLoadingFallback from "@/components/ToolLoadingFallback";

const TypingSpeed = dynamic(() => import("@/components/typing-speed/TypingSpeed"), {
  loading: () => <ToolLoadingFallback />,
  ssr: false,
});

export default function Page() {
  return <TypingSpeed />;
}
