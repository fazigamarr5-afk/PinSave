"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

const toolSlugs: Record<string, { name: string; slug: string }> = {
  "1": { name: "Pinterest Video Downloader", slug: "pinterest-video-downloader" },
  "2": { name: "Pinterest Image Downloader", slug: "pinterest-image-downloader" },
  "3": { name: "Pinterest GIF Downloader", slug: "pinterest-gif-downloader" },
};

export default function EditToolPage() {
  const params = useParams();
  const toolId = params.id as string;

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toolInfo = toolSlugs[toolId] || { name: "Unknown Tool", slug: "" };

  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    seo_title: "",
    seo_description: "",
  });

  useEffect(() => {
    const fetchTool = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("tool_pages")
        .select("*")
        .eq("slug", toolInfo.slug)
        .single();

      if (data) {
        setForm({
          title: data.title || "",
          description: data.description || "",
          content: data.content || "",
          seo_title: data.seo_title || "",
          seo_description: data.seo_description || "",
        });
      }
    };
    fetchTool();
  }, [toolInfo.slug]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);

    const supabase = createClient();

    const { error: upsertError } = await supabase.from("tool_pages").upsert(
      {
        slug: toolInfo.slug,
        name: toolInfo.name,
        title: form.title || toolInfo.name,
        description: form.description,
        content: form.content,
        seo_title: form.seo_title || null,
        seo_description: form.seo_description || null,
        status: "published",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "slug" }
    );

    if (upsertError) {
      setError(upsertError.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }

    setSaving(false);
  };

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">
        Edit: {toolInfo.name}
      </h1>
      <p className="text-sm text-surface-400 dark:text-surface-500 mb-8">
        /{toolInfo.slug}
      </p>

      <div className="space-y-6">
        <Input
          label="Page Title"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder={toolInfo.name}
        />

        <Input
          label="Description"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Short description of this tool"
        />

        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
            Main Content
          </label>
          <textarea
            value={form.content}
            onChange={(e) => update("content", e.target.value)}
            rows={12}
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
        {saved && (
          <p className="text-sm text-green-600 dark:text-green-400">
            Changes saved successfully.
          </p>
        )}

        <div className="pt-4">
          <Button onClick={handleSave} loading={saving}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
