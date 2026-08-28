import type { PinterestUrlInfo, PinterestMedia } from "./types";
import { validatePinterestUrl } from "./validator";

/**
 * Parse a Pinterest URL and extract media information.
 *
 * NOTE: This parser works with publicly accessible Pinterest content.
 * It does not bypass authentication, private content restrictions,
 * or any access controls.
 */
export function parsePinterestUrl(url: string): PinterestUrlInfo {
  return validatePinterestUrl(url);
}

/**
 * Extract media URLs from Pinterest page HTML.
 *
 * This is a best-effort parser for publicly available content.
 * Pinterest may change their page structure at any time.
 */
export function extractMediaFromHtml(
  html: string,
  requestedType?: "video" | "image" | "gif"
): PinterestMedia[] {
  const media: PinterestMedia[] = [];

  // Try to find video sources
  if (!requestedType || requestedType === "video") {
    const videoRegex =
      /https?:\/\/[^"'\s]+\.mp4[^"'\s]*/gi;
    const videoMatches = html.match(videoRegex) || [];
    for (const url of videoMatches) {
      if (!media.some((m) => m.url === url)) {
        media.push({ url, type: "video" });
      }
    }
  }

  // Try to find image sources (high-res)
  if (!requestedType || requestedType === "image") {
    const imageRegex =
      /https?:\/\/i\.pinimg\.com\/(?:originals|736x|564x)\/[^"'\s]+\.(jpg|jpeg|png|webp)/gi;
    const imageMatches = html.match(imageRegex) || [];
    for (const url of imageMatches) {
      if (!media.some((m) => m.url === url)) {
        media.push({ url, type: "image" });
      }
    }
  }

  // Try to find GIF sources
  if (!requestedType || requestedType === "gif") {
    const gifRegex =
      /https?:\/\/i\.pinimg\.com\/(?:originals|736x|564x)\/[^"'\s]+\.gif/gi;
    const gifMatches = html.match(gifRegex) || [];
    for (const url of gifMatches) {
      if (!media.some((m) => m.url === url)) {
        media.push({ url, type: "gif" });
      }
    }
  }

  return media;
}

/**
 * Get the best quality URL from a list of media items.
 */
export function getBestQualityUrl(media: PinterestMedia[]): string | null {
  if (media.length === 0) return null;

  // Prefer originals, then highest resolution
  const sorted = [...media].sort((a, b) => {
    if (a.url.includes("/originals/")) return -1;
    if (b.url.includes("/originals/")) return 1;
    if (a.url.includes("/736x/")) return -1;
    if (b.url.includes("/736x/")) return 1;
    return 0;
  });

  return sorted[0].url;
}
