"use client";

import { useState, useTransition } from "react";
import { formatRupiah } from "@/lib/money";
import { createCouponAction } from "../actions";

type CouponItem = {
  id: string;
  code: string;
  type: string;
  value: number;
  minSubtotalIdr: number | null;
  maxDiscountIdr: number | null;
  usageCount: number;
  usageLimit: number | null;
  startsAt: Date;
  endsAt: Date;
  active: boolean;
};

export function CouponsClientView({ coupons }: { coupons: CouponItem[] }) {
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form state
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percentage" | "fixed_amount">("percentage");
  const [value, setValue] = useState(1000); // 10% or Rp 10.000
  const [minSubtotalIdr, setMinSubtotalIdr] = useState(100000);
  const [maxDiscountIdr, setMaxDiscountIdr] = useState(25000);
  const [usageLimit, setUsageLimit] = useState(100);
  const [startsAt, setStartsAt] = useState(new Date().toISOString().slice(0, 10));
  const [endsAt, setEndsAt] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
  );

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    startTransition(async () => {
      const res = await createCouponAction({
        code,
        type,
        value: Number(value),
        minSubtotalIdr: Number(minSubtotalIdr) || undefined,
        maxDiscountIdr: type === "percentage" ? Number(maxDiscountIdr) || undefined : undefined,
        usageLimit: Number(usageLimit) || undefined,
        startsAt: new Date(startsAt).toISOString(),
        endsAt: new Date(endsAt).toISOString(),
      });
      if (res.ok) {
        setShowModal(false);
        setCode("");
      } else {
        setErrorMsg(res.message);
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-caption font-bold tracking-wider text-accent uppercase">Pemasaran & Diskon</span>
          <h1 className="mt-1 text-display font-bold text-ink">Kupon Promo</h1>
          <p className="mt-1 text-small text-muted">Buat dan kelola kode voucher diskon dengan batas kuota dan masa berlaku.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex min-h-[var(--touch-target)] items-center justify-center rounded-input bg-accent px-5 text-button font-bold text-ink-inverse hover:bg-accent-hover"
        >
          + Buat Kupon Baru
        </button>
      </div>

      {showModal ? (
        <div className="rounded-card border border-rule bg-surface p-6 shadow-low">
          <h2 className="text-h3 font-bold text-ink">Buat Kupon Promo Baru</h2>
          {errorMsg ? (
            <div className="mt-3 rounded-input bg-danger/10 p-3 text-small text-danger">{errorMsg}</div>
          ) : null}
          <form onSubmit={handleCreate} className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-small font-semibold text-ink">Kode Promo</label>
              <input
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="CONTOH: GAJIAN10"
                className="mt-1 min-h-[var(--touch-target)] w-full rounded-input border border-rule-strong bg-paper px-3 font-mono font-bold uppercase text-ink"
              />
            </div>
            <div>
              <label className="block text-small font-semibold text-ink">Jenis Diskon</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "percentage" | "fixed_amount")}
                className="mt-1 min-h-[var(--touch-target)] w-full rounded-input border border-rule-strong bg-paper px-3 text-small text-ink"
              >
                <option value="percentage">Persentase (%)</option>
                <option value="fixed_amount">Potongan Nominal (Rp)</option>
              </select>
            </div>
            <div>
              <label className="block text-small font-semibold text-ink">
                Nilai Diskon {type === "percentage" ? "(Basis point: 1000 = 10%)" : "(Rupiah)"}
              </label>
              <input
                type="number"
                required
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="mt-1 min-h-[var(--touch-target)] w-full rounded-input border border-rule-strong bg-paper px-3 text-small text-ink"
              />
            </div>
            <div>
              <label className="block text-small font-semibold text-ink">Min. Subtotal Belanja (Rp)</label>
              <input
                type="number"
                value={minSubtotalIdr}
                onChange={(e) => setMinSubtotalIdr(Number(e.target.value))}
                className="mt-1 min-h-[var(--touch-target)] w-full rounded-input border border-rule-strong bg-paper px-3 text-small text-ink"
              />
            </div>
            {type === "percentage" ? (
              <div>
                <label className="block text-small font-semibold text-ink">Maks. Potongan Diskon (Rp)</label>
                <input
                  type="number"
                  value={maxDiscountIdr}
                  onChange={(e) => setMaxDiscountIdr(Number(e.target.value))}
                  className="mt-1 min-h-[var(--touch-target)] w-full rounded-input border border-rule-strong bg-paper px-3 text-small text-ink"
                />
              </div>
            ) : null}
            <div>
              <label className="block text-small font-semibold text-ink">Batas Pemakaian (Kuota)</label>
              <input
                type="number"
                value={usageLimit}
                onChange={(e) => setUsageLimit(Number(e.target.value))}
                className="mt-1 min-h-[var(--touch-target)] w-full rounded-input border border-rule-strong bg-paper px-3 text-small text-ink"
              />
            </div>
            <div>
              <label className="block text-small font-semibold text-ink">Mulai Berlaku</label>
              <input
                type="date"
                required
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="mt-1 min-h-[var(--touch-target)] w-full rounded-input border border-rule-strong bg-paper px-3 text-small text-ink"
              />
            </div>
            <div>
              <label className="block text-small font-semibold text-ink">Berakhir Pada</label>
              <input
                type="date"
                required
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                className="mt-1 min-h-[var(--touch-target)] w-full rounded-input border border-rule-strong bg-paper px-3 text-small text-ink"
              />
            </div>
            <div className="flex gap-2 sm:col-span-2 pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="min-h-[var(--touch-target)] rounded-input bg-accent px-6 text-button font-bold text-ink-inverse hover:bg-accent-hover disabled:opacity-50"
              >
                {isPending ? "Menyimpan..." : "Simpan Kupon"}
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="min-h-[var(--touch-target)] rounded-input border border-rule bg-paper px-4 text-button font-semibold text-ink hover:bg-paper-2"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {/* Coupons Table */}
      <div className="rounded-card border border-rule bg-surface p-4 shadow-low md:p-6">
        {coupons.length === 0 ? (
          <p className="py-10 text-center text-small text-muted">Belum ada kupon promo aktif.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-small">
              <thead>
                <tr className="border-b border-rule font-bold text-ink">
                  <th className="py-3">Kode Kupon</th>
                  <th className="py-3">Nilai Diskon</th>
                  <th className="py-3">Syarat Minimum</th>
                  <th className="py-3">Kuota Pemakaian</th>
                  <th className="py-3">Periode Aktif</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule text-muted">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-paper-2/40">
                    <td className="py-4">
                      <span className="font-mono font-bold text-ink">{c.code}</span>
                    </td>
                    <td className="py-4 font-bold text-accent">
                      {c.type === "percentage" ? `${c.value / 100}%` : formatRupiah(c.value)}
                    </td>
                    <td className="py-4 tabular">
                      {c.minSubtotalIdr ? `Min. ${formatRupiah(c.minSubtotalIdr)}` : "Tanpa minimum"}
                    </td>
                    <td className="py-4">
                      {c.usageCount} {c.usageLimit ? `/ ${c.usageLimit}` : " (tanpa limit)"}
                    </td>
                    <td className="py-4 text-caption">
                      {new Date(c.startsAt).toLocaleDateString("id-ID")} – {new Date(c.endsAt).toLocaleDateString("id-ID")}
                    </td>
                    <td className="py-4">
                      <span
                        className={`rounded-pill px-2.5 py-0.5 text-caption font-bold ${
                          c.active ? "bg-success/15 text-success" : "bg-muted/15 text-muted"
                        }`}
                      >
                        {c.active ? "Aktif" : "Nonaktif"}
                      </span>
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
