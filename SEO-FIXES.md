# SEO fixes applied

1. **Soft 404s removed** — `app/[...notfound]/page.tsx` returned HTTP 200 with a "404" page for every unknown URL. Deleted, so Next serves `app/not-found.tsx` with a real 404. Unknown blog slugs now `notFound()` too.
2. **Sitemap was never served** — `public/sitemap.xml` (static, 963 URLs, no blog posts) shadowed `app/sitemap.ts`. Static file deleted; `app/sitemap.ts` now generates all locales + published blog posts, with `lastModified` and hreflang alternates.
3. **robots.txt** — removed `Disallow: /_next/` (it blocked the CSS/JS Google needs to render pages), added `host`.
4. **Duplicate URLs** — `/hash-text` and `/en/hash-text` both served 200. Un-prefixed URLs now 308-redirect to the canonical locale URL. Set `NEXT_PUBLIC_CANONICAL_REDIRECT="false"` to disable.
5. **Duplicate titles/descriptions on 100+ tool pages** — `buildToolMetadata` read the wrong key (translations are nested under `Tools`), so every tool page used the identical site title, description and keywords. Fixed, with per-tool keywords and longer descriptions.
6. **Blog had no indexable content** — posts were fetched client-side only, and all posts shared one title/description. Posts are now fetched server-side (Firestore REST), giving each post its own title, description, keywords, canonical, OG/Twitter tags, `BlogPosting` JSON-LD, and server-rendered article HTML.
7. **Robots meta directives** — `maxSnippet`/`maxImagePreview` were silently ignored (wrong key names); now `max-snippet`, `max-image-preview`, `max-video-preview`.
8. **Share image** — OG image was 1151x351; added `public/images/og-default.png` at 1200x630 and pointed all OG/Twitter tags at it.
9. **Structured data** — added Organization, WebSite SearchAction and per-page BreadcrumbList JSON-LD (path passed through middleware as `x-pathname`).

## After pushing
- Run `npm run build` once locally to confirm.
- In Search Console: resubmit `https://www.ilovetechtools.com/sitemap.xml` and use "Inspect URL → Request indexing" on a few key pages.
