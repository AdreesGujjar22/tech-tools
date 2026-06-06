import React from "react";
import type { Metadata } from "next";
import "@/global.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://techtools.com"),
  
  title: {
    default: "Tech Tools - Free Online PDF, Image & AI Tools",
    template: "%s | Tech Tools",
  },
  
  description: "Tech Tools provides free online PDF tools, image editing tools, AI-powered utilities, file converters, compressors, generators, and productivity solutions. Fast, secure, and easy to use.",
  
  keywords: [
    "pdf tools",
    "image tools",
    "ai tools",
    "merge pdf",
    "split pdf",
    "compress pdf",
    "compress image",
    "image converter",
    "pdf converter",
    "jpg to png",
    "png to jpg",
    "pdf to word",
    "word to pdf",
    "online tools",
    "free tools",
    "tech tools",
    "file converter",
    "document tools",
    "image optimizer",
    "seo tools",
    "developer tools",
    "productivity tools",
    "free online utilities"
  ],
  
  icons: {
    icon: "/images/fav-icon.png",
    apple: "/images/fav-icon.png",
  },
  
  openGraph: {
    title: "Tech Tools - Free Online PDF, Image & AI Tools",
    description: "Tech Tools provides free online PDF tools, image editing tools, AI-powered utilities, file converters, compressors, generators, and productivity solutions.",
    siteName: "Tech Tools",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/web-logo.png",
        width: 1200,
        height: 630,
        alt: "Tech Tools Logo",
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Tech Tools - Free Online PDF, Image & AI Tools",
    description: "Free online PDF, image, and AI tools for everyone. Convert, compress, edit, and generate files instantly.",
    images: ["/images/web-logo.png"],
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
