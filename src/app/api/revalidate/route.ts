import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * On-demand cache invalidation webhook.
 *
 * The backend calls this after admin mutations (e.g. category create/update/delete)
 * so the website reflects changes immediately instead of waiting for ISR expiry.
 *
 * POST /api/revalidate
 * Header: x-revalidate-secret: <REVALIDATE_SECRET>
 * Body:   { "tags": ["categories", "category-<id>"] }
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { tags?: unknown } | null;
  const tags = Array.isArray(body?.tags)
    ? body.tags.filter(
        (tag): tag is string => typeof tag === "string" && tag.length > 0 && tag.length <= 256,
      )
    : [];

  if (tags.length === 0) {
    return NextResponse.json({ ok: false, error: "No tags provided" }, { status: 400 });
  }

  // expire: 0 → the next request fetches fresh data instead of serving stale content.
  for (const tag of tags) {
    revalidateTag(tag, { expire: 0 });
  }

  return NextResponse.json({ ok: true, revalidated: tags, now: Date.now() });
}
