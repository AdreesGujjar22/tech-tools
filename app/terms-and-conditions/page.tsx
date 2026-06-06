"use client";

import dynamic from "next/dynamic";

const Terms = dynamic(() => import("@/pages/Terms"), { ssr: false });

export default function Page() {
  return <Terms />;
}
