"use client";

import { useState } from "react";
import Link from "next/link";
import { formatRupiah } from "@/lib/money";

type OrderItem = {
  id: string;
  productNameSnap: string;
  quantity: number;
};

type Order = {
  id: string;
  publicNumber: string;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  grandTotalIdr: number;
  createdAt: Date;
  shippingAddress: { recipientName?: string; cityName?: string; districtName?: string } | null;
  items: OrderItem[];
};

export function OrdersClientList({ initialOrders }: { initialOrders: Order[] }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = initialOrders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const numMatch = o.publicNumber.toLowerCase().includes(q);
      const nameMatch = o.shippingAddress?.recipientName?.toLowerCase()?.includes(q);
      if (!numMatch && !nameMatch) return false;
    }
    return true;
  });

  const statuses = [
    { key: "all", label: "Semua" },
    { key: "paid", label: "Lunas (Perlu Diproses)" },
    { key: "processing", label: "Sedang Diproses" },
    { key: "packed", label: "Dikemas (Siap Kirim)" },
    { key: "shipped", label: "Dalam Pengiriman" },
    { key: "delivered", label: "Terkirim" },
    { key: "pending_payment", label: "Menunggu Bayar" },
    { key: "payment_exception", label: "Kendala Bayar" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <span className="text-caption font-bold tracking-wider text-accent uppercase">Manajemen Pesanan</span>
        <h1 className="mt-1 text-display font-bold text-ink">Pesanan & Pengiriman</h1>
        <p className="mt-1 text-small text-muted">Pantau status pembayaran, proses fulfillment fisik, dan kelola nomor resi.</p>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Cari nomor pesanan atau nama..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-h-[var(--touch-target)] w-full max-w-xs rounded-input border border-rule-strong bg-surface px-3 text-small text-ink placeholder:text-muted sm:w-auto"
        />
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {statuses.map((s) => (
            <button
              key={s.key}
              onClick={() => setStatusFilter(s.key)}
              className={`min-h-[var(--touch-target)] shrink-0 rounded-pill px-4 text-caption font-bold transition-colors ${
                statusFilter === s.key
                  ? "bg-accent text-ink-inverse"
                  : "border border-rule-strong bg-surface text-muted hover:text-ink"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-card border border-rule bg-surface p-4 shadow-low md:p-6">
        {filtered.length === 0 ? (
          <p className="py-10 text-center text-small text-muted">Tidak ada pesanan pada status ini.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-small">
              <thead>
                <tr className="border-b border-rule font-bold text-ink">
                  <th className="py-3">Nomor Pesanan</th>
                  <th className="py-3">Penerima & Alamat</th>
                  <th className="py-3">Item Pesanan</th>
                  <th className="py-3">Status Transaksi</th>
                  <th className="py-3">Fulfillment</th>
                  <th className="py-3 text-right">Total</th>
                  <th className="py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule text-muted">
                {filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-paper-2/40">
                    <td className="py-4">
                      <div className="font-mono font-bold text-ink">{o.publicNumber}</div>
                      <div className="text-caption text-muted">
                        {new Date(o.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="font-bold text-ink">{o.shippingAddress?.recipientName || "—"}</div>
                      <div className="text-caption text-muted truncate max-w-[180px]">
                        {o.shippingAddress?.districtName || ""}, {o.shippingAddress?.cityName || ""}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="text-small text-ink">
                        {o.items[0]?.productNameSnap || "Item"}
                        {o.items.length > 1 ? ` (+${o.items.length - 1} lainnya)` : ""}
                      </div>
                      <div className="text-caption text-muted">
                        Total {o.items.reduce((s, it) => s + it.quantity, 0)} pcs
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="rounded-pill bg-paper-2 px-2.5 py-0.5 text-caption font-bold text-ink">
                        {o.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="rounded-pill bg-paper px-2.5 py-0.5 text-caption font-semibold text-muted">
                        {o.fulfillmentStatus}
                      </span>
                    </td>
                    <td className="py-4 text-right font-bold text-ink tabular">
                      {formatRupiah(o.grandTotalIdr)}
                    </td>
                    <td className="py-4 text-right">
                      <Link
                        href={`/admin/pesanan/${o.id}`}
                        className="inline-flex min-h-[36px] items-center justify-center rounded-input bg-accent px-3 text-caption font-bold text-ink-inverse hover:bg-accent-hover"
                      >
                        Kelola
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
