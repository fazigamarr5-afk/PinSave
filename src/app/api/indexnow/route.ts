import { NextRequest, NextResponse } from "next/server";

const INDEXNOW_KEY = "e7df08b327297b7b1fdf14c1d29807337ffe3b58d36d4a11f552e820778dcced";
const HOST = "npftas.xyz";

// Search engines that support IndexNow
const ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, urls } = body;

    // Build the list of URLs to submit
    const urlList = urls || (url ? [url] : []);

    if (urlList.length === 0) {
      return NextResponse.json({ error: "No URLs provided" }, { status: 400 });
    }

    // Make URLs absolute if they're relative
    const absoluteUrls = urlList.map((u: string) =>
      u.startsWith("http") ? u : `https://${HOST}${u}`
    );

    const payload = {
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
      urlList: absoluteUrls,
    };

    // Submit to all IndexNow endpoints
    const results = await Promise.allSettled(
      ENDPOINTS.map(async (endpoint) => {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify(payload),
        });
        return { endpoint, status: res.status };
      })
    );

    return NextResponse.json({
      success: true,
      submitted: absoluteUrls,
      results: results.map((r) =>
        r.status === "fulfilled" ? r.value : { error: r.reason?.message }
      ),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to submit to IndexNow" },
      { status: 500 }
    );
  }
}
