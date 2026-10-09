import { NextResponse } from "next/server";
import { getCurrentCartCount } from "@/server/modules/cart/current";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const count = await getCurrentCartCount();
    return NextResponse.json({ count }, { headers: { "Cache-Control": "private, no-cache" } });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
