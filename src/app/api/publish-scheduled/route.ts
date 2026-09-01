import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * GET /api/publish-scheduled
 *
 * Cron-triggered endpoint that finds all draft posts with a scheduled_at
 * in the past and publishes them. Protected by a CRON_SECRET header.
 *
 * Vercel cron calls this every minute via vercel.json configuration.
 */
export async function GET(request: NextRequest) {
  // Verify this is a legitimate cron request
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = await createServiceClient();
    const now = new Date().toISOString();

    // Find all draft posts where scheduled_at has passed
    const { data: scheduledPosts, error: fetchError } = await supabase
      .from("posts")
      .select("id, title, slug, scheduled_at")
      .eq("status", "draft")
      .not("scheduled_at", "is", null)
      .lte("scheduled_at", now);

    if (fetchError) {
      console.error("Error fetching scheduled posts:", fetchError);
      return NextResponse.json(
        { error: fetchError.message },
        { status: 500 }
      );
    }

    if (!scheduledPosts || scheduledPosts.length === 0) {
      return NextResponse.json({
        message: "No posts to publish",
        published: 0,
      });
    }

    // Publish each post
    const results = [];
    for (const post of scheduledPosts) {
      const { error: updateError } = await supabase
        .from("posts")
        .update({
          status: "published",
          published_at: now,
          scheduled_at: null,
          updated_at: now,
        })
        .eq("id", post.id);

      if (updateError) {
        console.error(`Error publishing post ${post.slug}:`, updateError);
        results.push({ slug: post.slug, success: false, error: updateError.message });
      } else {
        console.log(`Published: ${post.title}`);
        results.push({ slug: post.slug, success: true });
      }
    }

    return NextResponse.json({
      message: `Published ${results.filter((r) => r.success).length} post(s)`,
      published: results.filter((r) => r.success).length,
      results,
    });
  } catch (error) {
    console.error("Publish scheduled error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
