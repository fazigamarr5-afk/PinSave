"use client";

import { useState, useCallback } from "react";
import type { DownloaderState, DownloadResult } from "@/types";

interface UseDownloaderReturn {
  url: string;
  setUrl: (url: string) => void;
  state: DownloaderState;
  results: DownloadResult[];
  error: string | null;
  submit: () => Promise<void>;
  reset: () => void;
}

export function useDownloader(): UseDownloaderReturn {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<DownloaderState>("empty");
  const [results, setResults] = useState<DownloadResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setUrl("");
    setState("empty");
    setResults([]);
    setError(null);
  }, []);

  const submit = useCallback(async () => {
    if (!url.trim()) {
      setError("Please enter a Pinterest URL.");
      setState("error");
      return;
    }

    setState("validating");

    // Basic client-side URL validation
    const pinterestPattern =
      /^https?:\/\/(www\.)?(pinterest\.(com|ca|co\.\w+)|pin\.it)\/.+/;
    if (!pinterestPattern.test(url.trim())) {
      setError("Please enter a valid Pinterest URL.");
      setState("invalid");
      return;
    }

    setState("processing");
    setError(null);

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Something went wrong. Please try again.");
        setState("error");
        return;
      }

      if (data.data && data.data.length > 0) {
        setResults(data.data);
        setState("results");
      } else {
        setError("No downloadable content found at this URL.");
        setState("error");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
      setState("error");
    }
  }, [url]);

  return { url, setUrl, state, results, error, submit, reset };
}
