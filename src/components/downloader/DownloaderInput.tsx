"use client";

import { useState, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/Button";

interface DownloaderInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  placeholder?: string;
}

export function DownloaderInput({
  value,
  onChange,
  onSubmit,
  loading = false,
  placeholder = "Paste Pinterest URL here...",
}: DownloaderInputProps) {
  const [pasteSuccess, setPasteSuccess] = useState(false);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
      setPasteSuccess(true);
      setTimeout(() => setPasteSuccess(false), 2000);
    } catch {
      // Clipboard API not available or denied
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full px-4 py-3.5 pr-20 text-base rounded-xl border bg-white text-surface-900 placeholder:text-surface-400 border-surface-300 hover:border-surface-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-colors dark:bg-surface-900 dark:text-surface-100 dark:placeholder:text-surface-500 dark:border-surface-700 dark:hover:border-surface-600 dark:focus:border-brand-500"
            aria-label="Pinterest URL"
          />
          <button
            onClick={handlePaste}
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-medium text-surface-500 hover:text-surface-700 hover:bg-surface-100 rounded-md transition-colors dark:text-surface-400 dark:hover:text-surface-200 dark:hover:bg-surface-800"
            aria-label="Paste from clipboard"
          >
            {pasteSuccess ? "✓ Pasted" : "Paste"}
          </button>
        </div>
        <Button
          onClick={onSubmit}
          loading={loading}
          size="lg"
          className="sm:px-8"
        >
          Download
        </Button>
      </div>
    </div>
  );
}
