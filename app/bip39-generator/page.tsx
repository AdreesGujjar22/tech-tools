"use client";

import dynamic from "next/dynamic";
import ToolLoadingFallback from "@/components/ToolLoadingFallback";

const Bip39Generator = dynamic(() => import("@/pages/Bip39Generator"), {
  loading: () => <ToolLoadingFallback />,
  ssr: false,
});

export default function Page() {
  return <Bip39Generator />;
}
