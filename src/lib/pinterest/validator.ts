import type { PinterestUrlInfo } from "./types";

// Pinterest URL patterns
const PIN_PATTERN =
  /^https?:\/\/(www\.)?(pinterest\.(com|ca|co\.\w+)|pin\.it)\/.+$/;
const PIN_ID_PATTERN = /\/pin\/(\d+)/;
const PIN_IT_PATTERN = /pin\.it\/([a-zA-Z0-9]+)/;

export function validatePinterestUrl(url: string): PinterestUrlInfo {
  const trimmed = url.trim();

  if (!trimmed) {
    return {
      type: "unknown",
      pinId: null,
      url: trimmed,
      isValid: false,
      originalUrl: trimmed,
    };
  }

  // Check if it's a valid Pinterest URL
  if (!PIN_PATTERN.test(trimmed)) {
    return {
      type: "unknown",
      pinId: null,
      url: trimmed,
      isValid: false,
      originalUrl: trimmed,
    };
  }

  // Extract pin ID from standard pin URLs
  const pinIdMatch = trimmed.match(PIN_ID_PATTERN);
  if (pinIdMatch) {
    return {
      type: "pin",
      pinId: pinIdMatch[1],
      url: trimmed,
      isValid: true,
      originalUrl: trimmed,
    };
  }

  // Handle pin.it short URLs
  const pinItMatch = trimmed.match(PIN_IT_PATTERN);
  if (pinItMatch) {
    return {
      type: "pin",
      pinId: pinItMatch[1],
      url: trimmed,
      isValid: true,
      originalUrl: trimmed,
    };
  }

  // Detect content type hints from URL
  const lowerUrl = trimmed.toLowerCase();
  if (lowerUrl.includes("/video/")) {
    return {
      type: "video",
      pinId: null,
      url: trimmed,
      isValid: true,
      originalUrl: trimmed,
    };
  }

  if (lowerUrl.includes("/gif/")) {
    return {
      type: "gif",
      pinId: null,
      url: trimmed,
      isValid: true,
      originalUrl: trimmed,
    };
  }

  // Default to valid Pinterest URL
  return {
    type: "pin",
    pinId: pinIdMatch?.[1] || null,
    url: trimmed,
    isValid: true,
    originalUrl: trimmed,
  };
}

export function isPinterestUrl(url: string): boolean {
  return validatePinterestUrl(url).isValid;
}

export function extractPinId(url: string): string | null {
  const info = validatePinterestUrl(url);
  return info.pinId;
}
