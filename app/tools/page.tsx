"use client";

import dynamic from "next/dynamic";

const Tools = dynamic(() => import("@/pages/History"), { ssr: false });

export default function Page() {
  return <Tools />;
}
