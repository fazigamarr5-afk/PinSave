import { NextRequest, NextResponse } from "next/server";
import { downloadPinterestMedia } from "@/lib/pinterest";
import type { DownloadResult } from "@/types";

// Simple in-memory rate limiting (per IP, resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 20; // 20 requests per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { success: false, error: "Please provide a URL." },
        { status: 400 }
      );
    }

    // Rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests. Please wait a moment and try again.",
        },
        { status: 429 }
      );
    }

    // Download media
    const result = await downloadPinterestMedia(url.trim());

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    // Convert to client-friendly format
    const data: DownloadResult[] = result.media.map((media) => ({
      success: true,
      url: media.url,
      filename:
        media.filename ||
        `pinterest-${media.type}-${Date.now()}.${
          media.type === "video" ? "mp4" : media.type === "gif" ? "gif" : "jpg"
        }`,
      type: media.type,
      width: media.width,
      height: media.height,
    }));

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
