import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "@/global.css";
import Providers from "@/components/Providers";
import { messages } from "../messages";
import { getLocalizedAlternates, getRequestLocale } from "@/lib/server-locale";

const BASE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://www.ilovetechtools.com").replace(/\/$/, "");

const openGraphLocales = {
  de: "de_DE",
  en: "en_US",
  es: "es_ES",
  fr: "fr_FR",
  id: "id_ID",
  it: "it_IT",
  nl: "nl_NL",
  pt: "pt_BR",
  tr: "tr_TR",
} as const;

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const siteMetadata = messages[locale].Metadata.site;

  return {
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

  alternates: await getLocalizedAlternates("/"),

  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    siteName: "Tech Tools",
    locale: openGraphLocales[locale],
    alternateLocale: Object.values(openGraphLocales).filter((value) => value !== openGraphLocales[locale]),
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
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getRequestLocale();
  const siteMetadata = messages[locale].Metadata.site;
  const localizedUrl = `${BASE_URL}/${locale}`;
  const siteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteMetadata.title,
    description: siteMetadata.description,
    url: localizedUrl,
    inLanguage: locale,
    publisher: {
      "@type": "Organization",
      name: "Tech Tools",
      url: BASE_URL,
      logo: `${BASE_URL}/images/web-logo.png`,
    },
  };

  return (
    <html lang={locale} suppressHydrationWarning className={`${jakarta.variable} bg-background`}>
      <head>
        <link rel="icon" type="image/png" href="/images/fav-icon.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }} />
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
