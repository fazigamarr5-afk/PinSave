-- Seed tool pages into the pages table so they appear in the admin editor
-- Each has SEO title, description, and keywords pre-filled

insert into public.pages (slug, title, content, seo_title, seo_description, seo_keywords, status) values
(
  'pinterest-video-downloader',
  'Pinterest Video Downloader',
  '{
    "hero": {
      "title": "Pinterest Video Downloader",
      "subtitle": "Download videos and Reels from publicly available Pinterest pins. Paste the pin URL and save the video to your device in MP4 format."
    }
  }'::jsonb,
  'Pinterest Video Downloader — Free Online Tool | SavePin',
  'Download Pinterest videos and Reels for free. No signup required. Paste any public Pinterest pin URL and save MP4 videos instantly.',
  'pinterest video downloader, download pinterest video, save pinterest video, pinterest reels download, pinterest video download online, free pinterest downloader',
  'published'
) on conflict (slug) do nothing;

insert into public.pages (slug, title, content, seo_title, seo_description, seo_keywords, status) values
(
  'pinterest-image-downloader',
  'Pinterest Image Downloader',
  '{
    "hero": {
      "title": "Pinterest Image Downloader",
      "subtitle": "Save high-resolution images from public Pinterest pins. Whether it is photography, illustrations, or infographics — paste the pin URL and download the image in its best available quality."
    }
  }'::jsonb,
  'Pinterest Image Downloader — Free Online Tool | SavePin',
  'Download high-resolution Pinterest images for free. Save photos, illustrations, and infographics from any public Pinterest pin. No account needed.',
  'pinterest image downloader, download pinterest image, save pinterest photo, pinterest picture download, pinterest image download online, free pinterest image saver',
  'published'
) on conflict (slug) do nothing;

insert into public.pages (slug, title, content, seo_title, seo_description, seo_keywords, status) values
(
  'pinterest-gif-downloader',
  'Pinterest GIF Downloader',
  '{
    "hero": {
      "title": "Pinterest GIF Downloader",
      "subtitle": "Download animated GIFs from public Pinterest pins. Find the GIF you want, paste the pin URL, and save it to your device."
    }
  }'::jsonb,
  'Pinterest GIF Downloader — Free Online Tool | SavePin',
  'Download animated GIFs from Pinterest for free. Save GIFs and animated content from any public Pinterest pin instantly. No signup required.',
  'pinterest gif downloader, download pinterest gif, save pinterest gif, pinterest animated gif, pinterest gif download online, free pinterest gif saver',
  'published'
) on conflict (slug) do nothing;
