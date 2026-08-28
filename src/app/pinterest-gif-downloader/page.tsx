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
    question: "Does SavePin support animated GIFs?",
    answer:
      "Yes. If the original Pinterest pin contains an animated GIF, SavePin will download the full animated version.",
  },
  {
    question: "What if the GIF is actually a video?",
    answer:
      "Some Pinterest pins that appear to be GIFs are actually short video loops. SavePin will detect and download the appropriate format — typically MP4 for these.",
  },
  {
    question: "Can I convert a Pinterest video to GIF?",
    answer:
      "SavePin downloads the content in its original format. We do not currently offer video-to-GIF conversion, but you can use a separate tool for that.",
  },
  {
    question: "Why is my download an MP4 instead of a GIF?",
    answer:
      "Pinterest often serves short animated content as MP4 video files rather than GIFs. This is normal and results in smaller file sizes with better quality.",
  },
];

const relatedTools = [
  {
    href: "/pinterest-video-downloader",
    title: "Pinterest Video Downloader",
    desc: "Download videos and Reels from public Pinterest pins.",
  },
  {
    href: "/pinterest-image-downloader",
    title: "Pinterest Image Downloader",
    desc: "Save high-resolution images from public Pinterest pins.",
  },
];

export default function PinterestGifDownloaderPage() {
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
              { label: "Tools", href: "/pinterest-gif-downloader" },
              { label: "GIF Downloader", href: "/pinterest-gif-downloader" },
            ]}
          />

          <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-4">
            Pinterest GIF Downloader
          </h1>
          <p className="text-surface-600 dark:text-surface-400 leading-relaxed mb-8">
            Download animated GIFs from public Pinterest pins. Find the GIF you
            want, paste the pin URL, and save it to your device. If the content
            is served as an MP4 video loop, we&apos;ll download that instead.
          </p>

          {/* Tool */}
          <div className="p-6 sm:p-8 rounded-2xl border bg-white border-surface-200 dark:bg-surface-900 dark:border-surface-800 shadow-sm">
            <DownloaderInput
              value={url}
              onChange={setUrl}
              onSubmit={submit}
              loading={state === "processing" || state === "validating"}
              placeholder="Paste a Pinterest GIF URL here..."
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
              How to download Pinterest GIFs
            </h2>
            <ol className="space-y-4 text-surface-600 dark:text-surface-400 leading-relaxed">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <span>
                  Find a GIF on Pinterest. Search for topics like
                  &quot;reactions&quot;, &quot;memes&quot;, or &quot;animations&quot;
                  to discover GIF content.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <span>
                  Copy the pin URL from your browser. It should be a public
                  Pinterest link.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <span>
                  Paste the URL above and click Download. We&apos;ll find the
                  GIF or animated content on the page.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs font-bold flex items-center justify-center">
                  4
                </span>
                <span>
                  Save the file. Note that some &quot;GIFs&quot; may download as
                  MP4 — this is how Pinterest serves short animated content.
                </span>
              </li>
            </ol>
          </section>

          {/* Note about format */}
          <section className="mt-12">
            <div className="p-5 rounded-xl border bg-surface-50 border-surface-200 dark:bg-surface-900 dark:border-surface-800">
              <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                About GIF vs MP4 on Pinterest
              </h3>
              <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">
                Pinterest typically stores animated content as MP4 video files
                rather than traditional GIFs. This results in much smaller file
                sizes with better visual quality. If your download is an MP4,
                it&apos;s the correct file — most modern browsers and devices
                play MP4 animations just like GIFs.
              </p>
            </div>
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
