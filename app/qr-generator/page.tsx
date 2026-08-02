"use client";

import dynamic from "next/dynamic";
import ToolLoadingFallback from "@/components/ToolLoadingFallback";

const Generator = dynamic(() => import("@/pages/Generator"), {
  loading: () => <ToolLoadingFallback />,
  ssr: false,
});

export default function Page() {
  return <Generator />;
}
