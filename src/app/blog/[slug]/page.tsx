import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { createClient } from "@supabase/supabase-js";
import { ArticleJsonLd } from "@/components/seo/JsonLd";

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
    .select("*, profiles:author_id(full_name, avatar_url)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) notFound();

  const htmlContent = markdownToHtml(post.content || "");
  const author = post.profiles as { full_name: string | null; avatar_url: string | null } | null;
  const authorName = author?.full_name || "SavePin Team";
  const wasUpdated = post.updated_at && post.published_at &&
    new Date(post.updated_at).getTime() - new Date(post.published_at).getTime() > 60000;

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
          <ArticleJsonLd
            title={post.title}
            description={post.excerpt || `Read ${post.title} on SavePin blog.`}
            url={`/blog/${slug}`}
            image={post.featured_image || undefined}
            datePublished={post.published_at || post.created_at}
            dateModified={wasUpdated ? post.updated_at : undefined}
            authorName={authorName}
          />

          <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-4">
            {post.title}
          </h1>

          {/* Author & dates */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-700 dark:text-brand-300 text-sm font-bold">
              {authorName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-surface-900 dark:text-surface-100">
                {authorName}
              </p>
              <div className="flex items-center gap-2 text-xs text-surface-400 dark:text-surface-500">
                {post.published_at && (
                  <time dateTime={post.published_at}>
                    Published {new Date(post.published_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                )}
                {wasUpdated && (
                  <>
                    <span>·</span>
                    <time dateTime={post.updated_at}>
                      Updated {new Date(post.updated_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </>
                )}
              </div>
            </div>
          </div>

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

        {/* Share */}
        <div className="mt-10 flex items-center gap-3">
          <span className="text-sm font-medium text-surface-500 dark:text-surface-400">Share:</span>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://www.npftas.xyz/blog/${slug}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Twitter
          </a>
          <a
            href={`https://reddit.com/submit?url=${encodeURIComponent(`https://www.npftas.xyz/blog/${slug}`)}&title=${encodeURIComponent(post.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
            </svg>
            Reddit
          </a>
        </div>

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
