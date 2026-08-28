import type { Metadata } from "next";
import { getSiteUrl, getSiteName } from "./utils";

interface PageSEO {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
}

export function generatePageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  noindex = false,
}: PageSEO): Metadata {
  const siteUrl = getSiteUrl();
  const siteName = getSiteName();
  const url = `${siteUrl}${path}`;
  const ogImage = image || `${siteUrl}/images/og-default.png`;

  return {
    title: `${title} | ${siteName}`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      url,
      siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteName}`,
      description,
      images: [ogImage],
    },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

// Tool page SEO
export function generateToolPageMetadata(tool: {
  title: string;
  description: string;
  slug: string;
}): Metadata {
  return generatePageMetadata({
    title: tool.title,
    description: tool.description,
    path: `/${tool.slug}`,
    type: "website",
  });
}

// Blog post SEO
export function generatePostMetadata(post: {
  title: string;
  excerpt: string;
  slug: string;
  featured_image?: string | null;
  published_at?: string | null;
  author_name?: string;
}): Metadata {
  return generatePageMetadata({
    title: post.title,
    description: post.excerpt || `Read about ${post.title} on SavePin.`,
    path: `/blog/${post.slug}`,
    image: post.featured_image || undefined,
    type: "article",
  });
}
