import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vendors, weddings } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

async function verifyAccess(request: NextRequest, weddingId: string) {
  const user = await getCurrentUser(request);
  if (!user) return null;
  const [wedding] = await db.select().from(weddings).where(and(eq(weddings.id, weddingId), eq(weddings.userId, user.id)));
  return wedding ? user : null;
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string; vendorId: string }> }) {
  const { id, vendorId } = await params;
  const user = await verifyAccess(request, id);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const [vendor] = await db.update(vendors)
    .set({
      ...(body.name && { name: body.name }),
      ...(body.role !== undefined && { role: body.role }),
      ...(body.phone !== undefined && { phone: body.phone }),
      ...(body.email !== undefined && { email: body.email }),
      ...(body.notes !== undefined && { notes: body.notes }),
    })
    .where(and(eq(vendors.id, vendorId), eq(vendors.weddingId, id)))
    .returning();

  if (!vendor) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(vendor);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string; vendorId: string }> }) {
  const { id, vendorId } = await params;
  const user = await verifyAccess(request, id);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db.delete(vendors).where(and(eq(vendors.id, vendorId), eq(vendors.weddingId, id)));
  return NextResponse.json({ success: true });
}
