import React from "react";
import type { Metadata } from "next";
import "@/global.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "TechTools - Smart Online Utilities",
  description: "Fast, free, and modern online tools for developers, creators, and everyday users.",
  icons: {
    icon: "/images/fav-icon.png",
    apple: "/images/fav-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/images/fav-icon.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storedTheme = localStorage.getItem('theme');
                  var systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
                  var theme = storedTheme || systemTheme || 'dark';
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add(theme);
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
