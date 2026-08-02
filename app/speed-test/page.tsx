"use client";

import dynamic from "next/dynamic";
import ToolLoadingFallback from "@/components/ToolLoadingFallback";

const SpeedTest = dynamic(() => import("@/components/speed-test/SpeedTest"), {
  loading: () => <ToolLoadingFallback />,
  ssr: false,
});

export default function Page() {
  return <SpeedTest />;
}
