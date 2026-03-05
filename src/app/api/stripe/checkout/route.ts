import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getCurrentUser } from "@/lib/auth";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-02-24.acacia" as Stripe.LatestApiVersion });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { tier, weddingId } = await request.json();

  const priceId = tier === "standard"
    ? process.env.STRIPE_STANDARD_PRICE_ID
    : process.env.STRIPE_PREMIUM_PRICE_ID;

  if (!priceId) {
    return NextResponse.json({ error: "Price not configured" }, { status: 500 });
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    metadata: { userId: user.id, weddingId, tier },
  });

  return NextResponse.json({ url: session.url });
}
