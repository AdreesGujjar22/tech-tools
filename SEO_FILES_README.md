# SEO Configuration Files

This document explains the three SEO files that have been created for the Tech Tools platform.

## Files Overview

### 1. **robots.txt** (`app/robots.ts`)
Automatically generated at build time by Next.js.

**Purpose:** Tells search engines and crawlers which parts of your site they can access.

**What it does:**
- Allows general crawlers (`*`) to crawl the entire site except `/admin`, `/api`, and `/.well-known`
- Explicitly allows AI/LLM crawlers like GPTBot, CCBot, Claude-Web, and Anthropic-AI
- Points to the sitemap.xml for comprehensive indexing
- Sets crawl delay to 0 (no delay needed)

**To update:** Edit `app/robots.ts` and rebuild

---

### 2. **llms.txt** (`app/llms.txt`)
A static text file served at the root for LLM crawler access control.

**Purpose:** Defines permissions specifically for AI/LLM crawlers (ChatGPT, Claude, Bard, Perplexity, etc.).

**What it does:**
- Allows major AI crawlers to index your content
- Specifies crawl delay and request rate limits
- Provides information about the site
- Links to the sitemap.xml

**To update:** Edit `app/llms.txt` directly

**Available User-agents (already configured):**
- `GPTBot` - OpenAI's GPT crawler
- `ChatGPT-User` - ChatGPT users
- `CCBot` - Common Crawl
- `anthropic-ai` - Anthropic's Claude
- `Claude-Web` - Claude Web crawler
- `Googlebot-Extended` - Google's extended crawler
- `Bard` - Google's Bard
- `Perplexity` - Perplexity AI
- `AdsBot-Google` - Google Ads bot

**To add new AI crawlers:** Add a new section:
```
User-agent: YourNewCrawler
Allow: /
```

---

### 3. **sitemap.xml** (`app/sitemap.ts`)
Dynamically generated at build time from your routes and Firestore data.

**Purpose:** Provides a complete map of all URLs on your site for search engine indexing.

**What it includes automatically:**
- ✅ Static pages (home, about, contact, pricing, help, privacy, terms, etc.)
- ✅ All Image Tool routes (20+ tools from `IMAGE_TOOLS`)
- ✅ All PDF Tool routes (15+ tools from `PDF_TOOLS`)
- ✅ All published blog posts (fetched from Firestore with slug)
- ✅ Last modified timestamps for blog posts
- ✅ Priority levels for each URL type
- ✅ Change frequency hints

**Priority levels used:**
- `1.0` - Homepage
- `0.9` - Main hubs (blog, iloveimg, ilovepdf, about-us)
- `0.8` - Individual tools, pricing, blog posts, contact
- `0.7` - Help, privacy, terms

**How new content is added automatically:**

#### Adding a new tool:
1. Add the tool to `IMAGE_TOOLS` or `PDF_TOOLS` in `toolsData.ts`
2. Rebuild the project
3. The tool route is automatically included in sitemap.xml ✨

**Example:**
```typescript
// client/components/image-tools/toolsData.ts
export const IMAGE_TOOLS: ImageTool[] = [
  // ... existing tools
  {
    id: "new-tool",
    name: "New Tool",
    shortDesc: "Tool description",
    longDesc: "Longer description",
    category: "edit",
    iconName: "SomeIcon",
    route: "/iloveimg/new-tool"
  }
];
```

#### Adding a new blog post:
1. Create a blog post in Firestore with `published: true` and a `slug`
2. Rebuild the project
3. The blog post is automatically included in sitemap.xml ✨

**Example Firestore document structure:**
```javascript
{
  title: "My New Blog Post",
  slug: "my-new-blog-post",
  published: true,
  updatedAt: Timestamp.now(),
  // ... other fields
}
```

#### Adding a new static page:
1. Edit the `STATIC_ROUTES` array in `app/sitemap.ts`
2. Add your new route with priority and change frequency
3. Rebuild the project

**Example:**
```typescript
const STATIC_ROUTES = [
  // ... existing routes
  { url: "/my-new-page", priority: 0.8, changefreq: "monthly" as const },
];
```

---

## Build and Deployment

The sitemap is generated at **build time**, not runtime:

```bash
npm run build
```

This will generate:
- `/public/robots.txt` (from `app/robots.ts`)
- `/public/sitemap.xml` (from `app/sitemap.ts`)
- `/public/llms.txt` (from `app/llms.txt`)

### Environment Variables

Make sure you have `NEXT_PUBLIC_SITE_URL` set in your `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

If not set, it defaults to `https://techtools.example.com`

---

## Testing

### Check robots.txt
```
curl https://yourdomain.com/robots.txt
```

### Check llms.txt
```
curl https://yourdomain.com/llms.txt
```

### Check sitemap.xml
```
curl https://yourdomain.com/sitemap.xml
```

### Validate sitemap
Use Google Search Console or XML Sitemap validator:
- https://www.xml-sitemaps.com/validate-xml-sitemap.html

---

## Future-Proofing

The current setup is designed to automatically include:
- ✅ New tools added to `IMAGE_TOOLS` array
- ✅ New tools added to `PDF_TOOLS` array
- ✅ New blog posts with `published: true` in Firestore
- ✅ New static routes added to `STATIC_ROUTES`

**No manual sitemap editing needed** — just add content and rebuild! 🚀

---

## Firebase Permissions

Make sure your Firestore security rules allow reading blog posts:

```javascript
match /blog_posts/{document=**} {
  allow read: if true;
  allow write: if request.auth.uid != null && isAdmin();
}
```

If the sitemap can't fetch blog posts, they'll be silently skipped and only static routes will be included.

---

## Search Engine Submission

After deployment, submit your sitemap to:

1. **Google Search Console**
   - https://search.google.com/search-console
   - Add property and submit sitemap

2. **Bing Webmaster Tools**
   - https://www.bing.com/webmasters
   - Submit sitemap

3. **Other search engines**
   - Baidu, Yandex, etc. have similar submission tools

---

## Performance Notes

- Sitemap generation happens **once at build time**
- Zero runtime cost for serving sitemap.xml
- Large sitemaps (1000s of URLs) are automatically split by Next.js
- Blog posts are fetched from Firestore during build (requires internet connection)

If you have 1000+ URLs, Next.js will automatically create multiple sitemap files (sitemap-0.xml, sitemap-1.xml, etc.) and an index (sitemap.xml).
