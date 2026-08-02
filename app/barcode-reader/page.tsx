"use client";

import dynamic from "next/dynamic";
import ToolLoadingFallback from "@/components/ToolLoadingFallback";

const BarcodeReader = dynamic(() => import("@/pages/BarcodeReader"), {
  loading: () => <ToolLoadingFallback />,
  ssr: false,
});

export default function Page() {
  return <BarcodeReader />;
}
