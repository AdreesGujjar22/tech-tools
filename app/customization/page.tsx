"use client";

import dynamic from "next/dynamic";

const Customization = dynamic(() => import("@/pages/Customization"), { ssr: false });

export default function Page() {
  return <Customization />;
}
