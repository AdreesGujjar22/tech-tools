"use client";

import dynamic from "next/dynamic";

const Pricing = dynamic(() => import("@/pages/Pricing"), { ssr: false });

export default function Page() {
  return <Pricing />;
}
