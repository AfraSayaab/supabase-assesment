import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const { userId } = await request.json();
  const supabase = createRouteHandlerClient({ cookies });

  try {
    // Get user's Stripe customer ID
    const { data, error } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", userId)
      .single();

    if (error || !data?.stripe_customer_id) {
      throw new Error("User not found or Stripe ID missing");
    }

    // Retrieve payment methods from Stripe
    const paymentMethods = await stripe.paymentMethods.list({
      customer: data.stripe_customer_id,
      type: "card",
    });

    return NextResponse.json({ paymentMethods: paymentMethods.data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
