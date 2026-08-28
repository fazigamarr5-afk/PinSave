# SavePin

Simple, fast Pinterest media tools. Download videos, images, and GIFs from public Pinterest pins.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** Supabase PostgreSQL
- **Auth:** Supabase Auth
- **Hosting:** Vercel

## Local Installation

```bash
# Clone the repository
git clone <repo-url>
cd savepin

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server-side only) |
| `NEXT_PUBLIC_SITE_URL` | Yes | Production site URL (e.g., `https://savepin.app`) |
| `NEXT_PUBLIC_SITE_NAME` | No | Site name (defaults to `SavePin`) |

**Never commit `.env.local` or expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.**

## Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in the Supabase dashboard
3. Run the migration file: `supabase/migrations/001_initial_schema.sql`
4. Copy your project URL and keys to `.env.local`

### Admin User Setup

1. Go to **Authentication > Users** in Supabase
2. Create a new user with email/password
3. That user can now log in at `/admin/login`

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
```

## Production Build

```bash
npm run build
npm run start
```

## Vercel Deployment

1. Push your repository to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Set environment variables in Vercel dashboard
4. Deploy

Vercel will automatically detect Next.js and configure the build.

## How to Add a New Tool

1. Create a new directory under `src/app/` (e.g., `src/app/new-tool-page/`)
2. Add a `page.tsx` with the tool UI and SEO content
3. Use the `DownloaderInput` and related components from `src/components/downloader/`
4. Add the tool to the navigation in `src/components/layout/Header.tsx`
5. Add it to the footer links in `src/components/layout/Footer.tsx`
6. Add it to the homepage tools section in `src/app/page.tsx`
7. Add it to the sitemap in `src/app/sitemap.ts`
8. Create the Supabase entry in `tool_pages` if admin editing is needed

## How to Add a New Blog Post

Via the admin dashboard:
1. Go to `/admin/login` and sign in
2. Navigate to **Blog Posts > New Post**
3. Write your content and fill in SEO fields
4. Click **Publish**

Via the database directly:
1. Insert a row into the `posts` table with `status = 'published'`
2. Set `published_at` to the desired publication date

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── layout.tsx         # Root layout
│   ├── sitemap.ts         # Dynamic sitemap
│   ├── api/download/      # Download API endpoint
│   ├── pinterest-*/       # Tool pages
│   ├── blog/              # Blog pages
│   └── admin/             # Admin dashboard
├── components/
│   ├── layout/            # Header, Footer, MobileNav
│   ├── ui/                # Button, Input, Card, etc.
│   ├── downloader/        # Downloader components
│   ├── blog/              # Blog components
│   ├── seo/               # JSON-LD, Breadcrumbs
│   └── faq/               # FAQ accordion
├── lib/
│   ├── pinterest/         # Pinterest download logic
│   ├── supabase/          # Supabase clients
│   ├── seo.ts             # SEO helpers
│   └── utils.ts           # Utilities
├── hooks/                 # React hooks
└── types/                 # TypeScript types
```

## Key Features

- **3 Pinterest tools:** Video, Image, GIF downloaders
- **Blog CMS:** Create, edit, publish posts from admin dashboard
- **Admin dashboard:** Manage posts, tool pages, FAQs, site settings
- **SEO:** Dynamic metadata, sitemap, robots.txt, structured data
- **Dark mode:** System preference + manual toggle
- **Mobile-first:** Responsive across all devices
- **Rate limiting:** API endpoint protection
- **Auth:** Supabase authentication for admin routes

## License

All rights reserved.
