import Link from "next/link";
import type { Post } from "@/types";
import { formatDate } from "@/lib/utils";

interface RelatedPostsProps {
  posts: Post[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section>
      <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
        Related Articles
      </h3>
      <div className="space-y-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group block"
          >
            <h4 className="text-sm font-medium text-surface-900 dark:text-surface-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              {post.title}
            </h4>
            <time
              dateTime={post.published_at || post.created_at}
              className="text-xs text-surface-400 dark:text-surface-500"
            >
              {formatDate(post.published_at || post.created_at)}
            </time>
          </Link>
        ))}
      </div>
    </section>
  );
}
