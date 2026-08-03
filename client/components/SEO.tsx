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
  imageUrl?: string;
}

export default function SEO({
  title,
  description,
  keywords,
  categoryName,
  toolName,
  isDashboard = false,
  isHome = false,
  imageUrl = "/images/web-logo.png",
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

    // 4. Update Canonical Link - STRICT CANONICAL TO CURRENT LOCALE
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl);

    // 5. Update Hreflang Alternates - EACH LOCALE TO ITS OWN URL
    supportedLocales.forEach((loc) => {
      let hreflangLink = document.querySelector(`link[rel="alternate"][hreflang="${loc}"]`);
      if (!hreflangLink) {
        hreflangLink = document.createElement("link");
        hreflangLink.setAttribute("rel", "alternate");
        hreflangLink.setAttribute("hreflang", loc);
        document.head.appendChild(hreflangLink);
      }
      const hreflangUrl = `${BASE_URL}/${loc}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`;
      hreflangLink.setAttribute("href", hreflangUrl);
    });

    // 6. x-default hreflang pointing to English
    let xDefault = document.querySelector('link[rel="alternate"][hreflang="x-default"]');
    if (!xDefault) {
      xDefault = document.createElement("link");
      xDefault.setAttribute("rel", "alternate");
      xDefault.setAttribute("hreflang", "x-default");
      document.head.appendChild(xDefault);
    }
    xDefault.setAttribute("href", `${BASE_URL}/en${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`);

    // 7. OpenGraph Meta Tags
    const ogTags = [
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: canonicalUrl },
      { property: "og:type", content: "website" },
      { property: "og:image", content: imageUrl.startsWith("http") ? imageUrl : `${BASE_URL}${imageUrl}` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:locale", content: locale.replace("-", "_") },
    ];

    ogTags.forEach(({ property, content }) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    });

    // 8. Twitter Card Meta Tags
    const twitterTags = [
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: imageUrl.startsWith("http") ? imageUrl : `${BASE_URL}${imageUrl}` },
    ];

    twitterTags.forEach(({ name, content }) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    });
  }, [title, description, keywords, canonicalUrl, pathWithoutLocale, imageUrl, locale]);

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
        suppressHydrationWarning
      />
      {appSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
          suppressHydrationWarning
        />
      )}
      {websiteSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
          suppressHydrationWarning
        />
      )}
    </>
  );
}
