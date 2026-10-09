import { db } from "@/server/db/client";
import { CatalogClientView } from "./CatalogClientView";

export const dynamic = "force-dynamic";

export default async function AdminKatalogPage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true } },
      variants: {
        select: {
          id: true,
          sku: true,
          stockOnHand: true,
          stockReserved: true,
          priceIdr: true,
          status: true,
        },
      },
    },
  });

  return (
    <CatalogClientView
      initialProducts={products as unknown as Parameters<typeof CatalogClientView>[0]["initialProducts"]}
    />
  );
}
