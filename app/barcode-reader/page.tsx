"use client";

import dynamic from "next/dynamic";

const BarcodeReader = dynamic(() => import("@/pages/BarcodeReader"), { ssr: false });

export default function Page() {
  return <BarcodeReader />;
}
