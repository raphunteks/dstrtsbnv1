"use client";

import { useTransition, useState } from "react";
import { formatRupiah } from "@/lib/money";
import { approveRefundAction } from "../actions";

type PaymentRow = {
  id: string;
  externalTxnId: string | null;
  method: string | null;
  amountIdr: number;
  status: string;
  completedAt: Date | null;
  order: { publicNumber: string } | null;
};

type RefundRow = {
  id: string;
  amountIdr: number;
  reason: string;
  status: string;
  order: { publicNumber: string } | null;
};

export function FinanceClientView({
  summary,
  payments,
  refunds,
}: {
  summary: { grossIdr: number; refundedIdr: number; netIdr: number; paidCount: number };
  payments: PaymentRow[];
  refunds: RefundRow[];
}) {
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  function handleApprove(refundId: string) {
    if (!confirm("Setujui pengembalian dana ini?")) return;
    setMsg(null);
    startTransition(async () => {
      const res = await approveRefundAction(refundId);
      if (res.ok) {
        setMsg("Refund berhasil disetujui untuk diproses transfer manual.");
      } else {
        setMsg(res.message);
      }
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="text-caption font-bold tracking-wider text-accent uppercase">Laporan & Rekonsiliasi</span>
        <h1 className="mt-1 text-display font-bold text-ink">Keuangan & Refund</h1>
        <p className="mt-1 text-small text-muted">Pantau payment ledger Pakasir v2, omzet bersih terverifikasi, dan antrean pengembalian dana.</p>
      </div>

      {msg ? (
        <div className="rounded-input border border-info/30 bg-info/10 p-3 text-small text-info">{msg}</div>
      ) : null}

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-card border border-rule bg-surface p-5 shadow-low">
          <span className="text-caption font-bold text-muted uppercase">Gross Paid (Bruto)</span>
          <p className="mt-2 text-h2 font-black text-ink tabular">{formatRupiah(summary.grossIdr)}</p>
          <p className="mt-1 text-caption text-muted">{summary.paidCount} transaksi pesanan lunas</p>
        </div>
        <div className="rounded-card border border-rule bg-surface p-5 shadow-low">
          <span className="text-caption font-bold text-muted uppercase">Total Refund Sukses</span>
          <p className="mt-2 text-h2 font-black text-danger tabular">{formatRupiah(summary.refundedIdr)}</p>
          <p className="mt-1 text-caption text-muted">Dana telah dikembalikan ke pembeli</p>
        </div>
        <div className="rounded-card border border-rule bg-paper-2 p-5 shadow-low">
          <span className="text-caption font-bold text-accent uppercase">Net Sales (Penjualan Bersih)</span>
          <p className="mt-2 text-h2 font-black text-accent tabular">{formatRupiah(summary.netIdr)}</p>
          <p className="mt-1 text-caption text-muted">Total penerimaan setelah dikurangi refund</p>
        </div>
      </div>

      {/* Antrean Pengajuan Refund Manual (FR-057) */}
      <div className="rounded-card border border-rule bg-surface p-6 shadow-low">
        <h2 className="text-h3 font-bold text-ink">Antrean Pengajuan Refund Manual</h2>
        <p className="mt-1 text-caption text-muted">
          Persetujuan berizin sebelum finance mentransfer dana kembali ke konsumen (BR-014).
        </p>

        {refunds.length === 0 ? (
          <p className="py-6 text-center text-small text-muted">Tidak ada pengajuan refund terbuka saat ini.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-small">
              <thead>
                <tr className="border-b border-rule font-bold text-ink">
                  <th className="py-2.5">Nomor Pesanan</th>
                  <th className="py-2.5">Alasan Refund</th>
                  <th className="py-2.5">Nominal</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Aksi Persetujuan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule text-muted">
                {refunds.map((r) => (
                  <tr key={r.id} className="hover:bg-paper-2/40">
                    <td className="py-3 font-mono font-bold text-ink">{r.order?.publicNumber}</td>
                    <td className="py-3 text-ink">{r.reason}</td>
                    <td className="py-3 font-bold text-danger tabular">{formatRupiah(r.amountIdr)}</td>
                    <td className="py-3">
                      <span className="rounded-pill bg-warning/15 px-2.5 py-0.5 text-caption font-bold text-warning">
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {r.status === "pending" ? (
                        <button
                          disabled={isPending}
                          onClick={() => handleApprove(r.id)}
                          className="min-h-[36px] rounded-input bg-accent px-4 text-caption font-bold text-ink-inverse hover:bg-accent-hover disabled:opacity-50"
                        >
                          Setujui Refund
                        </button>
                      ) : (
                        <span className="text-caption text-muted">Disetujui</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Riwayat Payment Attempts (Pakasir Ledger) */}
      <div className="rounded-card border border-rule bg-surface p-6 shadow-low">
        <h2 className="text-h3 font-bold text-ink">Riwayat Pembayaran Gateway (Pakasir Ledger)</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-small">
            <thead>
              <tr className="border-b border-rule font-bold text-ink">
                <th className="py-2.5">ID Transaksi (txn_id)</th>
                <th className="py-2.5">Pesanan</th>
                <th className="py-2.5">Metode</th>
                <th className="py-2.5">Nominal IDR</th>
                <th className="py-2.5">Status Gateway</th>
                <th className="py-2.5">Waktu Lunas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule text-muted">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-paper-2/40">
                  <td className="py-3 font-mono text-caption text-ink">{p.externalTxnId || p.id.slice(0, 8)}</td>
                  <td className="py-3 font-mono font-bold text-ink">{p.order?.publicNumber}</td>
                  <td className="py-3 uppercase text-caption">{p.method || "Pakasir Link"}</td>
                  <td className="py-3 font-bold text-ink tabular">{formatRupiah(p.amountIdr)}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-pill px-2.5 py-0.5 text-caption font-bold ${
                        p.status === "completed"
                          ? "bg-success/15 text-success"
                          : p.status === "pending"
                          ? "bg-warning/15 text-warning"
                          : "bg-muted/15 text-muted"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 text-caption">
                    {p.completedAt ? new Date(p.completedAt).toLocaleString("id-ID") : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
