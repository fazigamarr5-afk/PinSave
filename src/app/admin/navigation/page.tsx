"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface NavItem {
  id: string;
  menu_name: string;
  label: string;
  url: string;
  sort_order: number;
  is_active: boolean;
}

const menuGroups = [
  { key: "header", label: "Header Navigation", description: "Links shown in the top navigation bar" },
  { key: "footer_tools", label: "Footer — Tools", description: "Footer link group for tools" },
  { key: "footer_company", label: "Footer — Company", description: "Footer link group for company pages" },
  { key: "footer_legal", label: "Footer — Legal", description: "Footer link group for legal pages" },
];

export default function AdminNavigationPage() {
  const [items, setItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeGroup, setActiveGroup] = useState("header");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("navigation").select("*").order("sort_order");
    setItems(data || []);
    setLoading(false);
  };

  const groupItems = items.filter((i) => i.menu_name === activeGroup);

  const updateItem = (id: string, field: string, value: string | boolean | number) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const addItem = () => {
    const newItem: NavItem = {
      id: `temp_${Date.now()}`,
      menu_name: activeGroup,
      label: "",
      url: "/",
      sort_order: groupItems.length,
      is_active: true,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const moveUp = (id: string) => {
    setItems((prev) => {
      const all = [...prev];
      const idx = all.findIndex((i) => i.id === id);
      if (idx <= 0) return prev;
      [all[idx - 1], all[idx]] = [all[idx], all[idx - 1]];
      return all;
    });
  };

  const moveDown = (id: string) => {
    setItems((prev) => {
      const all = [...prev];
      const idx = all.findIndex((i) => i.id === id);
      if (idx < 0 || idx >= all.length - 1) return prev;
      [all[idx], all[idx + 1]] = [all[idx + 1], all[idx]];
      return all;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    const supabase = createClient();

    // Delete removed items that exist in DB
    const existingIds = items.filter((i) => !i.id.startsWith("temp_")).map((i) => i.id);

    // Update sort orders based on position
    const updatedItems = items.map((item, index) => ({
      ...item,
      sort_order: index,
    }));
    setItems(updatedItems);

    // Upsert all items
    const toUpsert = updatedItems.map(({ id, ...rest }) => ({
      ...rest,
      ...(id.startsWith("temp_") ? {} : { id }),
    }));

    const { error: upsertError } = await supabase
      .from("navigation")
      .upsert(toUpsert, { onConflict: "id" });

    if (upsertError) {
      setError(upsertError.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      fetchItems();
    }
    setSaving(false);
  };

  if (loading) return <p className="text-surface-500">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Navigation</h1>
        <Button onClick={handleSave} loading={saving}>Save All</Button>
      </div>

      {error && <p className="mb-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{error}</p>}
      {saved && <p className="mb-4 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">Saved successfully!</p>}

      {/* Group tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {menuGroups.map((g) => (
          <button
            key={g.key}
            onClick={() => setActiveGroup(g.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeGroup === g.key ? "bg-brand-600 text-white" : "bg-surface-100 text-surface-600 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-400 dark:hover:bg-surface-700"}`}
          >
            {g.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">
        {menuGroups.find((g) => g.key === activeGroup)?.description}
      </p>

      {/* Items */}
      <div className="space-y-3">
        {groupItems.length === 0 ? (
          <p className="text-surface-400 text-sm py-4">No links in this group. Click &quot;+ Add Link&quot; to create one.</p>
        ) : (
          groupItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-4 border border-surface-200 dark:border-surface-800 rounded-lg">
              <div className="flex flex-col gap-1">
                <button onClick={() => moveUp(item.id)} className="text-surface-400 hover:text-surface-600 text-xs" disabled={groupItems.indexOf(item) === 0}>▲</button>
                <button onClick={() => moveDown(item.id)} className="text-surface-400 hover:text-surface-600 text-xs" disabled={groupItems.indexOf(item) === groupItems.length - 1}>▼</button>
              </div>
              <input
                value={item.label}
                onChange={(e) => updateItem(item.id, "label", e.target.value)}
                placeholder="Label"
                className="w-36 px-3 py-2 rounded-lg border bg-white border-surface-300 text-surface-900 dark:bg-surface-900 dark:border-surface-700 dark:text-white text-sm"
              />
              <input
                value={item.url}
                onChange={(e) => updateItem(item.id, "url", e.target.value)}
                placeholder="/path"
                className="flex-1 px-3 py-2 rounded-lg border bg-white border-surface-300 text-surface-900 dark:bg-surface-900 dark:border-surface-700 dark:text-white text-sm"
              />
              <label className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={item.is_active}
                  onChange={(e) => updateItem(item.id, "is_active", e.target.checked)}
                  className="rounded"
                />
                Active
              </label>
              <button onClick={() => removeItem(item.id)} className="text-sm text-red-600 hover:text-red-700 px-2">Remove</button>
            </div>
          ))
        )}
      </div>

      <button onClick={addItem} className="mt-4 text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 font-medium">
        + Add Link
      </button>
    </div>
  );
}
