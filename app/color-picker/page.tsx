"use client";

import dynamic from "next/dynamic";

const MainColorPicker = dynamic(() => import("@/components/color-picker/MainColorPicker"), { ssr: false });

export default function Page() {
  return <MainColorPicker />;
}
