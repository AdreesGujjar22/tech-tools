"use client";

import { useEffect } from "react";
import { useLocation, stripLocalePrefix } from "@/lib/router-compat";

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://www.ilovetechtools.com"
).replace(/\/$/, "");

const supportedLocales = ["de", "en", "es", "fr", "id", "it", "nl", "pt", "tr"] as const;

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  categoryName?: string;
  toolName?: string;
  isDashboard?: boolean;
  isHome?: boolean;
}

export default function SEO({
  title,
  description,
  keywords,
  categoryName,
  toolName,
  isDashboard = false,
  isHome = false,
}: SEOProps) {
  const location = useLocation();
  const rawPath = location.pathname;
  const pathWithoutLocale = stripLocalePrefix(rawPath);
  const locale = supportedLocales.find((l) => rawPath.startsWith(`/${l}`)) || "en";

  const canonicalUrl = `${BASE_URL}/${locale}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`;

  useEffect(() => {
    // 1. Update Document Title
    document.title = title.includes("ILoveTechTools") || title.includes("Tech Tools") ? title : `${title} | ILoveTechTools`;

    // 2. Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", description);

    // 3. Update Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.setAttribute("name", "keywords");
      document.head.appendChild(metaKeywords);
    }
    const keywordList =
      keywords || "tech tools, pdf tools, image tools, qr generator, typing speed test, internet speed test, color picker, developer utilities";
    metaKeywords.setAttribute("content", keywordList);

    // 4. Update Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl);

    // 5. Update Hreflang Alternates
    supportedLocales.forEach((loc) => {
      let hreflangLink = document.querySelector(`link[rel="alternate"][hreflang="${loc}"]`);
      if (!hreflangLink) {
        hreflangLink = document.createElement("link");
        hreflangLink.setAttribute("rel", "alternate");
        hreflangLink.setAttribute("hreflang", loc);
        document.head.appendChild(hreflangLink);
      }
      hreflangLink.setAttribute("href", `${BASE_URL}/${loc}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`);
    });

    // x-default hreflang
    let xDefault = document.querySelector('link[rel="alternate"][hreflang="x-default"]');
    if (!xDefault) {
      xDefault = document.createElement("link");
      xDefault.setAttribute("rel", "alternate");
      xDefault.setAttribute("hreflang", "x-default");
      document.head.appendChild(xDefault);
    }
    xDefault.setAttribute("href", `${BASE_URL}/en${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`);
  }, [title, description, keywords, canonicalUrl, pathWithoutLocale]);

  // JSON-LD Schemas
  const breadcrumbItems = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${BASE_URL}/${locale}`,
    },
  ];

  if (categoryName && !isHome) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 2,
      name: categoryName,
      item: `${BASE_URL}/${locale}${pathWithoutLocale}`,
    });
  }

  if (toolName && categoryName) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 3,
      name: toolName,
      item: `${BASE_URL}/${locale}${pathWithoutLocale}`,
    });
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  };

  const appSchema = !isHome ? {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: toolName || title,
    description: description,
    url: canonicalUrl,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  } : null;

  const websiteSchema = (isHome || isDashboard) ? {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ILoveTechTools",
    url: `${BASE_URL}/${locale}`,
    description: description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/${locale}/tools?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {appSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
        />
      )}
      {websiteSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      )}
    </>
  );
}
