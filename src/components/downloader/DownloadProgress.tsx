export function DownloadProgress() {
  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <div className="flex items-center justify-center gap-3 p-6 rounded-xl border bg-white border-surface-200 dark:bg-surface-900 dark:border-surface-800">
        <div className="relative">
          <div className="w-8 h-8 border-3 border-surface-200 dark:border-surface-700 rounded-full" />
          <div className="absolute inset-0 w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <div>
          <p className="text-sm font-medium text-surface-900 dark:text-surface-100">
            Processing your URL...
          </p>
          <p className="text-xs text-surface-500 dark:text-surface-400">
            Fetching media from Pinterest
          </p>
        </div>
      </div>
    </div>
  );
}
