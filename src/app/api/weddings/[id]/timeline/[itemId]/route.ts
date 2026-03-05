import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { timelineItems, weddings } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

async function verifyAccess(request: NextRequest, weddingId: string) {
  const user = await getCurrentUser(request);
  if (!user) return null;
  const [wedding] = await db.select().from(weddings).where(and(eq(weddings.id, weddingId), eq(weddings.userId, user.id)));
  return wedding ? user : null;
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string; itemId: string }> }) {
  const { id, itemId } = await params;
  const user = await verifyAccess(request, id);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const [item] = await db.update(timelineItems)
    .set({
      ...(body.title && { title: body.title }),
      ...(body.time && { time: body.time }),
      ...(body.duration !== undefined && { duration: body.duration }),
      ...(body.notes !== undefined && { notes: body.notes }),
      ...(body.order !== undefined && { order: body.order }),
    })
    .where(and(eq(timelineItems.id, itemId), eq(timelineItems.weddingId, id)))
    .returning();

  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string; itemId: string }> }) {
  const { id, itemId } = await params;
  const user = await verifyAccess(request, id);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db.delete(timelineItems).where(and(eq(timelineItems.id, itemId), eq(timelineItems.weddingId, id)));
  return NextResponse.json({ success: true });
}
