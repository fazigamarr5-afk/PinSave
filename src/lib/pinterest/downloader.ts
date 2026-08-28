import type { PinterestUrlInfo, PinterestMedia, DownloadResult } from "./types";
import { validatePinterestUrl } from "./validator";
import { extractMediaFromHtml, getBestQualityUrl } from "./parser";

/**
 * Download provider interface.
 * Implement this to plug in a third-party Pinterest download API.
 */
export interface DownloadProvider {
  name: string;
  fetchMedia(url: string): Promise<DownloadResult>;
}

/**
 * Built-in provider that works with publicly accessible Pinterest pages.
 *
 * IMPORTANT: This provider only processes publicly available content.
 * It does not bypass authentication, private content restrictions,
 * DRM, paywalls, or other access controls.
 *
 * If a reliable third-party API is needed, implement the DownloadProvider
 * interface and swap it in via the configureProvider() function.
 */
class PublicPageProvider implements DownloadProvider {
  name = "public-page";

  async fetchMedia(url: string): Promise<DownloadResult> {
    const urlInfo = validatePinterestUrl(url);

    if (!urlInfo.isValid) {
      return {
        success: false,
        media: [],
        error: "Invalid Pinterest URL. Please enter a valid Pinterest link.",
      };
    }

    try {
      // Fetch the Pinterest page HTML
      const response = await fetch(urlInfo.url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "en-US,en;q=0.9",
        },
        next: { revalidate: 0 },
      });

      if (!response.ok) {
        return {
          success: false,
          media: [],
          error: "Unable to access this Pinterest page. It may be private or unavailable.",
        };
      }

      const html = await response.text();
      const media = extractMediaFromHtml(html);

      if (media.length === 0) {
        return {
          success: false,
          media: [],
          error:
            "No downloadable media found on this page. The content may be restricted or in an unsupported format.",
        };
      }

      return { success: true, media };
    } catch {
      return {
        success: false,
        media: [],
        error:
          "Failed to process this URL. Please check your connection and try again.",
      };
    }
  }
}

// Current provider (replaceable)
let currentProvider: DownloadProvider = new PublicPageProvider();

/**
 * Configure the download provider.
 * Use this to swap in a third-party API provider.
 */
export function configureProvider(provider: DownloadProvider) {
  currentProvider = provider;
}

/**
 * Get the current download provider.
 */
export function getProvider(): DownloadProvider {
  return currentProvider;
}

/**
 * Main download function.
 */
export async function downloadPinterestMedia(
  url: string,
  type?: "video" | "image" | "gif"
): Promise<DownloadResult> {
  const urlInfo = validatePinterestUrl(url);

  if (!urlInfo.isValid) {
    return {
      success: false,
      media: [],
      error: "Please enter a valid Pinterest URL.",
    };
  }

  const result = await currentProvider.fetchMedia(url);

  if (!result.success || !type) {
    return result;
  }

  // Filter by requested type
  const filtered = result.media.filter((m) => m.type === type);

  if (filtered.length === 0) {
    return {
      success: false,
      media: [],
      error: `No ${type} content found at this URL.`,
    };
  }

  return { ...result, media: filtered };
}

export { getBestQualityUrl };
