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
    question: "What video formats can I download?",
    answer:
      "SavePin downloads Pinterest videos in MP4 format, which is compatible with virtually all devices and media players.",
  },
  {
    question: "Does this work with Pinterest Reels?",
    answer:
      "Yes. Pinterest Reels are a type of video content on Pinterest, and SavePin supports downloading them from public pins.",
  },
  {
    question: "Can I download videos from secret or private boards?",
    answer:
      "No. SavePin only works with publicly accessible pins. We cannot access private, secret, or restricted content.",
  },
  {
    question: "Why can't I download a particular video?",
    answer:
      "Some videos may be restricted by the original uploader, or the pin URL may be invalid. Make sure you're using a public pin URL.",
  },
  {
    question: "Is there a limit on video length?",
    answer:
      "SavePin does not impose its own limits. However, very large videos may take longer to process depending on your connection.",
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
          <p className="text-surface-600 dark:text-surface-400 leading-relaxed mb-8">
            Download videos and Reels from publicly available Pinterest pins.
            Paste the pin URL and save the video to your device in MP4 format.
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
