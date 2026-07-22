import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "@/global.css";
import Providers from "@/components/Providers";
import { messages } from "../messages";
import { buildPageMetadata } from "@/lib/server-locale";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://www.ilovetechtools.com";

const siteMetadata = messages.en.Metadata.site;

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: siteMetadata.title,
    template: "%s | Tech Tools",
  },
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,

  icons: {
    icon: "/images/fav-icon.png",
    apple: "/images/fav-icon.png",
  },

  alternates: {
    canonical: `${BASE_URL}/en`,
    languages: {
      en: `${BASE_URL}/en`,
      es: `${BASE_URL}/es`,
      pt: `${BASE_URL}/pt`,
      "x-default": `${BASE_URL}/en`,
    },
  },

  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    siteName: "Tech Tools",
    locale: "en_US",
    alternateLocale: ["es_ES", "pt_BR"],
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
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: ["/images/web-logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${jakarta.variable} bg-background`}>
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
            `,
          }}
        />
      </head>
      <body className="bg-background text-foreground font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
