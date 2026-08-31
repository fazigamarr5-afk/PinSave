"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { DownloaderInput } from "@/components/downloader/DownloaderInput";
import { DownloaderResult } from "@/components/downloader/DownloaderResult";
import { DownloadProgress } from "@/components/downloader/DownloadProgress";
import { ErrorState } from "@/components/downloader/ErrorState";
import { useDownloader } from "@/hooks/useDownloader";
import { createClient } from "@/lib/supabase/client";
import { WebsiteJsonLd, WebApplicationJsonLd } from "@/components/seo/JsonLd";
import { FAQJsonLd } from "@/components/seo/JsonLd";

const tools = [
  {
    href: "/pinterest-video-downloader",
    title: "Pinterest Video Downloader",
    description: "Download videos and Reels from public Pinterest pins.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
      </svg>
    ),
  },
  {
    href: "/pinterest-image-downloader",
    title: "Pinterest Image Downloader",
    description: "Save high-resolution images and photos from Pinterest pins.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25a1.5 1.5 0 001.5 1.5z" />
      </svg>
    ),
  },
  {
    href: "/pinterest-gif-downloader",
    title: "Pinterest GIF Downloader",
    description: "Download animated GIFs from public Pinterest content.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
      </svg>
    ),
  },
];

// Default content (used as fallback if DB is empty)
const defaultSteps = [
  { step: "1", title: "Copy the link", description: "Find any public Pinterest pin and copy its URL from your browser or app." },
  { step: "2", title: "Paste it here", description: "Paste the URL into the box above. We'll detect the video, image, or GIF automatically." },
  { step: "3", title: "Save it", description: "Pick the quality you want and save it to your phone, tablet, or computer. Done." },
];

const defaultFeatures = [
  { title: "Zero friction", description: "No signup, no app install, no waiting. Paste a link, get the file." },
  { title: "Original quality", description: "We serve the file at the highest resolution Pinterest provides — up to 1080p." },
  { title: "Works everywhere", description: "iPhone, Android, Windows, Mac — any device with a browser." },
  { title: "Nothing stored", description: "Your URLs and files never touch our servers. We don't track you either." },
];

const defaultFaqs = [
  { question: "Is SavePin free to use?", answer: "Yes. SavePin is completely free. There are no hidden fees or account requirements." },
  { question: "Do I need to create an account?", answer: "No. You can use SavePin without creating an account or logging in." },
  { question: "Can I download from private Pinterest boards?", answer: "No. SavePin only works with publicly accessible Pinterest content. We do not bypass authentication or access restrictions." },
  { question: "What file formats are supported?", answer: "SavePin supports video (MP4), images (JPG/PNG/WebP), and GIF formats from Pinterest." },
  { question: "Is it legal to download Pinterest content?", answer: "Downloading content for personal use from publicly available pins is generally acceptable. However, you should respect copyright and the original creator's rights. Do not redistribute or use downloaded content commercially without permission." },
];

interface PageContent {
  hero: { title: string; subtitle: string; trustBadges: string[] };
  howItWorks: { title: string; steps: { step: string; title: string; description: string }[] };
  features: { title: string; items: { title: string; description: string }[] };
  faq: { title: string; items: { question: string; answer: string }[] };
}

export default function HomePage() {
  const { url, setUrl, state, results, error, submit, reset } = useDownloader();
  const [pageContent, setPageContent] = useState<PageContent | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("pages")
      .select("content")
      .eq("slug", "homepage")
      .eq("status", "published")
      .single()
      .then(({ data }: { data: any }) => {
        if (data?.content) setPageContent(data.content as PageContent);
      })
      .catch(() => {});
  }, []);

  const hero = pageContent?.hero || { title: "Save any Pinterest video, image, or GIF", subtitle: "Paste a Pinterest link. Get the file. No signup, no watermarks, no nonsense — works on every device.", trustBadges: ["100% free", "No account needed", "Up to 1080p quality"] };
  const howItWorksTitle = pageContent?.howItWorks?.title || "How It Works";
  const steps = pageContent?.howItWorks?.steps?.length ? pageContent.howItWorks.steps : defaultSteps;
  const featuresTitle = pageContent?.features?.title || "Why SavePin";
  const features = pageContent?.features?.items?.length ? pageContent.features.items : defaultFeatures;
  const faqTitle = pageContent?.faq?.title || "Frequently Asked Questions";
  const faqs = pageContent?.faq?.items?.length ? pageContent.faq.items : defaultFaqs;

  return (
    <>
      <WebsiteJsonLd />
      <WebApplicationJsonLd />
      <FAQJsonLd faqs={faqs} />

      {/* Hero */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-surface-900 dark:text-white tracking-tight">
              {hero.title}
            </h1>
            <p className="mt-4 text-lg text-surface-600 dark:text-surface-400 leading-relaxed">
              {hero.subtitle}
            </p>
          </div>

          <div className="mt-10">
            <DownloaderInput
              value={url}
              onChange={setUrl}
              onSubmit={submit}
              loading={state === "processing" || state === "validating"}
            />
          </div>

          {/* Trust points */}
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-surface-500 dark:text-surface-400">
            {hero.trustBadges.map((badge: string) => (
              <span key={badge} className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {badge}
              </span>
            ))}
          </div>

          {/* Results/Progress/Error */}
          {state === "processing" && <DownloadProgress />}
          {state === "error" && error && (
            <ErrorState message={error} onDismiss={reset} />
          )}
          {state === "invalid" && error && (
            <ErrorState message={error} onDismiss={reset} />
          )}
          {state === "results" && <DownloaderResult results={results} />}
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-surface-50 dark:bg-surface-950 border-t border-surface-200 dark:border-surface-800">
        <Container>
          <h2 className="text-2xl font-bold text-surface-900 dark:text-white text-center mb-10">
            {howItWorksTitle}
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step: { step: string; title: string; description: string }) => (
              <div key={step.step} className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-sm font-bold mb-4">
                  {step.step}
                </div>
                <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Available Tools */}
      <section className="py-16">
        <Container>
          <h2 className="text-2xl font-bold text-surface-900 dark:text-white text-center mb-10">
            Available Tools
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group p-6 rounded-xl border bg-white border-surface-200 hover:border-brand-300 hover:shadow-md transition-all dark:bg-surface-900 dark:border-surface-800 dark:hover:border-brand-700"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4 group-hover:bg-brand-200 dark:group-hover:bg-brand-900/50 transition-colors">
                  {tool.icon}
                </div>
                <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Why SavePin */}
      <section className="py-16 bg-surface-50 dark:bg-surface-950 border-t border-surface-200 dark:border-surface-800">
        <Container>
          <h2 className="text-2xl font-bold text-surface-900 dark:text-white text-center mb-10">
            {featuresTitle}
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
            {features.map((item: { title: string; description: string }) => (
              <div key={item.title}>
                <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <Container narrow>
          <h2 className="text-2xl font-bold text-surface-900 dark:text-white text-center mb-10">
            {faqTitle}
          </h2>
          <div className="space-y-3">
            {faqs.map((faq: { question: string; answer: string }, i: number) => (
              <details
                key={i}
                className="group border border-surface-200 dark:border-surface-800 rounded-lg overflow-hidden"
              >
                <summary className="flex items-center justify-between px-5 py-4 text-sm font-medium text-surface-900 dark:text-surface-100 cursor-pointer list-none hover:bg-surface-50 dark:hover:bg-surface-900/50 transition-colors">
                  {faq.question}
                  <svg className="w-5 h-5 text-surface-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </summary>
                <div className="px-5 pb-4 text-sm text-surface-600 dark:text-surface-400 leading-relaxed border-t border-surface-200 dark:border-surface-800 pt-4">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
