import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://savepin.vercel.app";

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${BASE_URL}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  // Fetch published blog posts from Supabase
  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: posts } = await supabase
      .from("posts")
      .select("slug, updated_at")
      .eq("status", "published");

    if (posts) {
      blogEntries = posts.map((post) => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: post.updated_at || now,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
    }
  } catch {
    // If Supabase fails, return static entries only
  }

  return [...staticEntries, ...blogEntries];
}
