"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

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
  const [scheduledAt, setScheduledAt] = useState("");

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

    // If a schedule time is set, override status to draft and set scheduled_at
    const isScheduled = scheduledAt && new Date(scheduledAt) > new Date();
    const finalStatus = isScheduled ? "draft" : status;

    const { error: insertError } = await supabase.from("posts").insert({
      title: form.title.trim(),
      slug: form.slug.trim() || form.title.toLowerCase().replace(/\s+/g, "-"),
      excerpt: form.excerpt.trim() || null,
      content: form.content.trim(),
      author_id: user.id,
      status: finalStatus,
      seo_title: form.seo_title.trim() || null,
      seo_description: form.seo_description.trim() || null,
      published_at: finalStatus === "published" ? new Date().toISOString() : null,
      scheduled_at: isScheduled ? new Date(scheduledAt).toISOString() : null,
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
          <RichTextEditor
            value={form.content}
            onChange={(v) => update("content", v)}
          />
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

        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
            Schedule for Later (optional)
          </label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
            className="w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:border-surface-700 dark:bg-surface-900 dark:text-white dark:placeholder:text-surface-500"
          />
          {scheduledAt && (
            <p className="mt-1 text-xs text-brand-600 dark:text-brand-400">
              Post will auto-publish on {new Date(scheduledAt).toLocaleString()}
            </p>
          )}
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
          {scheduledAt ? (
            <Button onClick={() => handleSave("draft")} loading={saving}>
              Schedule Post
            </Button>
          ) : (
            <Button onClick={() => handleSave("published")} loading={saving}>
              Publish
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
