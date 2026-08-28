"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  faqs: FAQItem[];
  title?: string;
}

export function FAQAccordion({
  faqs,
  title = "Frequently Asked Questions",
}: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (faqs.length === 0) return null;

  return (
    <section className="w-full">
      <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-6">
        {title}
      </h2>
      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-surface-200 dark:border-surface-800 rounded-lg overflow-hidden"
          >
            <button
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
              className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-surface-900 dark:text-surface-100 hover:bg-surface-50 dark:hover:bg-surface-900/50 transition-colors"
              aria-expanded={openIndex === index}
            >
              <span className="pr-4">{faq.question}</span>
              <svg
                className={`w-5 h-5 flex-shrink-0 text-surface-400 transition-transform duration-200 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>
            {openIndex === index && (
              <div className="px-5 pb-4 text-sm text-surface-600 dark:text-surface-400 leading-relaxed border-t border-surface-200 dark:border-surface-800 pt-4">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
