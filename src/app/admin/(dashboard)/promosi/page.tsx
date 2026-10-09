import { db } from "@/server/db/client";
import { CouponsClientView } from "./CouponsClientView";

export const dynamic = "force-dynamic";

export default async function AdminPromosiPage() {
  const coupons = await db.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <CouponsClientView
      coupons={coupons as unknown as Parameters<typeof CouponsClientView>[0]["coupons"]}
    />
  );
}
