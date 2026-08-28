import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://savepin.app";

const staticPages = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
  {
    path: "/pinterest-video-downloader",
    priority: 0.9,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/pinterest-image-downloader",
    priority: 0.9,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/pinterest-gif-downloader",
    priority: 0.9,
    changeFrequency: "weekly" as const,
  },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" as const },
  {
    path: "/privacy-policy",
    priority: 0.3,
    changeFrequency: "yearly" as const,
  },
  {
    path: "/terms",
    priority: 0.3,
    changeFrequency: "yearly" as const,
  },
  { path: "/contact", priority: 0.4, changeFrequency: "monthly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${BASE_URL}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  // In production, fetch blog posts from Supabase and add them:
  // const blogPosts = await getPublishedPosts();
  // const blogEntries = blogPosts.map(post => ({
  //   url: `${BASE_URL}/blog/${post.slug}`,
  //   lastModified: post.updated_at,
  //   changeFrequency: "monthly" as const,
  //   priority: 0.6,
  // }));

  return [...staticEntries /* ...blogEntries */];
}
