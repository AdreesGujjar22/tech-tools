"use client";

import dynamic from "next/dynamic";

const Help = dynamic(() => import("@/pages/Help"), { ssr: false });

export default function Page() {
  return <Help />;
}
