# SavePin Admin Portal — Complete Reference Guide

This document describes **every feature, page, database table, and field** in the SavePin admin portal. Any AI or developer can use this to understand, modify, or extend the admin system.

---

## 1. ADMIN ACCESS

**URL:** `https://npftas.xyz/admin/login`

**Authentication:** Supabase Auth (email + password)
- Login page: `/admin/login`
- All routes under `/admin/*` are protected by middleware
- Unauthenticated users are redirected to `/admin/login`
- The middleware (src/middleware.ts) refreshes the Supabase session on every request

**Admin User Setup:**
1. Create user in Supabase Dashboard → Authentication → Users → Add user
2. Run SQL: `UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';`

---

## 2. ADMIN LAYOUT (src/app/admin/layout.tsx)

The admin uses a **sidebar layout** (not the public header/footer):

- **Left sidebar** (264px wide, hidden on mobile):
  - Logo: "SavePin Admin" linking to homepage
  - Navigation links with icons (7 links total)
  - Active link is highlighted in brand color
- **Main content area** (right side, scrollable)
- **Mobile:** Shows a top bar with logo + "Admin" text; sidebar is hidden

### Sidebar Navigation Links:
| Link | URL | Description |
|---|---|---|
| Dashboard | `/admin` | Overview with stats and quick actions |
| Pages | `/admin/pages` | List of editable pages (homepage, etc.) |
| Navigation | `/admin/navigation` | Header and footer link management |
| Blog Posts | `/admin/posts` | Blog post list and editor |
| Tool Pages | `/admin/tools` | Pinterest downloader tool page editor |
| FAQs | `/admin/faqs` | FAQ management |
| Settings | `/admin/settings` | Global site settings (name, SEO, social) |

---

## 3. DATABASE TABLES

### 3.1 profiles
**Purpose:** Admin/editor user accounts
| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | References auth.users |
| email | text (unique) | User email |
| full_name | text | Optional display name |
| avatar_url | text | Optional profile image |
| role | text | `admin` or `editor` |
| created_at | timestamptz | Auto-set on creation |
| updated_at | timestamptz | Auto-updated |

### 3.2 pages
**Purpose:** Editable page content (homepage, etc.) stored as structured JSON
| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | Auto-generated |
| slug | text (unique) | URL identifier, e.g. `homepage` |
| title | text | Page title displayed in admin |
| content | jsonb | **Structured page content** (see Section 4) |
| seo_title | text | Custom SEO title |
| seo_description | text | Custom meta description |
| status | text | `published` or `draft` |
| created_at | timestamptz | Auto-set |
| updated_at | timestamptz | Auto-updated |

### 3.3 navigation
**Purpose:** Header and footer navigation links
| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | Auto-generated |
| menu_name | text | One of: `header`, `footer_tools`, `footer_company`, `footer_legal` |
| label | text | Display text, e.g. "Video" |
| url | text | Link target, e.g. "/pinterest-video-downloader" |
| sort_order | int | Display order (lower = first) |
| is_active | boolean | Show/hide toggle |
| created_at | timestamptz | Auto-set |
| updated_at | timestamptz | Auto-updated |

### 3.4 posts
**Purpose:** Blog articles
| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | Auto-generated |
| title | text | Post title |
| slug | text (unique) | URL slug |
| excerpt | text | Short summary |
| content | text | Full HTML/markdown content |
| featured_image | text | Hero image URL |
| author_id | uuid | FK to profiles |
| status | text | `draft`, `published`, or `unpublished` |
| seo_title | text | Custom SEO title |
| seo_description | text | Custom meta description |
| canonical_url | text | Custom canonical URL |
| indexable | boolean | Allow search engine indexing |
| reading_time | integer | Estimated minutes to read |
| created_at | timestamptz | Auto-set |
| updated_at | timestamptz | Auto-updated |
| published_at | timestamptz | When published |

### 3.5 tool_pages
**Purpose:** Pinterest downloader tool page content
| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | Auto-generated |
| slug | text (unique) | e.g. `pinterest-video-downloader` |
| name | text | Display name |
| title | text | Page H1 title |
| description | text | Short description |
| content | text | Rich content (HTML) |
| seo_title | text | Custom SEO title |
| seo_description | text | Custom meta description |
| status | text | `draft` or `published` |
| created_at | timestamptz | Auto-set |
| updated_at | timestamptz | Auto-updated |

### 3.6 faqs
**Purpose:** FAQ items (linked to tool pages)
| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | Auto-generated |
| tool_page_id | uuid | FK to tool_pages (cascade delete) |
| question | text | FAQ question |
| answer | text | FAQ answer |
| sort_order | integer | Display order |
| published | boolean | Show/hide |
| created_at | timestamptz | Auto-set |
| updated_at | timestamptz | Auto-updated |

### 3.7 site_settings
**Purpose:** Key-value store for global site configuration
| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | Auto-generated |
| key | text (unique) | Setting name |
| value | text | Setting value |
| updated_at | timestamptz | Auto-updated |

**Default keys:**
| Key | Default Value |
|---|---|
| site_name | SavePin |
| site_description | Simple, fast Pinterest media tools. |
| default_seo_title | SavePin — Pinterest Video, Image & GIF Downloader |
| default_meta_description | Download Pinterest videos, images, and GIFs. Free, simple, and fast. |
| social_image | (empty) |

---

## 4. HOMEPAGE CONTENT JSON STRUCTURE

The `pages.content` column for slug `homepage` stores this JSON structure:

```json
{
  "hero": {
    "title": "Pinterest Video Downloader",
    "subtitle": "Download videos, images, and GIFs from public Pinterest pins. Free, simple, and fast — no account required.",
    "trustBadges": ["Free", "No account needed", "Simple to use"]
  },
  "howItWorks": {
    "title": "How It Works",
    "steps": [
      {"step": "1", "title": "Copy the URL", "description": "Find a public Pinterest pin and copy its URL from your browser."},
      {"step": "2", "title": "Paste it here", "description": "Paste the Pinterest URL into the input field above and click Download."},
      {"step": "3", "title": "Save the file", "description": "Choose the media you want and save it to your device."}
    ]
  },
  "features": {
    "title": "Why SavePin",
    "items": [
      {"title": "No signup", "description": "Use the tools immediately without creating an account."},
      {"title": "Works on mobile", "description": "Fully responsive — works on any device with a browser."},
      {"title": "Clean interface", "description": "No clutter, no ads in the way. Just paste and download."},
      {"title": "Privacy first", "description": "We do not store your URLs or downloaded files."}
    ]
  },
  "faq": {
    "title": "Frequently Asked Questions",
    "items": [
      {"question": "Is SavePin free to use?", "answer": "Yes. SavePin is completely free..."},
      {"question": "Do I need to create an account?", "answer": "No. You can use SavePin without..."}
    ]
  }
}
```

---

## 5. ADMIN PAGES — DETAILED DESCRIPTION

### 5.1 Dashboard (`/admin/page.tsx`)

**Purpose:** Overview page shown after login.

**Sections:**
1. **Stats cards** (4 cards in a grid):
   - Published Posts (link to /admin/posts)
   - Draft Posts (link to /admin/posts)
   - Tool Pages (shows "3", link to /admin/tools)
   - FAQs (link to /admin/faqs)

2. **Quick Actions** (6 action buttons):
   - Edit homepage → `/admin/pages/homepage/edit`
   - Manage navigation → `/admin/navigation`
   - New blog post → `/admin/posts/new`
   - Edit tool pages → `/admin/tools`
   - Manage FAQs → `/admin/faqs`
   - Site settings → `/admin/settings`

---

### 5.2 Pages List (`/admin/pages/page.tsx`)

**Purpose:** Lists all editable pages from the `pages` table.

**Displays for each page:**
- Page title
- Slug (as /slug)
- Status badge (published = green, draft = yellow)
- Last updated date

**Actions:** Click any page → navigates to `/admin/pages/{slug}/edit`

---

### 5.3 Page Editor (`/admin/pages/[slug]/edit/page.tsx`)

**Purpose:** Full editor for a page's structured content. Uses **tabbed interface** with 5 tabs.

**Top bar:**
- Page title (editable text input)
- Save button (saves all tabs at once)

**Tab 1 — Hero:**
| Field | Type | Description |
|---|---|---|
| Hero Title | text input | Main H1 heading |
| Subtitle | textarea | Paragraph below heading |
| Trust Badges | list of text inputs | Badge labels shown under the download button |
| Add/Remove badges | buttons | Dynamic add/remove |

**Tab 2 — How It Works:**
| Field | Type | Description |
|---|---|---|
| Section Title | text input | Section heading (default: "How It Works") |
| Step N: Title | text input | Step heading |
| Step N: Description | textarea | Step description |
| Add/Remove steps | buttons | Dynamic add/remove, auto-renumbers |

**Tab 3 — Features:**
| Field | Type | Description |
|---|---|---|
| Section Title | text input | Section heading (default: "Why SavePin") |
| Feature N: Title | text input | Feature heading |
| Feature N: Description | textarea | Feature description |
| Add/Remove features | buttons | Dynamic add/remove |

**Tab 4 — FAQ:**
| Field | Type | Description |
|---|---|---|
| Section Title | text input | Section heading (default: "Frequently Asked Questions") |
| FAQ N: Question | text input | Question text |
| FAQ N: Answer | textarea | Answer text |
| Add/Remove FAQ items | buttons | Dynamic add/remove |

**Tab 5 — SEO:**
| Field | Type | Description |
|---|---|---|
| SEO Title | text input | Custom title tag |
| Meta Description | textarea | Custom meta description |
| Status | dropdown | Published / Draft |

**Save behavior:**
- Calls `supabase.from("pages").upsert(...)` with the slug as the conflict key
- Shows "Saved successfully!" green message on success
- Shows error message on failure

---

### 5.4 Navigation Editor (`/admin/navigation/page.tsx`)

**Purpose:** Manage all header and footer navigation links.

**Group tabs** (4 groups, shown as pill buttons):
| Tab | menu_name value | Controls |
|---|---|---|
| Header Navigation | `header` | Top navigation bar links |
| Footer — Tools | `footer_tools` | Footer "Tools" column links |
| Footer — Company | `footer_company` | Footer "Company" column links |
| Footer — Legal | `footer_legal` | Footer "Legal" column links |

**For each link in the active group:**
| Field | Type | Description |
|---|---|---|
| Order arrows | ▲/▼ buttons | Move up/down in sort order |
| Label | text input | Display text |
| URL | text input | Link target path |
| Active | checkbox | Toggle visibility |
| Remove | button | Delete the link |

**Add Link button:** Adds a new empty link to the current group

**Save All button:** Saves all navigation items across all groups at once

---

### 5.5 Blog Posts (`/admin/posts/`)

**Routes:**
| URL | Purpose |
|---|---|
| `/admin/posts` | List all posts |
| `/admin/posts/new` | Create new post |
| `/admin/posts/[id]/edit` | Edit existing post |

**Post editor fields:**
- Title, Slug, Excerpt, Content (rich text)
- Featured Image URL
- Status (draft/published/unpublished)
- SEO Title, SEO Description, Canonical URL
- Indexable toggle, Reading Time

---

### 5.6 Tool Pages (`/admin/tools/`)

**Routes:**
| URL | Purpose |
|---|---|
| `/admin/tools` | List all tool pages |
| `/admin/tools/[id]/edit` | Edit a tool page |

**Default tool pages (seeded):**
- `pinterest-video-downloader` — Pinterest Video Downloader
- `pinterest-image-downloader` — Pinterest Image Downloader
- `pinterest-gif-downloader` — Pinterest GIF Downloader

**Tool page editor fields:**
- Name, Title, Description, Content
- SEO Title, SEO Description
- Status (draft/published)

---

### 5.7 FAQs (`/admin/faqs/`)

**Purpose:** Manage FAQ items linked to tool pages.

**FAQ editor fields:**
- Question text
- Answer text
- Linked tool page (dropdown)
- Sort order
- Published toggle

---

### 5.8 Settings (`/admin/settings/page.tsx`)

**Purpose:** Global site configuration (stored in `site_settings` table).

**Fields:**
| Field | Type | Key in DB |
|---|---|---|
| Site Name | text input | `site_name` |
| Site Description | text input | `site_description` |
| Default SEO Title | text input | `default_seo_title` |
| Default Meta Description | textarea | `default_meta_description` |
| Social Image URL | text input | `social_image` |

---

## 6. FRONTEND DATA FLOW

### Homepage (src/app/page.tsx)
- **Client component** (`"use client"`)
- Fetches from `pages` table where `slug = 'homepage'` and `status = 'published'`
- Falls back to hardcoded defaults if no database content exists
- All sections (hero, steps, features, FAQ) render from database content

### Header (src/components/layout/Header.tsx)
- Fetches from `navigation` table where `menu_name = 'header'` and `is_active = true`
- Ordered by `sort_order`
- Falls back to hardcoded default links if no database content

### Footer (src/components/layout/Footer.tsx)
- Fetches from `navigation` table where `menu_name IN ('footer_tools', 'footer_company', 'footer_legal')`
- Groups results into three columns
- Falls back to hardcoded defaults if no database content

### MobileNav (src/components/layout/MobileNav.tsx)
- Same fetch as Header (navigation table, header menu_name)
- Shows in a slide-out panel on mobile

---

## 7. API ROUTES

| Route | Method | Purpose |
|---|---|---|
| `/api/download` | POST | Parses Pinterest URL, returns media URLs |
| `/api/file` | GET | Proxy download route (fetches Pinterest CDN files server-side) |

**Rate limiting:** 20 requests per minute per IP on `/api/download`

---

## 8. ENVIRONMENT VARIABLES

| Variable | Where Used | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + Server | Supabase anonymous/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Supabase service role key (secret) |
| `NEXT_PUBLIC_SITE_URL` | Sitemap | Site URL for SEO (default: https://npftas.xyz) |

---

## 9. KEY FILE PATHS

```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx          # Admin sidebar layout + auth guard
│   │   ├── page.tsx            # Dashboard with stats + quick actions
│   │   ├── login/page.tsx      # Login form
│   │   ├── pages/
│   │   │   ├── page.tsx        # Pages list
│   │   │   └── [slug]/edit/page.tsx  # Page editor (tabbed)
│   │   ├── navigation/page.tsx # Navigation link manager
│   │   ├── posts/              # Blog post CRUD
│   │   ├── tools/              # Tool page CRUD
│   │   ├── faqs/               # FAQ management
│   │   └── settings/page.tsx   # Global site settings
│   ├── api/
│   │   ├── download/route.ts   # Pinterest URL parser
│   │   └── file/route.ts       # Proxy file downloader
│   ├── page.tsx                # Homepage (reads from DB)
│   ├── sitemap.ts              # Dynamic sitemap
│   └── ...                     # Other public pages
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Site header (reads nav from DB)
│   │   ├── Footer.tsx          # Site footer (reads nav from DB)
│   │   └── MobileNav.tsx       # Mobile nav (reads from DB)
│   ├── ui/                     # Reusable UI components
│   ├── downloader/             # Pinterest downloader components
│   └── seo/                    # JSON-LD structured data
├── hooks/
│   └── useDownloader.ts        # Download state management
├── lib/
│   └── supabase/
│       ├── client.ts           # Browser Supabase client + useAuth hook
│       └── server.ts           # Server-side Supabase client
└── middleware.ts               # Auth middleware (protects /admin/*)

supabase/
└── migrations/
    ├── 001_initial_schema.sql  # profiles, posts, tool_pages, faqs, site_settings
    └── 002_pages_and_navigation.sql  # pages, navigation + seed data
```

---

## 10. ROW LEVEL SECURITY (RLS) POLICIES

| Table | Public Access | Authenticated Access |
|---|---|---|
| profiles | Read all | Update own profile |
| pages | Read published | Full CRUD |
| navigation | Read all | Full CRUD |
| posts | Read published | Full CRUD |
| tool_pages | Read published | Full CRUD |
| faqs | Read published | Full CRUD |
| site_settings | Read all | Full CRUD |

---

## 11. HOW TO ADD A NEW PAGE TO THE ADMIN

1. Create the migration SQL (new table or extend existing)
2. Create `src/app/admin/{section}/page.tsx` (list page)
3. Create `src/app/admin/{section}/[id]/edit/page.tsx` (editor)
4. Add sidebar link in `src/app/admin/layout.tsx` → `sidebarLinks` array
5. Add quick action in `src/app/admin/page.tsx` → `quickActions` array
6. If frontend needs the data, fetch from the new table in the relevant component
