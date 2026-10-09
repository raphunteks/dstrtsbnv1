import { notFound } from "next/navigation";
import { db } from "@/server/db/client";
import { OrderDetailClientView } from "./OrderDetailClientView";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
    include: {
      items: true,
      shipments: { orderBy: { createdAt: "desc" } },
      refunds: { orderBy: { createdAt: "desc" } },
      paymentAttempts: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <OrderDetailClientView
      order={order as unknown as Parameters<typeof OrderDetailClientView>[0]["order"]}
    />
  );
}
