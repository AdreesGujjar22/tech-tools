"use client";

import dynamic from "next/dynamic";

const SpeedTest = dynamic(
  () => import("@/components/speed-test/SpeedTest").then((m) => m.SpeedTest),
  { ssr: false }
);

export default function Page() {
  return <SpeedTest />;
}
