import { ReactNode } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";

interface ToolLayoutWrapperProps {
  children: ReactNode;
}

export default function ToolLayoutWrapper({
  children,
}: ToolLayoutWrapperProps) {
  return (
    <>
      <Breadcrumbs />
      <div className="min-h-screen flex flex-col">
        {children}
      </div>
    </>
  );
}
