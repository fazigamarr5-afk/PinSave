import Link from "next/link";
import { Button } from "@/components/ui/Button";

// In production, this would fetch posts from Supabase
const posts: Array<{
  id: string;
  title: string;
  slug: string;
  status: string;
  created_at: string;
}> = [];

export default function AdminPostsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
          Blog Posts
        </h1>
        <Link href="/admin/posts/new">
          <Button>New Post</Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-dashed border-surface-300 dark:border-surface-700">
          <p className="text-surface-500 dark:text-surface-400 mb-4">
            No blog posts yet.
          </p>
          <Link href="/admin/posts/new">
            <Button variant="secondary">Create your first post</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between p-4 rounded-xl border bg-white border-surface-200 dark:bg-surface-900 dark:border-surface-800"
            >
              <div>
                <h3 className="font-medium text-surface-900 dark:text-white">
                  {post.title}
                </h3>
                <p className="text-xs text-surface-400 dark:text-surface-500">
                  /{post.slug} · {post.status}
                </p>
              </div>
              <Link
                href={`/admin/posts/${post.id}/edit`}
                className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400"
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
