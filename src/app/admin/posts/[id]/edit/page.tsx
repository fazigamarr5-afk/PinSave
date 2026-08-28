"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: string;
  seo_title: string | null;
  seo_description: string | null;
}

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    seo_title: "",
    seo_description: "",
  });

  useEffect(() => {
    const fetchPost = async () => {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postId)
        .single();

      if (fetchError || !data) {
        setError("Post not found.");
        setLoading(false);
        return;
      }

      setForm({
        title: data.title || "",
        slug: data.slug || "",
        excerpt: data.excerpt || "",
        content: data.content || "",
        seo_title: data.seo_title || "",
        seo_description: data.seo_description || "",
      });
      setLoading(false);
    };

    fetchPost();
  }, [postId]);

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (status?: string) => {
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }

    setSaving(true);
    setError(null);

    const supabase = createClient();

    const updates: Record<string, unknown> = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      excerpt: form.excerpt.trim() || null,
      content: form.content.trim(),
      seo_title: form.seo_title.trim() || null,
      seo_description: form.seo_description.trim() || null,
      updated_at: new Date().toISOString(),
    };

    if (status) {
      updates.status = status;
      if (status === "published") {
        updates.published_at = new Date().toISOString();
      }
    }

    const { error: updateError } = await supabase
      .from("posts")
      .update(updates)
      .eq("id", postId);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const supabase = createClient();
    const { error: deleteError } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    router.push("/admin/posts");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
          Edit Post
        </h1>
        <Button variant="danger" size="sm" onClick={handleDelete}>
          Delete
        </Button>
      </div>

      <div className="space-y-6">
        <Input
          label="Title"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
        />

        <Input
          label="Slug"
          value={form.slug}
          onChange={(e) => update("slug", e.target.value)}
        />

        <Input
          label="Excerpt"
          value={form.excerpt}
          onChange={(e) => update("excerpt", e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
            Content
          </label>
          <textarea
            value={form.content}
            onChange={(e) => update("content", e.target.value)}
            rows={20}
            className="w-full px-4 py-3 text-base rounded-lg border bg-white text-surface-900 placeholder:text-surface-400 border-surface-300 hover:border-surface-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-colors dark:bg-surface-900 dark:text-surface-100 dark:placeholder:text-surface-500 dark:border-surface-700 dark:hover:border-surface-600 resize-y"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Input
            label="SEO Title"
            value={form.seo_title}
            onChange={(e) => update("seo_title", e.target.value)}
          />
          <Input
            label="SEO Description"
            value={form.seo_description}
            onChange={(e) => update("seo_description", e.target.value)}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            onClick={() => handleSave()}
            loading={saving}
            variant="secondary"
          >
            Save Changes
          </Button>
          <Button onClick={() => handleSave("draft")} loading={saving} variant="secondary">
            Save as Draft
          </Button>
          <Button onClick={() => handleSave("published")} loading={saving}>
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
}
