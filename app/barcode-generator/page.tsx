"use client";

import dynamic from "next/dynamic";

const Generator = dynamic(() => import("@/pages/BarcodeGenerator"), { ssr: false });

export default function Page() {
  return <Generator />;
}
