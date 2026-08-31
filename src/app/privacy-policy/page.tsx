import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "SavePin privacy policy. Learn how we handle your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <Container>
      <div className="py-12 max-w-3xl">
        <Breadcrumbs
          items={[{ label: "Privacy Policy", href: "/privacy-policy" }]}
        />

        <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-6">
          Privacy Policy
        </h1>

        <p className="text-sm text-surface-400 dark:text-surface-500 mb-8">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="space-y-8 text-surface-600 dark:text-surface-400 leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
              Overview
            </h2>
            <p>
              SavePin is a free tool for downloading publicly available media
              from Pinterest. We are committed to protecting your privacy. This
              policy explains what data we collect and how we use it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
              Data we collect
            </h2>
            <p>
              We collect minimal data. When you use SavePin, we do not store
              your Pinterest URLs, downloaded files, or browsing activity. We
              do not use tracking cookies.
            </p>
            <p className="mt-2">
              Our hosting provider (Vercel) may collect standard server logs
              such as IP addresses, browser type, and request timestamps for
              operational purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
              How we use data
            </h2>
            <p>
              We do not sell, share, or monetize any personal data. Server logs
              are used only for maintaining service quality and security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
              Third-party services
            </h2>
            <p>
              SavePin may use Vercel for hosting and Supabase for database and
              authentication. These services have their own privacy policies
              governing data handling.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
              Children&apos;s privacy
            </h2>
            <p>
              SavePin is not directed at children under 13. We do not knowingly
              collect data from children.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
              Changes to this policy
            </h2>
            <p>
              We may update this policy from time to time. Changes will be
              posted on this page with an updated date.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
              Contact
            </h2>
            <p>
              For privacy-related questions, email{" "}
              <a
                href="mailto:hello@npftas.xyz"
                className="text-brand-600 hover:text-brand-700 dark:text-brand-400 underline underline-offset-2"
              >
                hello@npftas.xyz
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
}
