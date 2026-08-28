import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "SavePin terms of service and usage guidelines.",
};

export default function TermsPage() {
  return (
    <Container>
      <div className="py-12 max-w-3xl">
        <Breadcrumbs items={[{ label: "Terms of Service", href: "/terms" }]} />

        <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-6">
          Terms of Service
        </h1>

        <p className="text-sm text-surface-400 dark:text-surface-500 mb-8">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="space-y-8 text-surface-600 dark:text-surface-400 leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
              Acceptance of terms
            </h2>
            <p>
              By using SavePin, you agree to these terms. If you do not agree,
              please do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
              Description of service
            </h2>
            <p>
              SavePin provides tools for downloading publicly available media
              from Pinterest. The service is provided free of charge.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
              Acceptable use
            </h2>
            <p>You agree to:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Only download content you have the right to access</li>
              <li>Respect copyright and intellectual property rights</li>
              <li>Not use the service for any illegal purpose</li>
              <li>Not attempt to overload or abuse the service</li>
              <li>Not bypass any access restrictions or security measures</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
              Intellectual property
            </h2>
            <p>
              Content downloaded through SavePin remains the property of its
              original creator. SavePin does not claim ownership of any
              downloaded content. Users are responsible for ensuring their use
              of downloaded content complies with applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
              Disclaimer
            </h2>
            <p>
              SavePin is provided &quot;as is&quot; without warranties. We do not
              guarantee uninterrupted service or that the tool will work with
              every Pinterest URL. We are not responsible for how users choose
              to use downloaded content.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
              Limitation of liability
            </h2>
            <p>
              SavePin shall not be liable for any damages arising from the use
              or inability to use the service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
              Changes to terms
            </h2>
            <p>
              We may update these terms at any time. Continued use of the
              service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
              Contact
            </h2>
            <p>
              For questions about these terms, email{" "}
              <a
                href="mailto:hello@savepin.app"
                className="text-brand-600 hover:text-brand-700 dark:text-brand-400 underline underline-offset-2"
              >
                hello@savepin.app
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
}
