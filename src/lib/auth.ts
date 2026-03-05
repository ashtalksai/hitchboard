import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { type NextRequest } from "next/server";

// Simple session-based auth using cookies
// In production, use next-auth with proper JWT/session management

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

export function createSessionToken(userId: string): string {
  // Simple base64 encoding of userId + timestamp for demo
  // In production, use proper JWT
  const payload = JSON.stringify({ userId, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 });
  return btoa(payload);
}

export function parseSessionToken(token: string): { userId: string } | null {
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp < Date.now()) return null;
    return { userId: payload.userId };
  } catch {
    return null;
  }
}

export async function getCurrentUser(request: NextRequest) {
  const token = request.cookies.get("session")?.value;
  if (!token) return null;

  const session = parseSessionToken(token);
  if (!session) return null;

  const [user] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);
  return user || null;
}
