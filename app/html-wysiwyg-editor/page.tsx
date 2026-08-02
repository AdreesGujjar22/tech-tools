"use client";

import dynamic from "next/dynamic";
import ToolLoadingFallback from "@/components/ToolLoadingFallback";

const HtmlWysiwygEditor = dynamic(() => import("@/pages/HtmlWysiwygEditor"), {
  loading: () => <ToolLoadingFallback />,
  ssr: false,
});

export default function Page() {
  return <HtmlWysiwygEditor />;
}
