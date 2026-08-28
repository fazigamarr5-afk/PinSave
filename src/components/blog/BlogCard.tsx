import Link from "next/link";
import type { Post } from "@/types";
import { formatDate, truncate } from "@/lib/utils";

interface BlogCardProps {
  post: Post;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block p-5 rounded-xl border bg-white border-surface-200 hover:border-surface-300 hover:shadow-md transition-all dark:bg-surface-900 dark:border-surface-800 dark:hover:border-surface-700"
    >
      {post.featured_image && (
        <div className="mb-4 aspect-video rounded-lg overflow-hidden bg-surface-100 dark:bg-surface-800">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      )}
      <h3 className="text-lg font-semibold text-surface-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2">
        {post.title}
      </h3>
      {post.excerpt && (
        <p className="mt-2 text-sm text-surface-500 dark:text-surface-400 leading-relaxed line-clamp-2">
          {truncate(post.excerpt, 150)}
        </p>
      )}
      <div className="mt-4 flex items-center gap-3 text-xs text-surface-400 dark:text-surface-500">
        <time dateTime={post.published_at || post.created_at}>
          {formatDate(post.published_at || post.created_at)}
        </time>
        {post.reading_time && (
          <>
            <span>·</span>
            <span>{post.reading_time} min read</span>
          </>
        )}
      </div>
    </Link>
  );
}
