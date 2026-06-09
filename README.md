# Tech Tools - Comprehensive Browser Utility Suite

A Next.js 15 application featuring a comprehensive suite of browser-based utilities including image tools, PDF tools, QR code generator, color picker, speed tests, and more.

## Features

### Image Tools
- Compress, resize, crop, rotate images
- Remove backgrounds (AI-powered)
- Upscale images with detail restoration
- Format conversion (JPG, PNG, WebP, AVIF)
- Watermark and batch processing

### PDF Tools
- Merge, split, compress PDFs
- Convert PDF ↔ Word, PowerPoint, Excel
- Rotate, unlock, protect documents
- Repair and edit PDFs

### Utilities
- QR Code Generator (customizable colors & sizes)
- Color Picker with palette extraction
- Speed Test (download/upload)
- Typing Speed Test
- Image Editor with filters

### Content Management
- Firebase-backed blog with CMS
- Admin dashboard for posts, categories, tags
- Firestore integration for analytics
- Dynamic SEO (robots.txt, sitemap.xml, llms.txt)

## Tech Stack

- **Frontend**: Next.js 15 + React 18 + TypeScript
- **Styling**: TailwindCSS 3 + custom design tokens
- **UI Components**: Radix UI + Lucide icons
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **File Processing**: canvas, pdf-lib, pica, @imgly, exceljs, docx, mammoth
- **Testing**: Vitest

## Quick Start

### Prerequisites
- Node.js 18+
- Firebase project with Firestore configured
- Environment variables set

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Firebase config and other secrets
```

### Development

```bash
# Start dev server on port 3000
npm run dev
```

Visit `http://localhost:3000`

### Build & Deploy

```bash
# Type check
npm run typecheck

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
app/                          # Next.js App Router routes
├── (auth)/                   # Auth-related pages
├── admin/                    # Admin CMS dashboard
├── blog/[slug]/             # Dynamic blog posts
├── iloveimg/[tool]/         # Image tool routes
├── ilovepdf/[tool]/         # PDF tool routes
├── [static routes]/         # Home, about, contact, etc.
└── sitemap.ts / robots.ts   # SEO configuration

client/
├── components/
│   ├── image-tools/         # Image processing components
│   ├── pdf-tools/           # PDF processing components
│   ├── ui/                  # UI primitives
│   ├── Navbar, Footer, etc.
├── pages/                   # Page content components
├── lib/                     # Firebase, auth, utilities
├── global.css              # Design tokens & theming
└── theme/                  # Color palettes

shared/                     # Shared types (client + server)
```

## Environment Variables

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

NEXT_PUBLIC_EMAILJS_SERVICE_ID=...
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=...
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...
```

## SEO Configuration

The project includes automatic SEO file generation:

- **robots.txt** - Crawler permissions (built from `app/robots.ts`)
- **sitemap.xml** - Dynamic sitemap with all routes, tools, and blog posts (built from `app/sitemap.ts`)
- **llms.txt** - AI/LLM crawler permissions (static file at `app/llms.txt`)

See `SEO_FILES_README.md` for detailed configuration and how to add new routes automatically.

## Adding New Tools

### New Image Tool
1. Add to `IMAGE_TOOLS` array in `client/components/image-tools/toolsData.ts`
2. Create component in `client/components/image-tools/YourTool.tsx`
3. Import and add route check in `app/iloveimg/[tool]/page.tsx`
4. Rebuild project - sitemap updates automatically ✨

### New PDF Tool
1. Add to `PDF_TOOLS` array in `client/components/pdf-tools/toolsData.ts`
2. Create component in `client/components/pdf-tools/YourTool.tsx`
3. Import and add route check in `app/ilovepdf/[tool]/page.tsx`
4. Rebuild project - sitemap updates automatically ✨

### New Blog Post
1. Create Firestore document in `blog_posts` collection
2. Set `published: true` and add `slug`
3. Rebuild project - post appears in sitemap automatically ✨

## Styling

The project uses **dark-mode-first** design with:
- CSS variables for light/dark themes in `client/global.css`
- Semantic color tokens
- Custom utilities (glass-card, brand-gradient, etc.)
- TailwindCSS for layout and responsive design

Edit `client/global.css` and `tailwind.config.ts` to customize colors and design tokens.

## Known Issues & Notes

- SVG cropping not supported (canvas limitation) - use PNG instead
- Some older deployment configs reference Vite (legacy - ignore)
- Firebase rules require exact `request.time` matching for certain writes
- Heavy client-side rendering for tool pages (necessary for browser-based processing)

## Performance

- All file processing happens in-browser (zero server uploads)
- Client-side only for tools = faster, more private, offline capable
- Sitemap generated at build time (zero runtime cost)
- Static pages pre-rendered
- Large sitemaps automatically split by Next.js

## Contributing

When adding features:
1. Keep components focused and reusable
2. Use the existing UI component library
3. Update toolsData.ts for new tools (automatic SEO inclusion)
4. Use TypeScript for type safety
5. Test on mobile devices

## License

Proprietary - Tech Tools Platform

## Support

For issues or questions, contact the admin dashboard or check `/help` page.
