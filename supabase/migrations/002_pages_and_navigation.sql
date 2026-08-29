-- ============================================
-- PAGES TABLE (Homepage & other editable pages)
-- ============================================
create table public.pages (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  title text not null default '',
  content jsonb not null default '{}'::jsonb,
  seo_title text,
  seo_description text,
  status text not null default 'published' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.pages enable row level security;

create policy "Published pages are viewable by everyone"
  on public.pages for select
  using (status = 'published' or auth.uid() is not null);

create policy "Authenticated users can manage pages"
  on public.pages for all
  using (auth.uid() is not null);

create index idx_pages_slug on public.pages(slug);

create trigger update_pages_updated_at
  before update on public.pages
  for each row execute function public.update_updated_at_column();

-- ============================================
-- NAVIGATION TABLE (Header & Footer links)
-- ============================================
create table public.navigation (
  id uuid default uuid_generate_v4() primary key,
  menu_name text not null check (menu_name in ('header', 'footer_tools', 'footer_company', 'footer_legal')),
  label text not null,
  url text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.navigation enable row level security;

create policy "Navigation is viewable by everyone"
  on public.navigation for select
  using (true);

create policy "Authenticated users can manage navigation"
  on public.navigation for all
  using (auth.uid() is not null);

create index idx_navigation_menu on public.navigation(menu_name, sort_order);

create trigger update_navigation_updated_at
  before update on public.navigation
  for each row execute function public.update_updated_at_column();

-- ============================================
-- SEED: HOMEPAGE CONTENT
-- ============================================
insert into public.pages (slug, title, content, status) values
('homepage', 'SavePin Homepage', '{
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
      {"title": "Privacy first", "description": "We don't store your URLs or downloaded files."}
    ]
  },
  "faq": {
    "title": "Frequently Asked Questions",
    "items": [
      {"question": "Is SavePin free to use?", "answer": "Yes. SavePin is completely free. There are no hidden fees or account requirements."},
      {"question": "Do I need to create an account?", "answer": "No. You can use SavePin without creating an account or logging in."},
      {"question": "Can I download from private Pinterest boards?", "answer": "No. SavePin only works with publicly accessible Pinterest content. We do not bypass authentication or access restrictions."},
      {"question": "What file formats are supported?", "answer": "SavePin supports video (MP4), images (JPG/PNG/WebP), and GIF formats from Pinterest."},
      {"question": "Is it legal to download Pinterest content?", "answer": "Downloading content for personal use from publicly available pins is generally acceptable. However, you should respect copyright and the original creator rights. Do not redistribute or use downloaded content commercially without permission."}
    ]
  }
}'::jsonb, 'published')
on conflict (slug) do nothing;

-- ============================================
-- SEED: HEADER NAVIGATION
-- ============================================
insert into public.navigation (menu_name, label, url, sort_order, is_active) values
('header', 'Video', '/pinterest-video-downloader', 1, true),
('header', 'Image', '/pinterest-image-downloader', 2, true),
('header', 'GIF', '/pinterest-gif-downloader', 3, true),
('header', 'Blog', '/blog', 4, true),
('header', 'About', '/about', 5, true);

-- ============================================
-- SEED: FOOTER NAVIGATION
-- ============================================
insert into public.navigation (menu_name, label, url, sort_order, is_active) values
('footer_tools', 'Video Downloader', '/pinterest-video-downloader', 1, true),
('footer_tools', 'Image Downloader', '/pinterest-image-downloader', 2, true),
('footer_tools', 'GIF Downloader', '/pinterest-gif-downloader', 3, true),
('footer_company', 'About', '/about', 1, true),
('footer_company', 'Blog', '/blog', 2, true),
('footer_company', 'Contact', '/contact', 3, true),
('footer_legal', 'Privacy Policy', '/privacy-policy', 1, true),
('footer_legal', 'Terms of Service', '/terms', 2, true);
