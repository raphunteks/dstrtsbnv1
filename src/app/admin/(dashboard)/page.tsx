import Link from "next/link";
import { db } from "@/server/db/client";
import { formatRupiah } from "@/lib/money";
import {
  DashboardCharts,
  type DailySalesPoint,
  type StatusDistributionPoint,
  type CategoryDistributionPoint,
} from "@/components/admin/DashboardCharts";
import {
  Clock,
  PackageCheck,
  Truck,
  AlertTriangle,
  CreditCard,
  Wallet,
  ShoppingBag,
  ArrowUpRight,
  TrendingUp,
  Package,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

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
  let toProcess = 0;
  let packed = 0;
  let shipped = 0;
  let completed = 0;
  let cancelled = 0;
  let awaitingPayment = 0;
  let paymentExceptions = 0;
  let refundsOpen = 0;
  let lowStockCount = 0;
  let recentOrders: RecentOrder[] = [];
  let totalSalesIdr = 0;
  let totalOrdersCount = 0;

  // 14-day trend array
  const today = new Date();
  const fourteenDaysAgo = new Date(today);
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13);
  fourteenDaysAgo.setHours(0, 0, 0, 0);

  let salesTrend: DailySalesPoint[] = [];
  let categoryDistribution: CategoryDistributionPoint[] = [];

  try {
    const [
      tp,
      pk,
      sh,
      cp,
      cn,
      ap,
      pe,
      ro,
      ls,
      rec,
      sumSales,
      totOrders,
      ordersLast14Days,
      categoriesWithCount,
    ] = await Promise.all([
      db.order.count({ where: { status: { in: ["paid", "processing"] } } }),
      db.order.count({ where: { status: "packed" } }),
      db.order.count({ where: { status: "shipped" } }),
      db.order.count({ where: { status: { in: ["delivered", "completed"] } } }),
      db.order.count({ where: { status: "cancelled" } }),
      db.order.count({ where: { status: "pending_payment" } }),
      db.order.count({ where: { status: "payment_exception" } }),
      db.refund.count({ where: { status: { in: ["pending", "processing"] } } }),
      db.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(*) AS count FROM "app"."ProductVariant"
         WHERE "status" = 'active' AND "fulfillmentMode" = 'ready_stock'
           AND "stockOnHand" - "stockReserved" <= COALESCE("lowStockThreshold", 2)
      `.catch(() => [{ count: BigInt(0) }]),
      db.order.findMany({
        take: 6,
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
      db.order.count(),
      db.order.findMany({
        where: { createdAt: { gte: fourteenDaysAgo } },
        select: { createdAt: true, grandTotalIdr: true, paymentStatus: true },
      }),
      db.category.findMany({
        where: { status: "active" },
        select: {
          name: true,
          _count: {
            select: { products: { where: { status: "published" } } },
          },
        },
      }),
    ]);

    toProcess = tp;
    packed = pk;
    shipped = sh;
    completed = cp;
    cancelled = cn;
    awaitingPayment = ap;
    paymentExceptions = pe;
    refundsOpen = ro;
    lowStockCount = Number(ls[0]?.count ?? 0);
    recentOrders = rec;
    totalSalesIdr = sumSales._sum.grandTotalIdr ?? 0;
    totalOrdersCount = totOrders;

    // Aggregate daily stats for 14-day trend
    const dayMap = new Map<string, { revenue: number; orders: number; displayDate: string }>();
    for (let i = 0; i < 14; i++) {
      const d = new Date(fourteenDaysAgo);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      const displayDate = d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
      dayMap.set(key, { revenue: 0, orders: 0, displayDate });
    }

    ordersLast14Days.forEach((o) => {
      const key = new Date(o.createdAt).toISOString().slice(0, 10);
      const entry = dayMap.get(key);
      if (entry) {
        entry.orders += 1;
        if (o.paymentStatus === "paid") {
          entry.revenue += o.grandTotalIdr;
        }
      }
    });

    salesTrend = Array.from(dayMap.entries()).map(([date, val]) => ({
      date,
      displayDate: val.displayDate,
      revenue: val.revenue,
      orders: val.orders,
    }));

    categoryDistribution = categoriesWithCount.map((c) => ({
      name: c.name,
      value: c._count.products,
    }));
  } catch (err) {
    console.error("[admin:dashboardSummary]", err);
  }

  const statusDistribution: StatusDistributionPoint[] = [
    { status: "pending_payment", label: "Menunggu Bayar", count: awaitingPayment, fill: "#EAB308" },
    { status: "to_process", label: "Perlu Diproses", count: toProcess, fill: "#813A56" },
    { status: "packed", label: "Siap Kirim", count: packed, fill: "#0284C7" },
    { status: "shipped", label: "Pengiriman", count: shipped, fill: "#6366F1" },
    { status: "completed", label: "Selesai", count: completed, fill: "#16A34A" },
    { status: "cancelled", label: "Dibatalkan", count: cancelled, fill: "#DC2626" },
  ];

  const kpis = [
    {
      title: "Perlu Diproses",
      value: toProcess,
      desc: "Pesanan lunas menunggu picking & packing fisik",
      href: "/admin/pesanan?status=paid",
      alert: toProcess > 0,
      badge: "Prioritas",
      icon: Clock,
      color: "text-accent bg-accent/10 border-accent/30",
    },
    {
      title: "Siap Dikirim",
      value: packed,
      desc: "Paket siap tempel resi & dijemput kurir logistik",
      href: "/admin/pesanan?status=packed",
      alert: false,
      icon: PackageCheck,
      color: "text-sky-600 bg-sky-50 border-sky-200",
    },
    {
      title: "Dalam Pengiriman",
      value: shipped,
      desc: "Paket sedang dalam perjalanan ekspedisi ke pembeli",
      href: "/admin/pesanan?status=shipped",
      alert: false,
      icon: Truck,
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
    },
    {
      title: "Stok Menipis / Kritis",
      value: lowStockCount,
      desc: "SKU varian di bawah batas minimum stok aman",
      href: "/admin/katalog",
      alert: lowStockCount > 0,
      badge: lowStockCount > 0 ? "Perhatian" : undefined,
      icon: AlertTriangle,
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      title: "Menunggu Pembayaran",
      value: awaitingPayment,
      desc: "Transaksi aktif dalam reservasi waktu pembayaran",
      href: "/admin/pesanan?status=pending_payment",
      alert: false,
      icon: CreditCard,
      color: "text-slate-600 bg-slate-100 border-slate-200",
    },
    {
      title: "Kasus Refund / Pembayaran",
      value: refundsOpen + paymentExceptions,
      desc: "Pengajuan refund atau verifikasi tertunda",
      href: "/admin/keuangan",
      alert: refundsOpen + paymentExceptions > 0,
      badge: refundsOpen + paymentExceptions > 0 ? "Perhatian" : undefined,
      icon: ShieldAlert,
      color: "text-rose-600 bg-rose-50 border-rose-200",
    },
    {
      title: "Total Omzet Lunas",
      value: formatRupiah(totalSalesIdr),
      desc: "Akumulasi pembayaran terverifikasi sah",
      href: "/admin/keuangan",
      alert: false,
      icon: Wallet,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      isMoney: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* ── HEADER DASHBOARD ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-accent/10 text-accent">
              <TrendingUp className="size-4" />
            </span>
            <span className="text-caption font-bold tracking-wider text-accent uppercase">
              Operasional Real-Time
            </span>
          </div>
          <h1 className="mt-1 text-display font-black text-ink">Dashboard Toko</h1>
          <p className="mt-1 text-small text-muted">
            Pantau arus pemrosesan order, grafik penjualan, distribusi status, dan reservasi inventaris fisik.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/katalog"
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-rule bg-surface px-3.5 py-2 text-small font-semibold text-ink shadow-xs transition-colors hover:bg-paper-2"
          >
            <ShoppingBag className="size-4 text-accent" />
            <span>Katalog</span>
          </Link>
          <Link
            href="/admin/pesanan"
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-small font-bold text-ink-inverse shadow-xs transition-colors hover:bg-accent/90"
          >
            <Package className="size-4" />
            <span>Semua Pesanan</span>
          </Link>
        </div>
      </div>

      {/* ── METRIC TILES ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <Link
              key={i}
              href={k.href}
              className={`group relative flex flex-col justify-between rounded-card border p-5 shadow-low transition-all duration-200 hover:-translate-y-0.5 hover:shadow-medium ${
                k.alert
                  ? "border-accent bg-paper-2/60"
                  : "border-rule bg-surface hover:border-rule-strong"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-small font-bold text-ink">{k.title}</span>
                <div className="flex items-center gap-2">
                  {k.badge ? (
                    <span className="rounded-pill bg-accent px-2 py-0.5 text-[11px] font-bold text-ink-inverse">
                      {k.badge}
                    </span>
                  ) : null}
                  <span className={`flex size-8 items-center justify-center rounded-lg border ${k.color}`}>
                    <Icon className="size-4.5" />
                  </span>
                </div>
              </div>

              <div className="my-3">
                <span className={`font-black tracking-tight text-ink ${k.isMoney ? "text-h2" : "text-display"}`}>
                  {k.value}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-rule/60 pt-2 text-caption text-muted">
                <span className="truncate pr-2">{k.desc}</span>
                <ChevronRight className="size-3.5 shrink-0 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── REALTIME CHARTS (AREA, BAR, PIE) ── */}
      <DashboardCharts
        salesTrend={salesTrend}
        statusDistribution={statusDistribution}
        categoryDistribution={categoryDistribution}
        totalSales={totalSalesIdr}
        totalOrders={totalOrdersCount}
      />

      {/* ── ANTREAN PESANAN TERBARU ── */}
      <div className="rounded-card border border-rule bg-surface p-5 shadow-low md:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-rule pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-md bg-paper-2 text-ink">
                <Package className="size-4 text-accent" />
              </span>
              <h2 className="text-h3 font-bold text-ink">Pesanan Terbaru Masuk</h2>
            </div>
            <p className="mt-1 text-caption text-muted">
              Daftar transaksi pesanan terkini yang menunggu atau sedang diproses
            </p>
          </div>
          <Link
            href="/admin/pesanan"
            className="inline-flex items-center gap-1 text-small font-bold text-accent transition-colors hover:underline"
          >
            <span>Buka Semua Antrean Pesanan</span>
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center">
            <Package className="mx-auto size-10 text-muted/60" />
            <p className="mt-2 text-small font-medium text-muted">Belum ada transaksi pesanan yang dicatat sistem.</p>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-small">
              <thead>
                <tr className="border-b border-rule font-bold text-ink">
                  <th className="py-3 px-2">No. Pesanan</th>
                  <th className="py-3 px-2">Penerima</th>
                  <th className="py-3 px-2">Waktu</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Nilai Total</th>
                  <th className="py-3 px-2 text-right">Opsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule/70 text-muted">
                {recentOrders.map((o) => {
                  const addr = o.shippingAddress as { recipientName?: string };
                  let statusBadge = "bg-paper-2 text-ink";
                  if (o.status === "paid") statusBadge = "bg-emerald-50 text-emerald-700 border border-emerald-200";
                  if (o.status === "packed") statusBadge = "bg-sky-50 text-sky-700 border border-sky-200";
                  if (o.status === "shipped") statusBadge = "bg-indigo-50 text-indigo-700 border border-indigo-200";
                  if (o.status === "pending_payment") statusBadge = "bg-amber-50 text-amber-700 border border-amber-200";
                  if (o.status === "cancelled") statusBadge = "bg-rose-50 text-rose-700 border border-rose-200";

                  return (
                    <tr key={o.id} className="transition-colors hover:bg-paper-2/40">
                      <td className="py-3.5 px-2 font-mono font-bold text-ink">{o.publicNumber}</td>
                      <td className="py-3.5 px-2 text-ink font-medium">{addr?.recipientName || "—"}</td>
                      <td className="py-3.5 px-2 text-caption">
                        {new Date(o.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3.5 px-2">
                        <span className={`inline-block rounded-pill px-2.5 py-0.5 text-caption font-bold ${statusBadge}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-right font-semibold text-ink tabular">
                        {formatRupiah(o.grandTotalIdr)}
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        <Link
                          href={`/admin/pesanan/${o.id}`}
                          className="inline-flex items-center gap-1 font-bold text-accent hover:underline"
                        >
                          <span>Kelola</span>
                          <ArrowUpRight className="size-3.5" />
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
