"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  published: boolean;
}

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ question: "", answer: "" });
  const [error, setError] = useState<string | null>(null);

  const fetchFaqs = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("faqs")
      .select("*")
      .order("sort_order", { ascending: true });

    setFaqs(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleSave = async (id?: string) => {
    if (!form.question.trim() || !form.answer.trim()) {
      setError("Both question and answer are required.");
      return;
    }

    setError(null);
    const supabase = createClient();

    if (id) {
      await supabase
        .from("faqs")
        .update({
          question: form.question.trim(),
          answer: form.answer.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
    } else {
      await supabase.from("faqs").insert({
        question: form.question.trim(),
        answer: form.answer.trim(),
        sort_order: faqs.length,
        published: true,
      });
    }

    setForm({ question: "", answer: "" });
    setEditingId(null);
    setShowNew(false);
    fetchFaqs();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    const supabase = createClient();
    await supabase.from("faqs").delete().eq("id", id);
    fetchFaqs();
  };

  const startEdit = (faq: FAQ) => {
    setEditingId(faq.id);
    setForm({ question: faq.question, answer: faq.answer });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
          FAQs
        </h1>
        <Button
          onClick={() => {
            setShowNew(true);
            setEditingId(null);
            setForm({ question: "", answer: "" });
          }}
        >
          Add FAQ
        </Button>
      </div>

      {/* New FAQ form */}
      {showNew && (
        <div className="p-5 rounded-xl border bg-white border-surface-200 dark:bg-surface-900 dark:border-surface-800 mb-6 space-y-4">
          <h3 className="font-medium text-surface-900 dark:text-white">
            New FAQ
          </h3>
          <Input
            label="Question"
            value={form.question}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, question: e.target.value }))
            }
          />
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
              Answer
            </label>
            <textarea
              value={form.answer}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, answer: e.target.value }))
              }
              rows={4}
              className="w-full px-4 py-3 text-base rounded-lg border bg-white text-surface-900 placeholder:text-surface-400 border-surface-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-colors dark:bg-surface-900 dark:text-surface-100 dark:placeholder:text-surface-500 dark:border-surface-700 resize-y"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          <div className="flex gap-3">
            <Button onClick={() => handleSave()} variant="secondary" size="sm">
              Save
            </Button>
            <Button
              onClick={() => {
                setShowNew(false);
                setError(null);
              }}
              variant="ghost"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* FAQ list */}
      {faqs.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-dashed border-surface-300 dark:border-surface-700">
          <p className="text-surface-500 dark:text-surface-400">
            No FAQs yet. Add your first one above.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="p-5 rounded-xl border bg-white border-surface-200 dark:bg-surface-900 dark:border-surface-800"
            >
              {editingId === faq.id ? (
                <div className="space-y-4">
                  <Input
                    label="Question"
                    value={form.question}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        question: e.target.value,
                      }))
                    }
                  />
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                      Answer
                    </label>
                    <textarea
                      value={form.answer}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          answer: e.target.value,
                        }))
                      }
                      rows={4}
                      className="w-full px-4 py-3 text-base rounded-lg border bg-white text-surface-900 border-surface-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-colors dark:bg-surface-900 dark:text-surface-100 dark:border-surface-700 resize-y"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleSave(faq.id)}
                      size="sm"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => setEditingId(null)}
                      variant="ghost"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="font-medium text-surface-900 dark:text-white">
                    {faq.question}
                  </p>
                  <p className="mt-2 text-sm text-surface-500 dark:text-surface-400 line-clamp-2">
                    {faq.answer}
                  </p>
                  <div className="mt-3 flex gap-3">
                    <button
                      onClick={() => startEdit(faq)}
                      className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
