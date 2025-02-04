import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const { paymentMethodId } = await request.json();

  try {
    // Detach payment method from Stripe
    await stripe.paymentMethods.detach(paymentMethodId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
