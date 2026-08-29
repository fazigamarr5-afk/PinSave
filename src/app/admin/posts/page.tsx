"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: string;
  published_at: string | null;
  created_at: string;
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("posts")
      .select("id, title, slug, status, published_at, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }: { data: any }) => {
        setPosts(data || []);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const supabase = createClient();
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

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

      {loading ? (
        <p className="text-surface-500">Loading...</p>
      ) : posts.length === 0 ? (
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
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-surface-900 dark:text-white truncate">
                  {post.title}
                </h3>
                <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">
                  /{post.slug} ·{" "}
                  <span
                    className={
                      post.status === "published"
                        ? "text-green-600 dark:text-green-400"
                        : "text-yellow-600 dark:text-yellow-400"
                    }
                  >
                    {post.status}
                  </span>
                  {post.published_at && (
                    <> · {new Date(post.published_at).toLocaleDateString()}</>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-3 ml-4">
                {post.status === "published" && (
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="text-sm text-surface-400 hover:text-surface-600 dark:text-surface-500 dark:hover:text-surface-300"
                  >
                    View
                  </Link>
                )}
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post.id, post.title)}
                  className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
