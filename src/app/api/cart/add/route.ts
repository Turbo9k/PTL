import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // This is a placeholder. Cart is managed in localStorage on the client.
  return NextResponse.redirect("/cart");
} 