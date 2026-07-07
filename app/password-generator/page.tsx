"use client";

import dynamic from "next/dynamic";

const Generator = dynamic(() => import("@/pages/PasswordGenerator"), { ssr: false });

export default function Page() {
  return <Generator />;
}
