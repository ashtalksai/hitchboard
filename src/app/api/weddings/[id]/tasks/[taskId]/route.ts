import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tasks, weddings } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

async function verifyAccess(request: NextRequest, weddingId: string) {
  const user = await getCurrentUser(request);
  if (!user) return null;
  const [wedding] = await db.select().from(weddings).where(and(eq(weddings.id, weddingId), eq(weddings.userId, user.id)));
  return wedding ? user : null;
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string; taskId: string }> }) {
  const { id, taskId } = await params;
  const user = await verifyAccess(request, id);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const [task] = await db.update(tasks)
    .set({
      ...(body.title && { title: body.title }),
      ...(body.status && { status: body.status }),
      ...(body.assignedTo !== undefined && { assignedTo: body.assignedTo }),
    })
    .where(and(eq(tasks.id, taskId), eq(tasks.weddingId, id)))
    .returning();

  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(task);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string; taskId: string }> }) {
  const { id, taskId } = await params;
  const user = await verifyAccess(request, id);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db.delete(tasks).where(and(eq(tasks.id, taskId), eq(tasks.weddingId, id)));
  return NextResponse.json({ success: true });
}
