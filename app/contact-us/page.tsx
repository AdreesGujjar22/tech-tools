"use client";

import dynamic from "next/dynamic";

const Contact = dynamic(() => import("@/pages/Contact"), { ssr: false });

export default function Page() {
  return <Contact />;
}
