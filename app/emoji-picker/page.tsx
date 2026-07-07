"use client";

import dynamic from "next/dynamic";

const Picker = dynamic(() => import("@/pages/EmojiPicker"), { ssr: false });

export default function Page() {
  return <Picker />;
}
