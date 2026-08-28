import { NextRequest, NextResponse } from "next/server";

// Proxy download route — fetches cross-origin media and streams it as a download
// This bypasses browser restrictions on the `download` attribute for cross-origin URLs

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get("url");
    const filename = searchParams.get("filename") || "pinterest-download";

    if (!fileUrl) {
      return NextResponse.json(
        { error: "Missing url parameter." },
        { status: 400 }
      );
    }

    // Only allow downloading from known Pinterest CDN domains
    const allowedHosts = [
      "i.pinimg.com",
      "pinimg.com",
      "v.pinimg.com",
      "media-ec-pi.pinterest.com",
      "video.pinimg.com",
    ];

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(fileUrl);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL." },
        { status: 400 }
      );
    }

    const isAllowed = allowedHosts.some(
      (host) => parsedUrl.hostname === host || parsedUrl.hostname.endsWith("." + host)
    );

    if (!isAllowed) {
      return NextResponse.json(
        { error: "Only Pinterest media URLs are allowed." },
        { status: 403 }
      );
    }

    // Fetch the file from Pinterest's CDN
    const response = await fetch(fileUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://www.pinterest.com/",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch the file. It may be unavailable." },
        { status: 502 }
      );
    }

    const contentType = response.headers.get("content-type") || "";
    const contentLength = response.headers.get("content-length");

    // Build a safe filename with proper extension
    let safeFilename = filename.replace(/[^a-zA-Z0-9_\-.]/g, "_");
    if (!safeFilename.includes(".")) {
      if (contentType.includes("video")) safeFilename += ".mp4";
      else if (contentType.includes("gif")) safeFilename += ".gif";
      else if (contentType.includes("png")) safeFilename += ".png";
      else safeFilename += ".jpg";
    }

    // Stream the response back to the client as a download
    const headers = new Headers();
    headers.set("Content-Type", contentType || "application/octet-stream");
    if (contentLength) headers.set("Content-Length", contentLength);
    headers.set(
      "Content-Disposition",
      `attachment; filename="${safeFilename}"`
    );
    headers.set("Cache-Control", "no-cache");

    return new NextResponse(response.body, {
      status: 200,
      headers,
    });
  } catch {
    return NextResponse.json(
      { error: "Download failed. Please try again." },
      { status: 500 }
    );
  }
}
