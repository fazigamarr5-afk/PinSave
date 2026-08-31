import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { AboutPageJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about SavePin — a free, simple tool for downloading publicly available Pinterest media.",
};

export default function AboutPage() {
  return (
    <Container>
      <AboutPageJsonLd />
      <div className="py-12 max-w-3xl">
        <Breadcrumbs items={[{ label: "About", href: "/about" }]} />

        <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-6">
          About SavePin
        </h1>

        <div className="prose prose-surface dark:prose-invert max-w-none">
          <p className="text-surface-600 dark:text-surface-400 leading-relaxed">
            SavePin is a free web tool that helps you download publicly available
            media from Pinterest. We built it because existing tools were
            cluttered, confusing, or required unnecessary signups.
          </p>

          <h2 className="text-xl font-semibold text-surface-900 dark:text-white mt-8 mb-4">
            What we do
          </h2>
          <p className="text-surface-600 dark:text-surface-400 leading-relaxed">
            SavePin lets you paste a public Pinterest URL and download the
            video, image, or GIF contained in that pin. That&apos;s it. We keep
            the tool simple and focused.
          </p>

          <h2 className="text-xl font-semibold text-surface-900 dark:text-white mt-8 mb-4">
            What we don&apos;t do
          </h2>
          <ul className="text-surface-600 dark:text-surface-400 leading-relaxed space-y-2">
            <li>We don&apos;t access private or restricted content.</li>
            <li>We don&apos;t store your downloaded files.</li>
            <li>We don&apos;t require accounts or collect personal data.</li>
            <li>We don&apos;t bypass any platform security controls.</li>
          </ul>

          <h2 className="text-xl font-semibold text-surface-900 dark:text-white mt-8 mb-4">
            Our principles
          </h2>
          <ul className="text-surface-600 dark:text-surface-400 leading-relaxed space-y-2">
            <li>
              <strong>Privacy:</strong> We don&apos;t track you or sell your data.
            </li>
            <li>
              <strong>Simplicity:</strong> One input, one button, done.
            </li>
            <li>
              <strong>Respect:</strong> We operate within platform terms and
              respect copyright.
            </li>
          </ul>
        </div>
      </div>
    </Container>
  );
}
