-- SavePin Database Schema
-- Run this migration on a new Supabase project

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- POSTS (Blog)
-- ============================================
create table public.posts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  excerpt text,
  content text not null default '',
  featured_image text,
  author_id uuid references public.profiles(id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'published', 'unpublished')),
  seo_title text,
  seo_description text,
  canonical_url text,
  indexable boolean not null default true,
  reading_time integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

alter table public.posts enable row level security;

create policy "Published posts are viewable by everyone"
  on public.posts for select
  using (status = 'published' or auth.uid() is not null);

create policy "Authors can insert posts"
  on public.posts for insert
  with check (auth.uid() is not null);

create policy "Authors can update their own posts"
  on public.posts for update
  using (auth.uid() is not null);

create policy "Authors can delete their own posts"
  on public.posts for delete
  using (auth.uid() is not null);

create index idx_posts_slug on public.posts(slug);
create index idx_posts_status on public.posts(status);
create index idx_posts_published_at on public.posts(published_at desc);

-- ============================================
-- TOOL PAGES
-- ============================================
create table public.tool_pages (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  name text not null,
  title text not null,
  description text not null default '',
  content text not null default '',
  seo_title text,
  seo_description text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tool_pages enable row level security;

create policy "Published tool pages are viewable by everyone"
  on public.tool_pages for select
  using (status = 'published' or auth.uid() is not null);

create policy "Authenticated users can manage tool pages"
  on public.tool_pages for all
  using (auth.uid() is not null);

create index idx_tool_pages_slug on public.tool_pages(slug);

-- ============================================
-- FAQs
-- ============================================
create table public.faqs (
  id uuid default uuid_generate_v4() primary key,
  tool_page_id uuid references public.tool_pages(id) on delete cascade,
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.faqs enable row level security;

create policy "Published FAQs are viewable by everyone"
  on public.faqs for select
  using (published = true or auth.uid() is not null);

create policy "Authenticated users can manage FAQs"
  on public.faqs for all
  using (auth.uid() is not null);

create index idx_faqs_tool_page_id on public.faqs(tool_page_id);
create index idx_faqs_sort_order on public.faqs(sort_order);

-- ============================================
-- SITE SETTINGS
-- ============================================
create table public.site_settings (
  id uuid default uuid_generate_v4() primary key,
  key text unique not null,
  value text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

create policy "Site settings are viewable by everyone"
  on public.site_settings for select
  using (true);

create policy "Authenticated users can manage settings"
  on public.site_settings for all
  using (auth.uid() is not null);

create index idx_site_settings_key on public.site_settings(key);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at_column();

create trigger update_posts_updated_at
  before update on public.posts
  for each row execute function public.update_updated_at_column();

create trigger update_tool_pages_updated_at
  before update on public.tool_pages
  for each row execute function public.update_updated_at_column();

create trigger update_faqs_updated_at
  before update on public.faqs
  for each row execute function public.update_updated_at_column();

create trigger update_site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.update_updated_at_column();

-- ============================================
-- SEED DEFAULT SETTINGS
-- ============================================
insert into public.site_settings (key, value) values
  ('site_name', 'SavePin'),
  ('site_description', 'Simple, fast Pinterest media tools.'),
  ('default_seo_title', 'SavePin — Pinterest Video, Image & GIF Downloader'),
  ('default_meta_description', 'Download Pinterest videos, images, and GIFs. Free, simple, and fast.'),
  ('social_image', '')
on conflict (key) do nothing;

-- ============================================
-- SEED DEFAULT TOOL PAGES
-- ============================================
insert into public.tool_pages (slug, name, title, description, status) values
  ('pinterest-video-downloader', 'Pinterest Video Downloader', 'Pinterest Video Downloader', 'Download videos and Reels from publicly available Pinterest pins.', 'published'),
  ('pinterest-image-downloader', 'Pinterest Image Downloader', 'Pinterest Image Downloader', 'Save high-resolution images from public Pinterest pins.', 'published'),
  ('pinterest-gif-downloader', 'Pinterest GIF Downloader', 'Pinterest GIF Downloader', 'Download animated GIFs from public Pinterest pins.', 'published')
on conflict (slug) do nothing;
