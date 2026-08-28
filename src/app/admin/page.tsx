import Link from "next/link";

const stats = [
  {
    label: "Published Posts",
    value: "—",
    href: "/admin/posts",
    description: "Blog articles live on the site",
  },
  {
    label: "Draft Posts",
    value: "—",
    href: "/admin/posts",
    description: "Articles in progress",
  },
  {
    label: "Tool Pages",
    value: "3",
    href: "/admin/tools",
    description: "Active downloader tools",
  },
  {
    label: "FAQs",
    value: "—",
    href: "/admin/faqs",
    description: "Published FAQ items",
  },
];

const quickActions = [
  { label: "New blog post", href: "/admin/posts/new" },
  { label: "Edit tool pages", href: "/admin/tools" },
  { label: "Manage FAQs", href: "/admin/faqs" },
  { label: "Site settings", href: "/admin/settings" },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-8">
        Dashboard
      </h1>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="p-5 rounded-xl border bg-white border-surface-200 hover:border-surface-300 transition-colors dark:bg-surface-900 dark:border-surface-800 dark:hover:border-surface-700"
          >
            <p className="text-sm text-surface-500 dark:text-surface-400">
              {stat.label}
            </p>
            <p className="mt-1 text-3xl font-bold text-surface-900 dark:text-white">
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-surface-400 dark:text-surface-500">
              {stat.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-2 p-4 rounded-xl border bg-white border-surface-200 hover:border-brand-300 hover:bg-brand-50 transition-all dark:bg-surface-900 dark:border-surface-800 dark:hover:border-brand-700 dark:hover:bg-brand-900/10 text-sm font-medium text-surface-700 dark:text-surface-300"
            >
              <svg className="w-4 h-4 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
