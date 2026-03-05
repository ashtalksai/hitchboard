import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { weddings } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const [wedding] = await db.select().from(weddings).where(and(eq(weddings.id, id), eq(weddings.userId, user.id)));
  if (!wedding) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(wedding);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const [wedding] = await db.update(weddings)
    .set({
      ...(body.name && { name: body.name }),
      ...(body.date && { date: new Date(body.date) }),
      ...(body.venue !== undefined && { venue: body.venue }),
    })
    .where(and(eq(weddings.id, id), eq(weddings.userId, user.id)))
    .returning();

  if (!wedding) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(wedding);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.delete(weddings).where(and(eq(weddings.id, id), eq(weddings.userId, user.id)));
  return NextResponse.json({ success: true });
}
