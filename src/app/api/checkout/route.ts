import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-06-30.basil" });

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const cart = JSON.parse(formData.get("cart") as string);
  const line_items = cart.map((item: any) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
        images: item.imageUrl ? [item.imageUrl] : [],
      },
      unit_amount: item.price,
    },
    quantity: item.quantity,
  }));
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart?canceled=1`,
  });
  return NextResponse.redirect(session.url!);
} 