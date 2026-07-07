"use client";

import dynamic from "next/dynamic";

const NotePad = dynamic(() => import("@/pages/NotePad"), { ssr: false });

export default function Page() {
  return <NotePad />;
}
