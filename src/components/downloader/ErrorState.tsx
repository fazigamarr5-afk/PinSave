"use client";

interface ErrorStateProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorState({ message, onDismiss }: ErrorStateProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <div className="flex items-start gap-3 p-4 rounded-xl border bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/50">
        <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-red-800 dark:text-red-300">
            {message}
          </p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            aria-label="Dismiss error"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
