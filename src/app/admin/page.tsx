import Link from "next/link";
import { db } from "@/server/db/client";
import { formatRupiah } from "@/lib/money";

export const dynamic = "force-dynamic";

type RecentOrder = {
  id: string;
  publicNumber: string;
  status: string;
  grandTotalIdr: number;
  createdAt: Date;
  shippingAddress: unknown;
};

export default async function AdminDashboardPage() {
  // Query metric data safely
  let toProcess = 0;
  let packed = 0;
  let awaitingPayment = 0;
  let paymentExceptions = 0;
  let refundsOpen = 0;
  let lowStockCount = 0;
  let recentOrders: RecentOrder[] = [];
  let totalSalesIdr = 0;

  try {
    const [tp, pk, ap, pe, ro, ls, rec, sumSales] = await Promise.all([
      db.order.count({ where: { status: { in: ["paid", "processing"] } } }),
      db.order.count({ where: { status: "packed" } }),
      db.order.count({ where: { status: "pending_payment" } }),
      db.order.count({ where: { status: "payment_exception" } }),
      db.refund.count({ where: { status: { in: ["pending", "processing"] } } }),
      db.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(*) AS count FROM "app"."ProductVariant"
         WHERE "status" = 'active' AND "fulfillmentMode" = 'ready_stock'
           AND "stockOnHand" - "stockReserved" <= COALESCE("lowStockThreshold", 2)
      `.catch(() => [{ count: BigInt(0) }]),
      db.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          publicNumber: true,
          status: true,
          grandTotalIdr: true,
          createdAt: true,
          shippingAddress: true,
        },
      }),
      db.order.aggregate({
        where: { paymentStatus: "paid" },
        _sum: { grandTotalIdr: true },
      }),
    ]);

    toProcess = tp;
    packed = pk;
    awaitingPayment = ap;
    paymentExceptions = pe;
    refundsOpen = ro;
    lowStockCount = Number(ls[0]?.count ?? 0);
    recentOrders = rec;
    totalSalesIdr = sumSales._sum.grandTotalIdr ?? 0;
  } catch (err) {
    console.error("[admin:dashboardSummary]", err);
  }

  const kpis = [
    {
      title: "Perlu Diproses (Lunas)",
      value: toProcess,
      desc: "Pesanan lunas menunggu picking & packing",
      href: "/admin/pesanan?status=paid",
      alert: toProcess > 0,
      badge: "Prioritas",
    },
    {
      title: "Siap Dikirim (Packed)",
      value: packed,
      desc: "Paket siap ditempel resi dan dijemput kurir",
      href: "/admin/pesanan?status=packed",
      alert: false,
    },
    {
      title: "Stok Menipis / Habis",
      value: lowStockCount,
      desc: "SKU varian di bawah batas minimum stok",
      href: "/admin/katalog",
      alert: lowStockCount > 0,
    },
    {
      title: "Menunggu Pembayaran",
      value: awaitingPayment,
      desc: "Checkout aktif dalam masa reservasi 30 menit",
      href: "/admin/pesanan?status=pending_payment",
      alert: false,
    },
    {
      title: "Kasus Refund / Pembayaran",
      value: refundsOpen + paymentExceptions,
      desc: "Pengajuan refund atau webhook tertunda",
      href: "/admin/keuangan",
      alert: refundsOpen + paymentExceptions > 0,
      badge: "Perhatian",
    },
    {
      title: "Total Omzet Lunas",
      value: formatRupiah(totalSalesIdr),
      desc: "Akumulasi pembayaran terverifikasi sah",
      href: "/admin/keuangan",
      alert: false,
      isMoney: true,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <span className="text-caption font-bold tracking-wider text-accent uppercase">Ringkasan Operasional</span>
        <h1 className="mt-1 text-display font-bold text-ink">Dashboard Staf</h1>
        <p className="mt-1 text-small text-muted">
          Pantau antrean fulfillment fisik, reservasi stok, dan verifikasi finansial secara real-time.
        </p>
      </div>

      {/* KPI Tiles */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((k, i) => (
          <Link
            key={i}
            href={k.href}
            className={`group rounded-card border p-5 shadow-low transition-all hover:shadow-medium ${
              k.alert ? "border-accent bg-paper-2/60" : "border-rule bg-surface"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-small font-bold text-ink">{k.title}</span>
              {k.badge ? (
                <span className="rounded-pill bg-accent px-2 py-0.5 text-caption font-bold text-ink-inverse">
                  {k.badge}
                </span>
              ) : null}
            </div>
            <div className="mt-3">
              <span className="text-h1 font-black text-ink">{k.value}</span>
            </div>
            <p className="mt-2 text-caption text-muted">{k.desc}</p>
          </Link>
        ))}
      </div>

      {/* Antrean Pesanan Terbaru */}
      <div className="rounded-card border border-rule bg-surface p-6 shadow-low">
        <div className="flex items-center justify-between border-b border-rule pb-4">
          <div>
            <h2 className="text-h3 font-bold text-ink">Pesanan Terbaru Masuk</h2>
            <p className="text-caption text-muted">5 transaksi pesanan terakhir yang dicatat sistem</p>
          </div>
          <Link href="/admin/pesanan" className="text-small font-bold text-accent hover:underline">
            Lihat Semua Pesanan →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="py-8 text-center text-small text-muted">Belum ada data transaksi pesanan.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-small">
              <thead>
                <tr className="border-b border-rule font-bold text-ink">
                  <th className="py-2.5">Nomor Pesanan</th>
                  <th className="py-2.5">Penerima</th>
                  <th className="py-2.5">Tanggal</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Total</th>
                  <th className="py-2.5 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule text-muted">
                {recentOrders.map((o) => {
                  const addr = o.shippingAddress as { recipientName?: string };
                  return (
                    <tr key={o.id} className="hover:bg-paper-2/40">
                      <td className="py-3 font-mono font-bold text-ink">{o.publicNumber}</td>
                      <td className="py-3 text-ink">{addr?.recipientName || "—"}</td>
                      <td className="py-3 text-caption">
                        {new Date(o.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3">
                        <span className="rounded-pill bg-paper-2 px-2.5 py-0.5 text-caption font-bold text-accent">
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 text-right font-medium text-ink tabular">
                        {formatRupiah(o.grandTotalIdr)}
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/admin/pesanan/${o.id}`}
                          className="font-bold text-accent hover:underline"
                        >
                          Kelola
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
