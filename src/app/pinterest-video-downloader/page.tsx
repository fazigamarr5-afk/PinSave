"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { DownloaderInput } from "@/components/downloader/DownloaderInput";
import { DownloaderResult } from "@/components/downloader/DownloaderResult";
import { DownloadProgress } from "@/components/downloader/DownloadProgress";
import { ErrorState } from "@/components/downloader/ErrorState";
import { FAQAccordion } from "@/components/faq/FAQAccordion";
import { useDownloader } from "@/hooks/useDownloader";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import {
  WebApplicationJsonLd,
  FAQJsonLd,
  HowToJsonLd,
  BreadcrumbJsonLd,
  OrganizationJsonLd,
} from "@/components/seo/JsonLd";

const faqs = [
  {
    question: "What format does the video download in?",
    answer:
      "MP4 — the most universal video format. Plays on iPhone, Android, Windows, Mac, and basically every device made after 2010.",
  },
  {
    question: "Does this work with Pinterest Reels?",
    answer:
      "Yes. Reels, standard video pins, and idea pins all work. Just paste the URL.",
  },
  {
    question: "Can I download from private or secret boards?",
    answer:
      "No. We can only access publicly available pins. If you can view it without logging in, we can download it.",
  },
  {
    question: "Why won't a particular video download?",
    answer:
      "Usually it's one of three things: the pin is private, the URL is wrong, or the uploader restricted downloads. Double-check that the pin is public and the URL looks like pinterest.com/pin/...",
  },
  {
    question: "Is there a file size or length limit?",
    answer:
      "No artificial limits from us. If Pinterest serves it, we can download it. Longer videos just take a bit more time to process.",
  },
];

const howToSteps = [
  { name: "Find the video", text: "Open Pinterest and find the video you want to download. Make sure the pin is public." },
  { name: "Copy the link", text: "Copy the URL from your browser address bar. It should look like pinterest.com/pin/..." },
  { name: "Paste and download", text: "Paste the URL into the input field above and click Download." },
  { name: "Save the file", text: "Choose the video and click Save to download it to your device." },
];

const relatedTools = [
  {
    href: "/pinterest-image-downloader",
    title: "Pinterest Image Downloader",
    desc: "Save photos and illustrations from public Pinterest pins.",
  },
  {
    href: "/pinterest-gif-downloader",
    title: "Pinterest GIF Downloader",
    desc: "Download animated GIFs from public Pinterest content.",
  },
];

export default function PinterestVideoDownloaderPage() {
  const { url, setUrl, state, results, error, submit, reset } =
    useDownloader();

  return (
    <>
      <OrganizationJsonLd />
      <WebApplicationJsonLd />
      <FAQJsonLd faqs={faqs} />
      <HowToJsonLd
        name="How to Download Pinterest Videos"
        description="Step-by-step guide to download videos from Pinterest using SavePin."
        steps={howToSteps}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Video Downloader", url: "/pinterest-video-downloader" },
        ]}
      />

      <Container>
        <div className="py-12 max-w-3xl mx-auto">
          <Breadcrumbs
            items={[
              { label: "Tools", href: "/pinterest-video-downloader" },
              { label: "Video Downloader", href: "/pinterest-video-downloader" },
            ]}
          />

          <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-4">
            Pinterest Video Downloader
          </h1>
          <p className="text-surface-600 dark:text-surface-400 leading-relaxed mb-2">
            Found a video on Pinterest you want to keep? Paste the link above and save it in HD — no app, no account, no watermarks.
          </p>
          <p className="text-sm text-surface-400 dark:text-surface-500 mb-8">
            Works with standard pins, Reels, and idea pins. Downloads as MP4 on any device.
          </p>

          {/* Tool */}
          <div className="p-6 sm:p-8 rounded-2xl border bg-white border-surface-200 dark:bg-surface-900 dark:border-surface-800 shadow-sm">
            <DownloaderInput
              value={url}
              onChange={setUrl}
              onSubmit={submit}
              loading={state === "processing" || state === "validating"}
              placeholder="Paste a Pinterest video URL here..."
            />
            {state === "processing" && <DownloadProgress />}
            {state === "error" && error && (
              <ErrorState message={error} onDismiss={reset} />
            )}
            {state === "invalid" && error && (
              <ErrorState message={error} onDismiss={reset} />
            )}
            {state === "results" && <DownloaderResult results={results} />}
          </div>

          {/* How to use */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-6">
              How to download Pinterest videos
            </h2>
            <ol className="space-y-4 text-surface-600 dark:text-surface-400 leading-relaxed">
              {howToSteps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span>{step.text}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Supported URLs */}
          <section className="mt-12">
            <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-4">
              Supported URL formats
            </h2>
            <ul className="space-y-2 text-sm text-surface-600 dark:text-surface-400">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <code className="px-1.5 py-0.5 rounded bg-surface-100 dark:bg-surface-800 text-xs">
                  https://www.pinterest.com/pin/123456789/
                </code>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <code className="px-1.5 py-0.5 rounded bg-surface-100 dark:bg-surface-800 text-xs">
                  https://pin.it/AbCdEf
                </code>
              </li>
            </ul>
          </section>

          {/* FAQ */}
          <div className="mt-16">
            <FAQAccordion faqs={faqs} />
          </div>

          {/* Related tools */}
          <section className="mt-16">
            <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-4">
              Related tools
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group p-4 rounded-xl border bg-white border-surface-200 hover:border-brand-300 transition-all dark:bg-surface-900 dark:border-surface-800 dark:hover:border-brand-700"
                >
                  <h3 className="text-sm font-semibold text-surface-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
                    {tool.desc}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </Container>
    </>
  );
}
