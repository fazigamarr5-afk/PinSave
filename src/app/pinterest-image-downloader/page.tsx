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
import { WebApplicationJsonLd, FAQJsonLd } from "@/components/seo/JsonLd";

const faqs = [
  {
    question: "What image quality can I expect?",
    answer:
      "SavePin attempts to download the highest resolution version available. Most Pinterest images are available in 736px or original resolution depending on what the uploader provided.",
  },
  {
    question: "What image formats are supported?",
    answer:
      "We support JPG, PNG, and WebP formats. The downloaded format depends on what the original pin contains.",
  },
  {
    question: "Can I download multiple images from a single pin?",
    answer:
      "Yes. If a pin contains multiple images, SavePin will display all available images for you to download individually.",
  },
  {
    question: "Can I download images from Pinterest idea pins?",
    answer:
      "Yes. Idea pins that contain public images can be downloaded using SavePin.",
  },
];

const relatedTools = [
  {
    href: "/pinterest-video-downloader",
    title: "Pinterest Video Downloader",
    desc: "Download videos and Reels from public Pinterest pins.",
  },
  {
    href: "/pinterest-gif-downloader",
    title: "Pinterest GIF Downloader",
    desc: "Download animated GIFs from public Pinterest content.",
  },
];

export default function PinterestImageDownloaderPage() {
  const { url, setUrl, state, results, error, submit, reset } =
    useDownloader();

  return (
    <>
      <WebApplicationJsonLd />
      <FAQJsonLd faqs={faqs} />

      <Container>
        <div className="py-12 max-w-3xl mx-auto">
          <Breadcrumbs
            items={[
              { label: "Tools", href: "/pinterest-image-downloader" },
              {
                label: "Image Downloader",
                href: "/pinterest-image-downloader",
              },
            ]}
          />

          <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-4">
            Pinterest Image Downloader
          </h1>
          <p className="text-surface-600 dark:text-surface-400 leading-relaxed mb-8">
            Save high-resolution images from public Pinterest pins. Whether
            it&apos;s photography, illustrations, or infographics — paste the
            pin URL and download the image in its best available quality.
          </p>

          {/* Tool */}
          <div className="p-6 sm:p-8 rounded-2xl border bg-white border-surface-200 dark:bg-surface-900 dark:border-surface-800 shadow-sm">
            <DownloaderInput
              value={url}
              onChange={setUrl}
              onSubmit={submit}
              loading={state === "processing" || state === "validating"}
              placeholder="Paste a Pinterest image URL here..."
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
              How to save Pinterest images
            </h2>
            <ol className="space-y-4 text-surface-600 dark:text-surface-400 leading-relaxed">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <span>
                  Find the image you want on Pinterest. Right-click the pin and
                  copy its link, or grab the URL from the address bar.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <span>
                  Paste the URL into the field above and press Enter or click
                  Download.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <span>
                  Choose the image you want and click Save to download it to
                  your device.
                </span>
              </li>
            </ol>
          </section>

          {/* Tips */}
          <section className="mt-12">
            <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-4">
              Tips for best results
            </h2>
            <ul className="space-y-3 text-surface-600 dark:text-surface-400 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-brand-600 dark:text-brand-400">•</span>
                <span>
                  Use the direct pin URL (containing <code className="px-1 py-0.5 rounded bg-surface-100 dark:bg-surface-800 text-xs">/pin/</code>) for
                  the most reliable results.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-brand-600 dark:text-brand-400">•</span>
                <span>
                  If a pin has multiple images, all available versions will be
                  shown for download.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-brand-600 dark:text-brand-400">•</span>
                <span>
                  Original-resolution images are preferred when available from
                  the uploader.
                </span>
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
