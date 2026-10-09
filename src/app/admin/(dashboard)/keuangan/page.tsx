import { db } from "@/server/db/client";
import { FinanceClientView } from "./FinanceClientView";

export const dynamic = "force-dynamic";

export default async function AdminKeuanganPage() {
  const [ordersAgg, refundsAgg, payments, refunds] = await Promise.all([
    db.order.aggregate({
      where: { paymentStatus: "paid" },
      _count: { _all: true },
      _sum: { grandTotalIdr: true },
    }),
    db.refund.aggregate({
      where: { status: "succeeded" },
      _sum: { amountIdr: true },
    }),
    db.paymentAttempt.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: {
        order: { select: { publicNumber: true } },
      },
    }),
    db.refund.findMany({
      where: { status: { in: ["pending", "processing"] } },
      orderBy: { createdAt: "desc" },
      include: {
        order: { select: { publicNumber: true } },
      },
    }),
  ]);

  const grossIdr = ordersAgg._sum.grandTotalIdr ?? 0;
  const refundedIdr = refundsAgg._sum.amountIdr ?? 0;

  return (
    <FinanceClientView
      summary={{
        grossIdr,
        refundedIdr,
        netIdr: grossIdr - refundedIdr,
        paidCount: ordersAgg._count._all,
      }}
      payments={payments as unknown as Parameters<typeof FinanceClientView>[0]["payments"]}
      refunds={refunds as unknown as Parameters<typeof FinanceClientView>[0]["refunds"]}
    />
  );
}
