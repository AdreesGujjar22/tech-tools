import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/camera-recorder", "CameraRecorder");
}

export default function CameraRecorderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
