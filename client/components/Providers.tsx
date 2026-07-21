"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { ThemeProvider } from "@/lib/theme";
import { AuthProvider } from "@/lib/auth";
import { LocaleProvider } from "@/lib/locale";

const AuthenticatedNavbar = dynamic(() => import("@/components/AuthenticatedNavbar"), {
  ssr: false,
  loading: () => <div className="h-20" aria-hidden="true" />,
});

const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: false,
});

const Toaster = dynamic(() => import("sonner").then(({ Toaster: Sonner }) => Sonner), {
  ssr: false,
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <ThemeProvider>
        <AuthProvider>
          <Toaster position="bottom-right" richColors theme="light" />
          <div className="flex min-h-screen flex-col">
          <AuthenticatedNavbar />

          <main className="flex-1 mt-24 min-h-[calc(100vh-6rem)]">
            <Suspense fallback={<div className="h-[80vh] bg-background" />}>
              {children}
            </Suspense>
          </main>

          <Footer />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </LocaleProvider>
  );
}
