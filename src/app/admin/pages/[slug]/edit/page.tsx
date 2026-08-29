"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface HeroSection { title: string; subtitle: string; trustBadges: string[]; }
interface Step { step: string; title: string; description: string; }
interface Feature { title: string; description: string; }
interface FaqItem { question: string; answer: string; }
interface PageContent {
  hero: HeroSection;
  howItWorks: { title: string; steps: Step[] };
  features: { title: string; items: Feature[] };
  faq: { title: string; items: FaqItem[] };
}

const emptyContent: PageContent = {
  hero: { title: "", subtitle: "", trustBadges: [] },
  howItWorks: { title: "How It Works", steps: [] },
  features: { title: "Why SavePin", items: [] },
  faq: { title: "Frequently Asked Questions", items: [] },
};

export default function EditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<PageContent>(emptyContent);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [status, setStatus] = useState("published");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"hero" | "steps" | "features" | "faq" | "seo">("hero");

  useEffect(() => {
    const supabase = createClient();
    supabase.from("pages").select("*").eq("slug", slug).single()
      .then(({ data }: { data: any }) => {
        if (data) {
          setTitle(data.title);
          setContent({ ...emptyContent, ...data.content });
          setSeoTitle(data.seo_title || "");
          setSeoDescription(data.seo_description || "");
          setSeoKeywords(data.seo_keywords || "");
          setStatus(data.status);
        }
        setLoading(false);
      });
  }, [slug]);

  const updateHero = (field: keyof HeroSection, value: string) =>
    setContent((p) => ({ ...p, hero: { ...p.hero, [field]: value } }));
  const updateHeroBadge = (i: number, v: string) => {
    const b = [...content.hero.trustBadges]; b[i] = v;
    setContent((p) => ({ ...p, hero: { ...p.hero, trustBadges: b } }));
  };
  const addHeroBadge = () =>
    setContent((p) => ({ ...p, hero: { ...p.hero, trustBadges: [...p.hero.trustBadges, ""] } }));
  const removeHeroBadge = (i: number) =>
    setContent((p) => ({ ...p, hero: { ...p.hero, trustBadges: p.hero.trustBadges.filter((_, x) => x !== i) } }));
  const updateStep = (i: number, field: keyof Step, v: string) => {
    const s = [...content.howItWorks.steps]; s[i] = { ...s[i], [field]: v };
    setContent((p) => ({ ...p, howItWorks: { ...p.howItWorks, steps: s } }));
  };
  const addStep = () => {
    const n = content.howItWorks.steps.length + 1;
    const s = [...content.howItWorks.steps, { step: String(n), title: "", description: "" }];
    setContent((p) => ({ ...p, howItWorks: { ...p.howItWorks, steps: s } }));
  };
  const removeStep = (i: number) => {
    const s = content.howItWorks.steps.filter((_, x) => x !== i).map((st, x) => ({ ...st, step: String(x + 1) }));
    setContent((p) => ({ ...p, howItWorks: { ...p.howItWorks, steps: s } }));
  };
  const updateFeature = (i: number, field: keyof Feature, v: string) => {
    const items = [...content.features.items]; items[i] = { ...items[i], [field]: v };
    setContent((p) => ({ ...p, features: { ...p.features, items } }));
  };
  const addFeature = () =>
    setContent((p) => ({ ...p, features: { ...p.features, items: [...p.features.items, { title: "", description: "" }] } }));
  const removeFeature = (i: number) =>
    setContent((p) => ({ ...p, features: { ...p.features, items: p.features.items.filter((_, x) => x !== i) } }));
  const updateFaq = (i: number, field: keyof FaqItem, v: string) => {
    const items = [...content.faq.items]; items[i] = { ...items[i], [field]: v };
    setContent((p) => ({ ...p, faq: { ...p.faq, items } }));
  };
  const addFaq = () =>
    setContent((p) => ({ ...p, faq: { ...p.faq, items: [...p.faq.items, { question: "", answer: "" }] } }));
  const removeFaq = (i: number) =>
    setContent((p) => ({ ...p, faq: { ...p.faq, items: p.faq.items.filter((_, x) => x !== i) } }));

  const handleSave = async () => {
    setSaving(true); setError(null); setSaved(false);
    const supabase = createClient();
    const      { error: e } = await supabase.from("pages").upsert(
      { slug, title, content, seo_title: seoTitle, seo_description: seoDescription, seo_keywords: seoKeywords, status, updated_at: new Date().toISOString() },
      { onConflict: "slug" }
    );
    if (e) setError(e.message); else { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    setSaving(false);
  };

  if (loading) return <p className="text-surface-500">Loading...</p>;

  const tabs = [
    { id: "hero" as const, label: "Hero" },
    { id: "steps" as const, label: "How It Works" },
    { id: "features" as const, label: "Features" },
    { id: "faq" as const, label: "FAQ" },
    { id: "seo" as const, label: "SEO" },
  ];

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Edit: {title || slug}</h1>
        <Button onClick={handleSave} loading={saving}>Save Page</Button>
      </div>
      {error && <p className="mb-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{error}</p>}
      {saved && <p className="mb-4 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">Saved successfully!</p>}
      <div className="mb-6"><Input label="Page Title" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
      <div className="flex gap-1 mb-6 border-b border-surface-200 dark:border-surface-800 overflow-x-auto">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id ? "border-brand-600 text-brand-600 dark:text-brand-400" : "border-transparent text-surface-500 hover:text-surface-700 dark:text-surface-400"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "hero" && (
        <div className="space-y-6">
          <Input label="Hero Title" value={content.hero.title} onChange={(e) => updateHero("title", e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Subtitle</label>
            <textarea value={content.hero.subtitle} onChange={(e) => updateHero("subtitle", e.target.value)} rows={3}
              className="w-full px-3 py-2 rounded-lg border bg-white border-surface-300 text-surface-900 dark:bg-surface-900 dark:border-surface-700 dark:text-white text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Trust Badges</label>
            <div className="space-y-2">
              {content.hero.trustBadges.map((badge, i) => (
                <div key={i} className="flex gap-2">
                  <input value={badge} onChange={(e) => updateHeroBadge(i, e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border bg-white border-surface-300 text-surface-900 dark:bg-surface-900 dark:border-surface-700 dark:text-white text-sm" />
                  <button onClick={() => removeHeroBadge(i)} className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">Remove</button>
                </div>
              ))}
              <button onClick={addHeroBadge} className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400">+ Add badge</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "steps" && (
        <div className="space-y-6">
          <Input label="Section Title" value={content.howItWorks.title} onChange={(e) => setContent((p) => ({ ...p, howItWorks: { ...p.howItWorks, title: e.target.value } }))} />
          {content.howItWorks.steps.map((step, i) => (
            <div key={i} className="p-4 border border-surface-200 dark:border-surface-800 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Step {step.step}</span>
                <button onClick={() => removeStep(i)} className="text-sm text-red-600 hover:text-red-700">Remove</button>
              </div>
              <Input label="Title" value={step.title} onChange={(e) => updateStep(i, "title", e.target.value)} />
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Description</label>
                <textarea value={step.description} onChange={(e) => updateStep(i, "description", e.target.value)} rows={2}
                  className="w-full px-3 py-2 rounded-lg border bg-white border-surface-300 text-surface-900 dark:bg-surface-900 dark:border-surface-700 dark:text-white text-sm" />
              </div>
            </div>
          ))}
          <button onClick={addStep} className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400">+ Add step</button>
        </div>
      )}

      {activeTab === "features" && (
        <div className="space-y-6">
          <Input label="Section Title" value={content.features.title} onChange={(e) => setContent((p) => ({ ...p, features: { ...p.features, title: e.target.value } }))} />
          {content.features.items.map((item, i) => (
            <div key={i} className="p-4 border border-surface-200 dark:border-surface-800 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Feature {i + 1}</span>
                <button onClick={() => removeFeature(i)} className="text-sm text-red-600 hover:text-red-700">Remove</button>
              </div>
              <Input label="Title" value={item.title} onChange={(e) => updateFeature(i, "title", e.target.value)} />
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Description</label>
                <textarea value={item.description} onChange={(e) => updateFeature(i, "description", e.target.value)} rows={2}
                  className="w-full px-3 py-2 rounded-lg border bg-white border-surface-300 text-surface-900 dark:bg-surface-900 dark:border-surface-700 dark:text-white text-sm" />
              </div>
            </div>
          ))}
          <button onClick={addFeature} className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400">+ Add feature</button>
        </div>
      )}

      {activeTab === "faq" && (
        <div className="space-y-6">
          <Input label="Section Title" value={content.faq.title} onChange={(e) => setContent((p) => ({ ...p, faq: { ...p.faq, title: e.target.value } }))} />
          {content.faq.items.map((item, i) => (
            <div key={i} className="p-4 border border-surface-200 dark:border-surface-800 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">FAQ {i + 1}</span>
                <button onClick={() => removeFaq(i)} className="text-sm text-red-600 hover:text-red-700">Remove</button>
              </div>
              <Input label="Question" value={item.question} onChange={(e) => updateFaq(i, "question", e.target.value)} />
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Answer</label>
                <textarea value={item.answer} onChange={(e) => updateFaq(i, "answer", e.target.value)} rows={3}
                  className="w-full px-3 py-2 rounded-lg border bg-white border-surface-300 text-surface-900 dark:bg-surface-900 dark:border-surface-700 dark:text-white text-sm" />
              </div>
            </div>
          ))}
          <button onClick={addFaq} className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400">+ Add FAQ</button>
        </div>
      )}

      {activeTab === "seo" && (
        <div className="space-y-6">
          <Input label="SEO Title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Meta Description</label>
            <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={3}
              className="w-full px-3 py-2 rounded-lg border bg-white border-surface-300 text-surface-900 dark:bg-surface-900 dark:border-surface-700 dark:text-white text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">SEO Keywords</label>
            <textarea value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} rows={3}
              placeholder="pinterest downloader, pinterest video download, save pinterest"
              className="w-full px-3 py-2 rounded-lg border bg-white border-surface-300 text-surface-900 dark:bg-surface-900 dark:border-surface-700 dark:text-white text-sm" />
            <p className="mt-1 text-xs text-surface-400">Comma-separated keywords for search engines</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border bg-white border-surface-300 text-surface-900 dark:bg-surface-900 dark:border-surface-700 dark:text-white text-sm">
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-surface-200 dark:border-surface-800 flex items-center gap-4">
        <Button onClick={handleSave} loading={saving}>Save Page</Button>
        <button onClick={() => router.push("/admin/pages")} className="text-sm text-surface-500 hover:text-surface-700 dark:text-surface-400">← Back to Pages</button>
      </div>
    </div>
  );
}
