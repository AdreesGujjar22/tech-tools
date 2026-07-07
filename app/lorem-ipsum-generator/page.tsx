"use client";

import dynamic from "next/dynamic";

const Generator = dynamic(() => import("@/pages/LoremIpsumGenerator"), { ssr: false });

export default function Page() {
  return <Generator />;
}
