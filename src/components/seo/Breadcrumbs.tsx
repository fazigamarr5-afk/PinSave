import Link from "next/link";
import { BreadcrumbJsonLd } from "./JsonLd";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const allItems = [{ label: "Home", href: "/" }, ...items];

  const jsonLdItems = items.map((item) => ({
    name: item.label,
    url: item.href,
  }));

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", url: "/" }, ...jsonLdItems]} />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center flex-wrap gap-1 text-sm text-surface-500 dark:text-surface-400">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-1">
                {index > 0 && (
                  <svg
                    className="w-3.5 h-3.5 text-surface-300 dark:text-surface-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                )}
                {isLast ? (
                  <span className="text-surface-900 dark:text-surface-100 font-medium">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-surface-900 dark:hover:text-surface-100 transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
