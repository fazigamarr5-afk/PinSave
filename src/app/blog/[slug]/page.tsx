import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Button } from "@/components/ui/Button";

// This page fetches from Supabase at build/request time
// For now, we show a placeholder since no posts exist yet

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  props: BlogPostPageProps
): Promise<Metadata> {
  const { slug } = await props.params;
  // In production, fetch post from Supabase
  return {
    title: slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    description: `Article on SavePin blog.`,
  };
}

export default async function BlogPostPage(props: BlogPostPageProps) {
  const { slug } = await props.params;

  // In production, this would fetch from Supabase:
  // const post = await getPostBySlug(slug);
  // if (!post || post.status !== "published") notFound();

  // For now, show a placeholder
  return (
    <Container>
      <div className="py-12 max-w-3xl mx-auto">
        <Breadcrumbs
          items={[
            { label: "Blog", href: "/blog" },
            {
              label: slug
                .split("-")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" "),
              href: `/blog/${slug}`,
            },
          ]}
        />

        <article>
          <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-4">
            {slug
              .split("-")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ")}
          </h1>

          <div className="text-surface-600 dark:text-surface-400 leading-relaxed">
            <p className="mt-8 text-center py-16">
              This article hasn&apos;t been written yet.
            </p>
          </div>
        </article>

        {/* CTA */}
        <div className="mt-12 p-6 rounded-xl border bg-surface-50 border-surface-200 dark:bg-surface-900 dark:border-surface-800 text-center">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
            Try our Pinterest downloader
          </h3>
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">
            Download videos, images, and GIFs from Pinterest — free, no account
            required.
          </p>
          <Link href="/pinterest-video-downloader">
            <Button>Open downloader</Button>
          </Link>
        </div>

        {/* Back to blog */}
        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
          >
            ← Back to all articles
          </Link>
        </div>
      </div>
    </Container>
  );
}
