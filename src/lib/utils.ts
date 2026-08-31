import { type ClassValue, clsx } from "clsx";

// Simple cn utility (no tailwind-merge needed for basic usage)
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Format date
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

// Calculate reading time
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

// Generate slug from title
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Truncate text
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

// Get site URL
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://www.npftas.xyz";
}

// Get site name
export function getSiteName(): string {
  return process.env.NEXT_PUBLIC_SITE_NAME || "SavePin";
}
