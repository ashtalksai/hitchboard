import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { timelineItems, weddings } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { eq, and, asc } from "drizzle-orm";

async function verifyAccess(request: NextRequest, weddingId: string) {
  const user = await getCurrentUser(request);
  if (!user) return null;
  const [wedding] = await db.select().from(weddings).where(and(eq(weddings.id, weddingId), eq(weddings.userId, user.id)));
  return wedding ? user : null;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await verifyAccess(request, id);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await db.select().from(timelineItems).where(eq(timelineItems.weddingId, id)).orderBy(asc(timelineItems.order));
  return NextResponse.json(items);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await verifyAccess(request, id);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const [item] = await db.insert(timelineItems).values({
    weddingId: id,
    title: body.title,
    time: body.time,
    duration: body.duration,
    notes: body.notes,
    order: body.order ?? 0,
  }).returning();

  return NextResponse.json(item, { status: 201 });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await verifyAccess(request, id);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  if (Array.isArray(body)) {
    // Bulk reorder
    for (const item of body) {
      await db.update(timelineItems)
        .set({ order: item.order })
        .where(and(eq(timelineItems.id, item.id), eq(timelineItems.weddingId, id)));
    }
    const items = await db.select().from(timelineItems).where(eq(timelineItems.weddingId, id)).orderBy(asc(timelineItems.order));
    return NextResponse.json(items);
  }

  return NextResponse.json({ error: "Expected array for bulk update" }, { status: 400 });
}
