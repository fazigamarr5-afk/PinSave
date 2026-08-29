-- Add seo_keywords column to pages table
alter table public.pages add column if not exists seo_keywords text;

-- Update the homepage row with some default keywords
update public.pages
set seo_keywords = 'pinterest downloader, pinterest video download, pinterest image download, pinterest gif download, save pinterest, download pinterest'
where slug = 'homepage';
