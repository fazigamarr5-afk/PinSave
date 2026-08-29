"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Page {
  id: string;
  slug: string;
  title: string;
  status: string;
  updated_at: string;
}

export default function AdminPagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("pages")
      .select("id, slug, title, status, updated_at")
      .order("updated_at", { ascending: false })
      .then(({ data }: { data: any }) => {
        setPages(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Pages</h1>
      </div>

      {loading ? (
        <p className="text-surface-500">Loading...</p>
      ) : pages.length === 0 ? (
        <p className="text-surface-500">No pages found.</p>
      ) : (
        <div className="space-y-3">
          {pages.map((page) => (
            <Link
              key={page.id}
              href={`/admin/pages/${page.slug}/edit`}
              className="flex items-center justify-between p-5 rounded-xl border bg-white border-surface-200 hover:border-brand-300 transition-all dark:bg-surface-900 dark:border-surface-800 dark:hover:border-brand-700"
            >
              <div>
                <h3 className="font-semibold text-surface-900 dark:text-white">{page.title}</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">/{page.slug}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${page.status === "published" ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"}`}>
                  {page.status}
                </span>
                <span className="text-xs text-surface-400">{new Date(page.updated_at).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
