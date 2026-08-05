"use client";

import React, { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import { ThemeProvider } from "@/lib/theme";
import { AuthProvider } from "@/lib/auth";
import { LocaleProvider } from "@/lib/locale";
import Breadcrumbs from "@/components/Breadcrumbs";

const AuthenticatedNavbar = dynamic(() => import("@/components/AuthenticatedNavbar"), {
  ssr: false,
  loading: () => null,
});

const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: false,
});

const Toaster = dynamic(() => import("sonner").then(({ Toaster: Sonner }) => Sonner), {
  ssr: false,
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  return (
    <LocaleProvider>
      <ThemeProvider>
        <AuthProvider>
          <Toaster position="bottom-right" richColors theme="light" />
          <div className="min-h-screen flex flex-col">
            <AuthenticatedNavbar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
            <div className={sidebarCollapsed ? "transition-[margin] duration-300 lg:ml-0" : "transition-[margin] duration-300 lg:ml-72"}>
              <Breadcrumbs />
              <main className="min-h-[calc(100vh-4rem)]">
                <Suspense fallback={<div className="h-[80vh] bg-background" />}>
                  {children}
                </Suspense>
              </main>
              <Footer />
            </div>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </LocaleProvider>
  );
}
