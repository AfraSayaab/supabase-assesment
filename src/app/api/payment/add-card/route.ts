import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const { paymentMethodId, userId } = await request.json();
  const supabase = createRouteHandlerClient({ cookies });

  try {
    // Fetch user's Stripe customer ID
    const { data, error } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", userId)
      .single();

    if (error || !data?.stripe_customer_id) {
      throw new Error("User not found or Stripe ID missing");
    }

    // Attach the payment method to the customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: data.stripe_customer_id,
    });

    // Set the payment method as default for the customer
    await stripe.customers.update(data.stripe_customer_id, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
