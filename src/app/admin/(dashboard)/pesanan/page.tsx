import { db } from "@/server/db/client";
import { OrdersClientList } from "./OrdersClientList";

export const dynamic = "force-dynamic";

export default async function AdminPesananPage() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      publicNumber: true,
      status: true,
      paymentStatus: true,
      fulfillmentStatus: true,
      grandTotalIdr: true,
      createdAt: true,
      shippingAddress: true,
      items: {
        select: {
          id: true,
          productNameSnap: true,
          quantity: true,
        },
      },
    },
  });

  return (
    <OrdersClientList
      initialOrders={orders as unknown as Parameters<typeof OrdersClientList>[0]["initialOrders"]}
    />
  );
}
