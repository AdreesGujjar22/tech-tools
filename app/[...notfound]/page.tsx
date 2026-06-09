"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const NotFound = dynamic(() => import("@/pages/NotFound"), { ssr: false });

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <NotFound />
    </Suspense>
  );
}
