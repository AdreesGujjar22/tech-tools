"use client";

import dynamic from "next/dynamic";
import ToolLoadingFallback from "@/components/ToolLoadingFallback";

const Tool = dynamic(() => import("@/pages/PdfSignatureChecker"), {
  loading: () => <ToolLoadingFallback />,
  ssr: false,
});

export default function Page() {
  return <Tool />;
}
