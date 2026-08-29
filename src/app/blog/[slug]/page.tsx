import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Simple Markdown-to-HTML converter
function markdownToHtml(md: string): string {
  let html = md
    // Escape HTML
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Headings
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-brand-600 dark:text-brand-400 hover:underline">$1</a>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg my-4 max-w-full" />')
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="my-8 border-surface-200 dark:border-surface-700" />')
    // Blockquotes
    .replace(/^&gt; (.+)$/gm, '<blockquote class="pl-4 border-l-2 border-brand-500 text-surface-500 dark:text-surface-400 italic my-4">$1</blockquote>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-surface-100 dark:bg-surface-800 text-sm">$1</code>');

  // Wrap consecutive <li> in <ul>
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul class="list-disc pl-5 my-4 space-y-1">$1</ul>');

  // Wrap paragraphs (lines that aren't already HTML)
  const lines = html.split('\n');
  const result: string[] = [];
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('<h') || trimmed.startsWith('<ul') || trimmed.startsWith('<li') ||
        trimmed.startsWith('<hr') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<img') ||
        trimmed === '</ul>' || trimmed === '') {
      result.push(line);
    } else {
      result.push(`<p class="mb-4 leading-relaxed">${trimmed}</p>`);
    }
  }

  return result.join('\n');
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  props: BlogPostPageProps
): Promise<Metadata> {
  const { slug } = await props.params;
  const { data: post } = await supabase
    .from("posts")
    .select("title, seo_title, seo_description, excerpt")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) return { title: "Post Not Found" };

  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt || `Read ${post.title} on SavePin blog.`,
  };
}

export default async function BlogPostPage(props: BlogPostPageProps) {
  const { slug } = await props.params;

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) notFound();

  const htmlContent = markdownToHtml(post.content || "");

  return (
    <Container>
      <div className="py-12 max-w-3xl mx-auto">
        <Breadcrumbs
          items={[
            { label: "Blog", href: "/blog" },
            { label: post.title, href: `/blog/${slug}` },
          ]}
        />

        <article>
          <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-4">
            {post.title}
          </h1>

          {post.published_at && (
            <time className="text-sm text-surface-400 dark:text-surface-500">
              {new Date(post.published_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}

          {post.excerpt && (
            <p className="mt-4 text-lg text-surface-600 dark:text-surface-400 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          <div
            className="mt-8 text-surface-700 dark:text-surface-300 leading-relaxed prose prose-surface dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
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
          <Link href="/">
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
