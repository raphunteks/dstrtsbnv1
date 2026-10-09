"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { formatRupiah } from "@/lib/money";
import { updateOrderFulfillmentAction, shipOrderManualAction } from "../../actions";

type OrderDetailItem = {
  id: string;
  productNameSnap: string;
  variantSkuSnap: string;
  attributesSnap: Record<string, unknown> | null;
  unitPriceIdr: number;
  lineTotalIdr: number;
  quantity: number;
};

type OrderDetailShipment = {
  id: string;
  courierCode: string;
  serviceCode: string;
  waybill: string;
  costIdr: number;
  shippedAt: Date;
};

type OrderDetailData = {
  id: string;
  publicNumber: string;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  refundStatus: string;
  settlementStatus: string;
  itemsSubtotalIdr: number;
  discountIdr: number;
  shippingIdr: number;
  grandTotalIdr: number;
  shippingAddress: {
    recipientName?: string;
    phone?: string;
    street?: string;
    districtName?: string;
    cityName?: string;
    provinceName?: string;
    postalCode?: string;
    destinationLabel?: string;
  } | null;
  items: OrderDetailItem[];
  shipments: OrderDetailShipment[];
};

export function OrderDetailClientView({ order }: { order: OrderDetailData }) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form input resi manual
  const [courierCode, setCourierCode] = useState("jnt");
  const [serviceCode, setServiceCode] = useState("EZ");
  const [waybill, setWaybill] = useState("");
  const costIdr = order.shippingIdr || 0;

  function handleTransition(name: "startPicking" | "markPacked" | "markDelivered" | "reportException") {
    setErrorMsg(null);
    setSuccessMsg(null);
    startTransition(async () => {
      const res = await updateOrderFulfillmentAction(order.id, name);
      if (res.ok) {
        setSuccessMsg("Status fulfillment berhasil diperbarui.");
      } else {
        setErrorMsg(res.message);
      }
    });
  }

  function handleShip(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    startTransition(async () => {
      const res = await shipOrderManualAction({
        orderId: order.id,
        courierCode,
        serviceCode,
        waybill,
        costIdr: Number(costIdr),
      });
      if (res.ok) {
        setSuccessMsg("Resi berhasil dicatat dan pesanan ditandai dalam pengiriman!");
        setWaybill("");
      } else {
        setErrorMsg(res.message);
      }
    });
  }

  const addr = order.shippingAddress || {};

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/admin/pesanan" className="text-caption text-muted hover:text-accent">
            ← Kembali ke Daftar Pesanan
          </Link>
          <div className="mt-1 flex items-center gap-3">
            <h1 className="font-mono text-display font-bold text-ink">{order.publicNumber}</h1>
            <span className="rounded-pill bg-paper-2 px-3 py-1 text-small font-bold text-accent">
              {order.status}
            </span>
          </div>
        </div>
      </div>

      {errorMsg ? (
        <div role="alert" className="rounded-input border border-danger/30 bg-danger/10 p-3 text-small text-danger">
          {errorMsg}
        </div>
      ) : null}

      {successMsg ? (
        <div className="rounded-input border border-success/30 bg-success/10 p-3 text-small text-success">
          {successMsg}
        </div>
      ) : null}

      {/* 5 Status Domain (BR-021) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div className="rounded-card border border-rule bg-surface p-3">
          <span className="text-caption text-muted">Siklus Pesanan</span>
          <p className="mt-1 font-bold text-ink capitalize">{order.status}</p>
        </div>
        <div className="rounded-card border border-rule bg-surface p-3">
          <span className="text-caption text-muted">Status Pembayaran</span>
          <p className="mt-1 font-bold text-ink capitalize">{order.paymentStatus}</p>
        </div>
        <div className="rounded-card border border-rule bg-surface p-3">
          <span className="text-caption text-muted">Status Fulfillment</span>
          <p className="mt-1 font-bold text-ink capitalize">{order.fulfillmentStatus}</p>
        </div>
        <div className="rounded-card border border-rule bg-surface p-3">
          <span className="text-caption text-muted">Status Refund</span>
          <p className="mt-1 font-bold text-ink capitalize">{order.refundStatus}</p>
        </div>
        <div className="rounded-card border border-rule bg-surface p-3">
          <span className="text-caption text-muted">Status Settlement</span>
          <p className="mt-1 font-bold text-ink capitalize">{order.settlementStatus}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Kolom Kiri: Items & Rincian Biaya */}
        <div className="space-y-6 lg:col-span-2">
          {/* Items Snapshot */}
          <div className="rounded-card border border-rule bg-surface p-6 shadow-low">
            <h2 className="text-h3 font-bold text-ink">Snapshot Produk Pesanan</h2>
            <div className="mt-4 divide-y divide-rule">
              {order.items.map((it) => (
                <div key={it.id} className="flex items-center justify-between py-3">
                  <div>
                    <h3 className="font-bold text-ink">{it.productNameSnap}</h3>
                    <p className="font-mono text-caption text-muted">SKU: {it.variantSkuSnap}</p>
                    {it.attributesSnap ? (
                      <p className="text-caption text-muted">
                        {Object.entries(it.attributesSnap).map(([k, v]) => `${k}: ${String(v)}`).join(", ")}
                      </p>
                    ) : null}
                  </div>
                  <div className="text-right">
                    <p className="text-small text-muted">{formatRupiah(it.unitPriceIdr)} × {it.quantity}</p>
                    <p className="font-bold text-ink tabular">{formatRupiah(it.lineTotalIdr)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Breakdown */}
            <div className="mt-6 border-t border-rule pt-4 space-y-2 text-small">
              <div className="flex justify-between text-muted">
                <span>Subtotal Barang:</span>
                <span className="tabular">{formatRupiah(order.itemsSubtotalIdr)}</span>
              </div>
              {order.discountIdr > 0 ? (
                <div className="flex justify-between text-success">
                  <span>Potongan Kupon Promo:</span>
                  <span className="tabular">- {formatRupiah(order.discountIdr)}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-muted">
                <span>Ongkos Kirim RajaOngkir:</span>
                <span className="tabular">{formatRupiah(order.shippingIdr)}</span>
              </div>
              <div className="flex justify-between border-t border-rule pt-2 font-bold text-body text-ink">
                <span>Total Pembayaran (Grand Total):</span>
                <span className="text-price text-accent tabular">{formatRupiah(order.grandTotalIdr)}</span>
              </div>
            </div>
          </div>

          {/* Riwayat Pengiriman & Resi */}
          <div className="rounded-card border border-rule bg-surface p-6 shadow-low">
            <h2 className="text-h3 font-bold text-ink">Riwayat Ekspedisi Pengiriman</h2>
            {order.shipments && order.shipments.length > 0 ? (
              <div className="mt-4 space-y-3">
                {order.shipments.map((s) => (
                  <div key={s.id} className="rounded-input border border-rule bg-paper p-3 text-small">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-ink uppercase">{s.courierCode} - {s.serviceCode}</span>
                      <span className="font-mono font-bold text-accent">{s.waybill}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-caption text-muted">
                      <span>Biaya: {formatRupiah(s.costIdr)}</span>
                      <span>Dikirim: {new Date(s.shippedAt).toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-small text-muted">Belum ada pengiriman yang dicatat untuk pesanan ini.</p>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Aksi Staf & Alamat Kirim */}
        <div className="space-y-6">
          {/* Panel Tindakan Staf */}
          <div className="rounded-card border border-rule bg-surface p-6 shadow-low">
            <h2 className="text-h3 font-bold text-ink">Tindakan Fulfillment</h2>

            {order.paymentStatus !== "paid" ? (
              <div className="mt-4 rounded-input bg-warning/10 p-3 text-small text-warning">
                Pesanan belum lunas. Tidak ada tindakan pengiriman fisik yang diizinkan sebelum pembayaran terverifikasi sah (BR-012).
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {order.fulfillmentStatus === "not_started" ? (
                  <button
                    disabled={isPending}
                    onClick={() => handleTransition("startPicking")}
                    className="flex min-h-[var(--touch-target)] w-full items-center justify-center rounded-input bg-accent px-4 text-button font-bold text-ink-inverse hover:bg-accent-hover disabled:opacity-50"
                  >
                    Mulai Picking (Ambil Barang)
                  </button>
                ) : null}

                {order.fulfillmentStatus === "picking" ? (
                  <button
                    disabled={isPending}
                    onClick={() => handleTransition("markPacked")}
                    className="flex min-h-[var(--touch-target)] w-full items-center justify-center rounded-input bg-accent px-4 text-button font-bold text-ink-inverse hover:bg-accent-hover disabled:opacity-50"
                  >
                    Tandai Telah Dikemas (Packed)
                  </button>
                ) : null}

                {order.fulfillmentStatus === "packed" ? (
                  <form onSubmit={handleShip} className="space-y-3 rounded-input border border-rule bg-paper p-3">
                    <span className="text-small font-bold text-ink">Input Resi Ekspedisi</span>
                    <div>
                      <label className="block text-caption text-muted">Kode Kurir</label>
                      <select
                        value={courierCode}
                        onChange={(e) => setCourierCode(e.target.value)}
                        className="mt-1 w-full rounded-input border border-rule-strong bg-surface p-2 text-small"
                      >
                        <option value="jnt">J&T Express (jnt)</option>
                        <option value="jne">JNE (jne)</option>
                        <option value="sicepat">SiCepat (sicepat)</option>
                        <option value="pos">POS Indonesia (pos)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-caption text-muted">Layanan</label>
                      <input
                        value={serviceCode}
                        onChange={(e) => setServiceCode(e.target.value)}
                        required
                        className="mt-1 w-full rounded-input border border-rule-strong bg-surface p-2 text-small font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-caption text-muted">Nomor Resi (AWB)</label>
                      <input
                        value={waybill}
                        onChange={(e) => setWaybill(e.target.value)}
                        placeholder="Contoh: JX1234567890"
                        required
                        className="mt-1 w-full rounded-input border border-rule-strong bg-surface p-2 text-small font-mono uppercase"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="flex min-h-[var(--touch-target)] w-full items-center justify-center rounded-input bg-accent px-4 text-button font-bold text-ink-inverse hover:bg-accent-hover disabled:opacity-50"
                    >
                      Kirim & Simpan Resi
                    </button>
                  </form>
                ) : null}

                {order.fulfillmentStatus === "shipped" ? (
                  <button
                    disabled={isPending}
                    onClick={() => handleTransition("markDelivered")}
                    className="flex min-h-[var(--touch-target)] w-full items-center justify-center rounded-input bg-success px-4 text-button font-bold text-ink-inverse hover:opacity-90 disabled:opacity-50"
                  >
                    Tandai Telah Diterima (Delivered)
                  </button>
                ) : null}
              </div>
            )}
          </div>

          {/* Alamat Penerima */}
          <div className="rounded-card border border-rule bg-surface p-6 shadow-low">
            <h2 className="text-h3 font-bold text-ink">Alamat Pengiriman (Snapshot)</h2>
            <div className="mt-3 text-small">
              <p className="font-bold text-ink">{addr.recipientName || "—"}</p>
              <p className="text-muted">{addr.phone || "—"}</p>
              <p className="mt-2 text-ink">{addr.street || "—"}</p>
              <p className="text-muted">
                {addr.districtName}, {addr.cityName}, {addr.provinceName} {addr.postalCode ? `(${addr.postalCode})` : ""}
              </p>
              {addr.destinationLabel ? (
                <p className="mt-1 text-caption text-muted">Tujuan: {addr.destinationLabel}</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
