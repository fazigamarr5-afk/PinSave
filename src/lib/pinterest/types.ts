export interface PinterestUrlInfo {
  type: "video" | "image" | "gif" | "board" | "pin" | "unknown";
  pinId: string | null;
  url: string;
  isValid: boolean;
  originalUrl: string;
}

export interface PinterestMedia {
  url: string;
  type: "video" | "image" | "gif";
  width?: number;
  height?: number;
  filename?: string;
}

export interface DownloadResult {
  success: boolean;
  media: PinterestMedia[];
  error?: string;
}
