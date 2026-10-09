"use client";

import { useState, useTransition } from "react";
import { updateSettingsAction } from "@/app/admin/actions";

type StoreSettingsData = {
  supportEmail?: string | null;
  supportWhatsapp?: string | null;
  reservationHoldMinutes?: number | null;
  shippingCouriers?: string[] | null;
  featureFlags?: unknown;
} | null;

type WarehouseData = {
  id: string;
  code: string;
  name: string;
  originLabel: string;
  rajaongkirOriginId: string | null;
} | null;

type AuditLogRow = {
  id: string;
  action: string;
  targetType: string;
  targetId: string | null;
  reason: string | null;
  createdAt: Date;
};

const AVAILABLE_COURIERS = [
  { code: "jne", name: "JNE (Jalur Nugraha Ekakurir)" },
  { code: "sicepat", name: "SiCepat Ekspres" },
  { code: "jnt", name: "J&T Express" },
  { code: "pos", name: "POS Indonesia" },
  { code: "anteraja", name: "Anteraja" },
  { code: "tiki", name: "TIKI" },
];

export function SettingsClientView({
  settings,
  warehouse,
  auditLogs,
}: {
  settings: StoreSettingsData;
  warehouse?: WarehouseData;
  auditLogs: AuditLogRow[];
}) {
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [email, setEmail] = useState(settings?.supportEmail ?? "");
  const [whatsapp, setWhatsapp] = useState(settings?.supportWhatsapp ?? "");
  const [holdMinutes, setHoldMinutes] = useState(settings?.reservationHoldMinutes ?? 30);

  // Pengaturan Pengiriman
  const [couriers, setCouriers] = useState<string[]>(
    settings?.shippingCouriers && settings.shippingCouriers.length > 0
      ? settings.shippingCouriers
      : ["jne", "sicepat", "jnt"]
  );
  const [originId, setOriginId] = useState(warehouse?.rajaongkirOriginId ?? "79172");
  const [originLabel, setOriginLabel] = useState(
    warehouse?.originLabel ?? "Dikirim dari Gudang Makassar (Panakkukang)"
  );

  function toggleCourier(code: string) {
    if (couriers.includes(code)) {
      setCouriers(couriers.filter((c) => c !== code));
    } else {
      setCouriers([...couriers, code]);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (couriers.length === 0) {
      setMsg({ type: "error", text: "Minimal harus memilih satu kurir pengiriman aktif." });
      return;
    }
    if (!originId.trim()) {
      setMsg({ type: "error", text: "ID Wilayah asal pengiriman gudang tidak boleh kosong." });
      return;
    }

    startTransition(async () => {
      const res = await updateSettingsAction({
        supportEmail: email || null,
        supportWhatsapp: whatsapp || null,
        reservationHoldMinutes: Number(holdMinutes),
        shippingCouriers: couriers,
        warehouseOriginId: originId.trim(),
        warehouseOriginLabel: originLabel.trim() || "Gudang Utama Toko",
      });
      if (res.ok) {
        setMsg({
          type: "success",
          text: "Semua pengaturan operasional & ekspedisi pengiriman berhasil disimpan dan aktif!",
        });
      } else {
        setMsg({ type: "error", text: res.message });
      }
    });
  }

  const flags = settings?.featureFlags as { preorder?: boolean; supplier_fulfilled?: boolean } | null;

  return (
    <div className="space-y-8">
      <div>
        <span className="text-caption font-bold tracking-wider text-accent uppercase">Konfigurasi & Keamanan</span>
        <h1 className="mt-1 text-display font-bold text-ink">Pengaturan Toko & Pengiriman</h1>
        <p className="mt-1 text-small text-muted">
          Kelola parameter operasional, kurir ekspedisi RajaOngkir, asal gudang kirim, dan audit log (FR-019, FR-060, FR-061).
        </p>
      </div>

      {msg ? (
        <div
          role="alert"
          className={`rounded-input border p-3 text-small ${
            msg.type === "success"
              ? "border-success/30 bg-success/10 text-success"
              : "border-danger/30 bg-danger/10 text-danger"
          }`}
        >
          {msg.text}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Baris 1: Pengaturan Pengiriman & Asal Gudang */}
        <div className="rounded-card border border-accent/20 bg-surface p-6 shadow-low ring-1 ring-accent/10">
          <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="text-caption font-bold tracking-wider text-accent uppercase">Logistik & Ekspedisi</span>
              <h2 className="text-h3 font-bold text-ink">Konfigurasi Pengiriman Toko</h2>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-pill bg-success/10 px-3 py-1 text-caption font-bold text-success">
              <span className="size-2 rounded-full bg-success"></span>
              RajaOngkir Terhubung
            </span>
          </div>
          <p className="mt-1 text-small text-muted">
            Atur kurir yang aktif dan lokasi asal gudang pengiriman agar perhitungan ongkir di checkout pembeli berjalan normal.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {/* Pilihan Kurir */}
            <div>
              <label className="block text-small font-semibold text-ink">
                Kurir Ekspedisi yang Diaktifkan (Minimal 1)
              </label>
              <div className="mt-2.5 space-y-2">
                {AVAILABLE_COURIERS.map((c) => {
                  const isChecked = couriers.includes(c.code);
                  return (
                    <label
                      key={c.code}
                      className={`flex min-h-[var(--touch-target)] cursor-pointer items-center gap-3 rounded-input border p-3 transition-colors ${
                        isChecked
                          ? "border-accent bg-accent/5 font-semibold text-ink"
                          : "border-rule bg-paper text-muted hover:border-rule-strong"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCourier(c.code)}
                        className="size-4 accent-accent"
                      />
                      <span className="text-small">{c.name}</span>
                      <span className="ml-auto font-mono text-caption text-muted uppercase">{c.code}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Asal Gudang Pengiriman */}
            <div className="space-y-4">
              <div>
                <label htmlFor="originId" className="block text-small font-semibold text-ink">
                  ID Wilayah Asal Gudang (RajaOngkir Destination ID)
                </label>
                <input
                  id="originId"
                  value={originId}
                  onChange={(e) => setOriginId(e.target.value)}
                  placeholder="Contoh: 79172"
                  className="mt-1.5 min-h-[var(--touch-target)] w-full rounded-input border border-rule-strong bg-paper px-3 font-mono text-small text-ink focus:border-accent"
                  required
                />
                <p className="mt-1 text-caption text-muted">
                  ID wilayah kecamatan asal pengiriman dari API RajaOngkir. Contoh Makassar: <code>79172</code> (Panakkukang), <code>79117</code> (Tamalate/Bongaya).
                </p>
              </div>

              <div>
                <label htmlFor="originLabel" className="block text-small font-semibold text-ink">
                  Label Asal Kirim (Tampil ke Pembeli)
                </label>
                <input
                  id="originLabel"
                  value={originLabel}
                  onChange={(e) => setOriginLabel(e.target.value)}
                  placeholder="Contoh: Dikirim dari Gudang Makassar"
                  className="mt-1.5 min-h-[var(--touch-target)] w-full rounded-input border border-rule-strong bg-paper px-3 text-small text-ink focus:border-accent"
                  required
                />
                <p className="mt-1 text-caption text-muted">
                  Keterangan lokasi gudang yang akan dilihat pembeli di keranjang belanja & konfirmasi checkout.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Baris 2: Kontak Toko & Durasi Reservasi */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Form Kontak & Hold Stok */}
          <div className="rounded-card border border-rule bg-surface p-6 shadow-low">
            <h2 className="text-h3 font-bold text-ink">Layanan Pelanggan & Durasi Stok</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-small font-semibold text-ink">Email Layanan Pelanggan</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="support@dastertasbon.com"
                  className="mt-1 min-h-[var(--touch-target)] w-full rounded-input border border-rule-strong bg-paper px-3 text-small text-ink focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-small font-semibold text-ink">WhatsApp Layanan Pelanggan</label>
                <input
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+6281234567890"
                  className="mt-1 min-h-[var(--touch-target)] w-full rounded-input border border-rule-strong bg-paper px-3 text-small text-ink focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-small font-semibold text-ink">
                  Durasi Reservasi Stok Checkout (Menit)
                </label>
                <input
                  type="number"
                  min={10}
                  max={120}
                  value={holdMinutes}
                  onChange={(e) => setHoldMinutes(Number(e.target.value))}
                  className="mt-1 min-h-[var(--touch-target)] w-full rounded-input border border-rule-strong bg-paper px-3 text-small text-ink focus:border-accent"
                />
                <p className="mt-1 text-caption text-muted">
                  Standar: 30 menit. Batas waktu hold stok otomatis dilepaskan jika pesanan belum dibayar (BR-003).
                </p>
              </div>
            </div>
          </div>

          {/* Status Feature Flags */}
          <div className="rounded-card border border-rule bg-surface p-6 shadow-low">
            <h2 className="text-h3 font-bold text-ink">Status Mode Operasional (Feature Flags)</h2>
            <p className="mt-1 text-caption text-muted">
              Mode kombinasi dinonaktifkan secara bawaan sampai ada keputusan resmi owner (CLAUDE.md / OD-002).
            </p>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-input border border-rule bg-paper p-3 text-small">
                <div>
                  <span className="font-bold text-ink">Ready Stock (Gudang Sendiri)</span>
                  <p className="text-caption text-muted">Stok fisik langsung dikirim dari gudang toko.</p>
                </div>
                <span className="rounded-pill bg-success/15 px-2.5 py-0.5 text-caption font-bold text-success">
                  Aktif
                </span>
              </div>

              <div className="flex items-center justify-between rounded-input border border-rule bg-paper p-3 text-small">
                <div>
                  <span className="font-bold text-ink">Preorder (Produksi Terjadwal)</span>
                  <p className="text-caption text-muted">Masa tunggu produksi sebelum pengiriman.</p>
                </div>
                <span className="rounded-pill bg-muted/15 px-2.5 py-0.5 text-caption font-bold text-muted">
                  {flags?.preorder ? "Aktif" : "Nonaktif (OD-002)"}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-input border border-rule bg-paper p-3 text-small">
                <div>
                  <span className="font-bold text-ink">Supplier Fulfilled (Dropship Mitra)</span>
                  <p className="text-caption text-muted">Pengiriman langsung dari mitra produsen.</p>
                </div>
                <span className="rounded-pill bg-muted/15 px-2.5 py-0.5 text-caption font-bold text-muted">
                  {flags?.supplier_fulfilled ? "Aktif" : "Nonaktif (OD-002)"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isPending}
            className="flex min-h-[var(--touch-target)] items-center justify-center rounded-input bg-accent px-8 py-3 text-button font-bold text-ink-inverse shadow-medium transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            {isPending ? "Menyimpan seluruh konfigurasi..." : "Simpan Semua Pengaturan Toko"}
          </button>
        </div>
      </form>

      {/* Riwayat Audit Log (FR-060) */}
      <div className="rounded-card border border-rule bg-surface p-6 shadow-low">
        <h2 className="text-h3 font-bold text-ink">Riwayat Audit Log Sensitif</h2>
        <p className="mt-1 text-caption text-muted">
          Catatan tidak terhapus (immutable) memuat: aktor, aksi, objek, waktu, dan alasan perubahan (FR-060).
        </p>

        {auditLogs.length === 0 ? (
          <p className="py-6 text-center text-small text-muted">Belum ada riwayat audit log.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-small">
              <thead>
                <tr className="border-b border-rule font-bold text-ink">
                  <th className="py-2.5">Waktu</th>
                  <th className="py-2.5">Aksi</th>
                  <th className="py-2.5">Objek Sasaran</th>
                  <th className="py-2.5">ID Objek</th>
                  <th className="py-2.5">Keterangan / Alasan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule text-muted">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-paper-2/40">
                    <td className="py-3 text-caption">
                      {new Date(log.createdAt).toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 font-mono font-bold text-ink">{log.action}</td>
                    <td className="py-3 text-ink">{log.targetType}</td>
                    <td className="py-3 font-mono text-caption text-muted">{log.targetId?.slice(0, 8)}...</td>
                    <td className="py-3 text-caption text-muted">{log.reason || "—"}</td>
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
