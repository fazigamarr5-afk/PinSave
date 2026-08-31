import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the SavePin team.",
};

export default function ContactPage() {
  return (
    <Container>
      <div className="py-12 max-w-3xl">
        <Breadcrumbs items={[{ label: "Contact", href: "/contact" }]} />

        <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-6">
          Contact Us
        </h1>

        <p className="text-surface-600 dark:text-surface-400 leading-relaxed mb-8">
          Have a question, suggestion, or issue? We&apos;d like to hear from you.
          Email us at{" "}
          <a
            href="mailto:hello@npftas.xyz"
            className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 underline underline-offset-2"
          >
            hello@npftas.xyz
          </a>
          .
        </p>

        <div className="p-6 rounded-xl border bg-surface-50 border-surface-200 dark:bg-surface-900 dark:border-surface-800">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
            Common inquiries
          </h2>
          <ul className="space-y-3 text-sm text-surface-600 dark:text-surface-400">
            <li>
              <strong className="text-surface-900 dark:text-surface-200">
                General questions:
              </strong>{" "}
              hello@npftas.xyz
            </li>
            <li>
              <strong className="text-surface-900 dark:text-surface-200">
                DMCA / copyright:
              </strong>{" "}
              hello@npftas.xyz
            </li>
            <li>
              <strong className="text-surface-900 dark:text-surface-200">
                Bug reports:
              </strong>{" "}
              hello@npftas.xyz
            </li>
          </ul>
        </div>
      </div>
    </Container>
  );
}
