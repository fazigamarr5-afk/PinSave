import Link from "next/link";

const toolPages = [
  {
    id: "1",
    slug: "pinterest-video-downloader",
    name: "Pinterest Video Downloader",
    status: "published",
  },
  {
    id: "2",
    slug: "pinterest-image-downloader",
    name: "Pinterest Image Downloader",
    status: "published",
  },
  {
    id: "3",
    slug: "pinterest-gif-downloader",
    name: "Pinterest GIF Downloader",
    status: "published",
  },
];

export default function AdminToolsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-8">
        Tool Pages
      </h1>

      <div className="space-y-3">
        {toolPages.map((tool) => (
          <div
            key={tool.id}
            className="flex items-center justify-between p-4 rounded-xl border bg-white border-surface-200 dark:bg-surface-900 dark:border-surface-800"
          >
            <div>
              <h3 className="font-medium text-surface-900 dark:text-white">
                {tool.name}
              </h3>
              <p className="text-xs text-surface-400 dark:text-surface-500">
                /{tool.slug} · {tool.status}
              </p>
            </div>
            <Link
              href={`/admin/tools/${tool.id}/edit`}
              className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
