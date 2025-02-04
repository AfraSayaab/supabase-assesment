// app/api/auth/signup/route.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const supabase = createRouteHandlerClient({ cookies });

  try {
    // Create Supabase user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
      },
    });

    if (error) throw error;
    if (!data.user) throw new Error("User creation failed");

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email: data.user.email!,
      metadata: {
        supabase_id: data.user.id,
      },
    });

    // Update Supabase profile
    await supabase
      .from("profiles")
      .upsert({
        id: data.user.id,
        stripe_customer_id: customer.id,
        email: data.user.email,
      });

    return NextResponse.json({ user: data.user });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}