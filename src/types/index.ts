// Database types
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "admin" | "editor";
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  author_id: string;
  status: "draft" | "published" | "unpublished";
  seo_title: string | null;
  seo_description: string | null;
  canonical_url: string | null;
  indexable: boolean;
  reading_time: number | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface ToolPage {
  id: string;
  slug: string;
  name: string;
  title: string;
  description: string;
  content: string;
  seo_title: string | null;
  seo_description: string | null;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: string;
  tool_page_id: string | null;
  question: string;
  answer: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

// Pinterest types
export interface PinterestUrlInfo {
  type: "video" | "image" | "gif" | "board" | "pin" | "unknown";
  pinId: string | null;
  url: string;
  isValid: boolean;
}

export interface DownloadResult {
  success: boolean;
  url: string | null;
  filename: string | null;
  type: "video" | "image" | "gif";
  width?: number;
  height?: number;
  error?: string;
}

export type DownloaderState =
  | "empty"
  | "entering"
  | "validating"
  | "processing"
  | "results"
  | "error"
  | "invalid";

// API types
export interface DownloadRequest {
  url: string;
  type?: "video" | "image" | "gif";
}

export interface DownloadResponse {
  success: boolean;
  data?: DownloadResult[];
  error?: string;
}
