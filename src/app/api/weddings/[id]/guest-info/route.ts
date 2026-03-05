import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { weddings, timelineItems } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

// Public endpoint - no auth required
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [wedding] = await db.select({
    name: weddings.name,
    date: weddings.date,
    venue: weddings.venue,
  }).from(weddings).where(eq(weddings.id, id));

  if (!wedding) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const timeline = await db.select({
    title: timelineItems.title,
    time: timelineItems.time,
    duration: timelineItems.duration,
    notes: timelineItems.notes,
  }).from(timelineItems).where(eq(timelineItems.weddingId, id)).orderBy(asc(timelineItems.order));

  return NextResponse.json({ wedding, timeline });
}
