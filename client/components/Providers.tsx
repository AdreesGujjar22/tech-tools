"use client";

import React, { useState, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/lib/auth";
import { ThemeProvider } from "@/lib/theme";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
     <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Toaster position="bottom-right" richColors theme="light" />
          <div className="flex min-h-screen flex-col">
            <Navbar />

            <main className="flex-1 my-24">
              <Suspense
                fallback={
                  <div className="h-[80vh] bg-background" />
                }
              >
                {children}
              </Suspense>
            </main>

            <Footer />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
