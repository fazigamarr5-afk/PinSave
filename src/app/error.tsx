"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-6xl font-bold text-surface-200 dark:text-surface-800">
          !
        </p>
        <h1 className="mt-4 text-2xl font-bold text-surface-900 dark:text-white">
          Something went wrong
        </h1>
        <p className="mt-2 text-surface-500 dark:text-surface-400 max-w-md">
          An unexpected error occurred. Please try again.
        </p>
        <div className="mt-8">
          <Button onClick={reset}>Try again</Button>
        </div>
      </div>
    </Container>
  );
}
