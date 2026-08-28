"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export default function NewPostPage() {
  const router = useRouter();
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

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Auto-generate slug from title
    if (field === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setForm((prev) => ({ ...prev, slug }));
    }
  };

  const handleSave = async (status: "draft" | "published") => {
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }

    setSaving(true);
    setError(null);

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Not authenticated.");
      setSaving(false);
      return;
    }

    const { error: insertError } = await supabase.from("posts").insert({
      title: form.title.trim(),
      slug: form.slug.trim() || form.title.toLowerCase().replace(/\s+/g, "-"),
      excerpt: form.excerpt.trim() || null,
      content: form.content.trim(),
      author_id: user.id,
      status,
      seo_title: form.seo_title.trim() || null,
      seo_description: form.seo_description.trim() || null,
      published_at: status === "published" ? new Date().toISOString() : null,
    });

    if (insertError) {
      setError(insertError.message);
      setSaving(false);
      return;
    }

    router.push("/admin/posts");
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-8">
        New Blog Post
      </h1>

      <div className="space-y-6">
        <Input
          label="Title"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="Enter post title"
        />

        <Input
          label="Slug"
          value={form.slug}
          onChange={(e) => update("slug", e.target.value)}
          placeholder="post-url-slug"
        />

        <Input
          label="Excerpt"
          value={form.excerpt}
          onChange={(e) => update("excerpt", e.target.value)}
          placeholder="Short description for listings and SEO"
        />

        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
            Content
          </label>
          <textarea
            value={form.content}
            onChange={(e) => update("content", e.target.value)}
            placeholder="Write your article content here..."
            rows={16}
            className="w-full px-4 py-3 text-base rounded-lg border bg-white text-surface-900 placeholder:text-surface-400 border-surface-300 hover:border-surface-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-colors dark:bg-surface-900 dark:text-surface-100 dark:placeholder:text-surface-500 dark:border-surface-700 dark:hover:border-surface-600 resize-y"
          />
          <p className="mt-1 text-xs text-surface-400 dark:text-surface-500">
            Plain text or basic HTML supported. Rich editor coming soon.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Input
            label="SEO Title"
            value={form.seo_title}
            onChange={(e) => update("seo_title", e.target.value)}
            placeholder="Override page title for search engines"
          />
          <Input
            label="SEO Description"
            value={form.seo_description}
            onChange={(e) => update("seo_description", e.target.value)}
            placeholder="Meta description for search engines"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            onClick={() => handleSave("draft")}
            loading={saving}
            variant="secondary"
          >
            Save Draft
          </Button>
          <Button onClick={() => handleSave("published")} loading={saving}>
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
}
