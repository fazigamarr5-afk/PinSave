import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { createClient } from "@supabase/supabase-js";

// Force dynamic rendering so blog posts are always fresh
export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Guides, tips, and updates from SavePin. Learn how to download Pinterest content effectively.",
};

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published_at: string | null;
}

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <Container>
      <div className="py-12 max-w-4xl">
        <Breadcrumbs items={[{ label: "Blog", href: "/blog" }]} />

        <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-4">
          Blog
        </h1>
        <p className="text-surface-600 dark:text-surface-400 leading-relaxed mb-10">
          Guides, tips, and updates from SavePin.
        </p>

        {posts && posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post: Post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="block p-6 rounded-xl border bg-white border-surface-200 hover:border-brand-300 hover:shadow-md transition-all dark:bg-surface-900 dark:border-surface-800 dark:hover:border-brand-700"
              >
                <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-2 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed mb-3">
                    {post.excerpt}
                  </p>
                )}
                {post.published_at && (
                  <time className="text-xs text-surface-400 dark:text-surface-500">
                    {new Date(post.published_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-xl border border-dashed border-surface-300 dark:border-surface-700">
            <svg
              className="w-12 h-12 mx-auto text-surface-300 dark:text-surface-700 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            </svg>
            <p className="text-surface-500 dark:text-surface-400">
              No articles published yet. Check back soon.
            </p>
          </div>
        )}
      </div>
    </Container>
  );
}
