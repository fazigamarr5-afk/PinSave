"use client";

import type { DownloadResult } from "@/types";

interface DownloaderResultProps {
  results: DownloadResult[];
}

export function DownloaderResult({ results }: DownloaderResultProps) {
  if (results.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-3">
        {results.length} file{results.length > 1 ? "s" : ""} found
      </h3>
      <div className="space-y-3">
        {results.map((result, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 rounded-xl border bg-white border-surface-200 dark:bg-surface-900 dark:border-surface-800"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
                {result.type === "video" && (
                  <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                  </svg>
                )}
                {result.type === "image" && (
                  <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25a1.5 1.5 0 001.5 1.5z" />
                  </svg>
                )}
                {result.type === "gif" && (
                  <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                  </svg>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">
                  {result.filename || `Pinterest ${result.type}`}
                </p>
                <p className="text-xs text-surface-500 dark:text-surface-400 capitalize">
                  {result.type}
                  {result.width && result.height && (
                    <span> · {result.width}×{result.height}</span>
                  )}
                </p>
              </div>
            </div>
            {result.url ? (
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="flex-shrink-0 ml-4 px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
              >
                Save
              </a>
            ) : (
              <span className="flex-shrink-0 ml-4 px-4 py-2 text-sm font-medium text-surface-400 bg-surface-100 rounded-lg dark:bg-surface-800 dark:text-surface-500">
                Unavailable
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
