"use client";

import dynamic from "next/dynamic";

const TypingSpeed = dynamic(() => import("@/components/typing-speed/TypingSpeed"), { ssr: false });

export default function Page() {
  return <TypingSpeed />;
}
