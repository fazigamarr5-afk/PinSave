import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-6xl font-bold text-surface-200 dark:text-surface-800">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold text-surface-900 dark:text-white">
          Page not found
        </h1>
        <p className="mt-2 text-surface-500 dark:text-surface-400 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8">
          <Link href="/">
            <Button>Go home</Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}
