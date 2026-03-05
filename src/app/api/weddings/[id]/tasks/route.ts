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

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await verifyAccess(request, id);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await db.select().from(tasks).where(eq(tasks.weddingId, id));
  return NextResponse.json(result);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await verifyAccess(request, id);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const [task] = await db.insert(tasks).values({
    weddingId: id,
    title: body.title,
    status: body.status ?? "todo",
    assignedTo: body.assignedTo,
  }).returning();

  return NextResponse.json(task, { status: 201 });
}
