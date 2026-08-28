"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

interface Settings {
  site_name: string;
  site_description: string;
  default_seo_title: string;
  default_meta_description: string;
  social_image: string;
}

const defaultSettings: Settings = {
  site_name: "SavePin",
  site_description: "Simple, fast Pinterest media tools.",
  default_seo_title: "SavePin — Pinterest Video, Image & GIF Downloader",
  default_meta_description:
    "Download Pinterest videos, images, and GIFs. Free, simple, and fast.",
  social_image: "",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("site_settings").select("*");

      if (data && data.length > 0) {
        const parsed: Partial<Settings> = {};
        data.forEach((row: { key: string; value: string }) => {
          if (row.key in defaultSettings) {
            parsed[row.key as keyof Settings] = row.value;
          }
        });
        setSettings((prev) => ({ ...prev, ...parsed }));
      }
    };
    fetchSettings();
  }, []);

  const update = (field: keyof Settings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);

    const supabase = createClient();

    const entries = Object.entries(settings).map(([key, value]) => ({
      key,
      value,
      updated_at: new Date().toISOString(),
    }));

    const { error: upsertError } = await supabase
      .from("site_settings")
      .upsert(entries, { onConflict: "key" });

    if (upsertError) {
      setError(upsertError.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }

    setSaving(false);
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-8">
        Site Settings
      </h1>

      <div className="space-y-6">
        <Input
          label="Site Name"
          value={settings.site_name}
          onChange={(e) => update("site_name", e.target.value)}
        />

        <Input
          label="Site Description"
          value={settings.site_description}
          onChange={(e) => update("site_description", e.target.value)}
        />

        <div className="border-t border-surface-200 dark:border-surface-800 pt-6">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
            Default SEO
          </h2>
          <div className="space-y-6">
            <Input
              label="Default SEO Title"
              value={settings.default_seo_title}
              onChange={(e) => update("default_seo_title", e.target.value)}
            />
            <Input
              label="Default Meta Description"
              value={settings.default_meta_description}
              onChange={(e) =>
                update("default_meta_description", e.target.value)
              }
            />
          </div>
        </div>

        <div className="border-t border-surface-200 dark:border-surface-800 pt-6">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
            Social
          </h2>
          <Input
            label="Social Image URL"
            value={settings.social_image}
            onChange={(e) => update("social_image", e.target.value)}
            placeholder="https://..."
          />
          <p className="mt-1 text-xs text-surface-400 dark:text-surface-500">
            URL to the default Open Graph / social sharing image.
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {saved && (
          <p className="text-sm text-green-600 dark:text-green-400">
            Settings saved successfully.
          </p>
        )}

        <div className="pt-4">
          <Button onClick={handleSave} loading={saving}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
