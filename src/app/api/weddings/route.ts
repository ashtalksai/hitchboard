import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { weddings } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await db.select().from(weddings).where(eq(weddings.userId, user.id));
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const [wedding] = await db.insert(weddings).values({
    name: body.name,
    date: body.date ? new Date(body.date) : null,
    venue: body.venue,
    userId: user.id,
    tier: "free",
  }).returning();

  return NextResponse.json(wedding, { status: 201 });
}
