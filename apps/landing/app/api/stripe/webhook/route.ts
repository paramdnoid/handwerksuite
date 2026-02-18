import { NextResponse } from "next/server";
import {
  constructWebhookEvent,
  handleWebhookEvent,
} from "@zunftgewerk/stripe/webhooks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  try {
    const event = constructWebhookEvent(body, signature);
    await handleWebhookEvent(event);
    return NextResponse.json({ received: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Webhook processing failed";
    console.error("[Stripe Webhook] Error:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
