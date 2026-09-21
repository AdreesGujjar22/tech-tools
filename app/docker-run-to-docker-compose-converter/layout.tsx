import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/docker-run-to-docker-compose-converter", "DockerRunToDockerComposeConverter");
}

export default function DockerRunToDockerComposeConverterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
