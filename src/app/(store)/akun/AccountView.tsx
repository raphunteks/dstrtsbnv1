"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { formatRupiah } from "@/lib/money";
import { customerOrderStatus, type OrderStatusValue } from "@/lib/order-status-labels";
import {
  signOutAction,
  updateProfileAction,
  addAddressAction,
  deleteAddressAction,
  setDefaultAddressAction,
} from "./actions";

type OrderItem = {
  id: string;
  productNameSnap: string;
  skuSnap: string;
  attributesSnap: Record<string, unknown> | null;
  unitPriceIdr: number;
  lineTotalIdr: number;
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
  items: OrderItem[];
};

type Address = {
  id: string;
  label: string | null;
  recipientName: string;
  phone: string;
  provinceName: string;
  cityName: string;
  districtName: string;
  postalCode: string | null;
  street: string;
  landmark: string | null;
  isDefault: boolean;
};

type AccountViewProps = {
  email: string;
  phone: string | null;
  displayName: string | null;
  marketingOptIn: boolean;
  addresses: Address[];
  orders: Order[];
};

export function AccountView({
  email,
  phone,
  displayName,
  marketingOptIn,
  addresses,
  orders,
}: AccountViewProps) {
  const [activeTab, setActiveTab] = useState<"pesanan" | "alamat" | "profil">("pesanan");
  const [isPending, startTransition] = useTransition();
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Edit profil state
  const [editName, setEditName] = useState(displayName ?? "");
  const [editPhone, setEditPhone] = useState(phone ?? "");
  const [editMarketing, setEditMarketing] = useState(marketingOptIn);

  function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setStatusMessage(null);
    startTransition(async () => {
      const res = await updateProfileAction({
        displayName: editName,
        phone: editPhone || undefined,
        marketingOptIn: editMarketing,
      });
      if (res.ok) {
        setStatusMessage("Profil berhasil diperbarui.");
      } else {
        setStatusMessage(res.message ?? "Gagal memperbarui profil.");
      }
    });
  }

  function handleAddAddress(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await addAddressAction({
        label: (fd.get("label") as string) || "Alamat Rumah",
        recipientName: fd.get("recipientName") as string,
        phone: fd.get("phone") as string,
        provinceName: fd.get("provinceName") as string,
        cityName: fd.get("cityName") as string,
        districtName: fd.get("districtName") as string,
        postalCode: (fd.get("postalCode") as string) || undefined,
        street: fd.get("street") as string,
        landmark: (fd.get("landmark") as string) || undefined,
        isDefault: fd.get("isDefault") === "on",
      });
      if (res.ok) {
        setShowAddAddress(false);
        setStatusMessage("Alamat baru berhasil ditambahkan.");
      } else {
        setStatusMessage(res.message ?? "Gagal menambahkan alamat.");
      }
    });
  }

  return (
    <div className="mx-auto max-w-[var(--layout-max)] px-4 py-8 md:px-6">
      {/* Top Header Card */}
      <div className="flex flex-col gap-4 rounded-card border border-rule bg-surface p-6 shadow-low md:flex-row md:items-center md:justify-between">
        <div>
          <span className="text-caption font-bold tracking-wide text-accent uppercase">Akun Pelanggan</span>
          <h1 className="mt-1 text-h2 font-bold text-ink">{displayName || email}</h1>
          <p className="text-small text-muted">{email} {phone ? `• ${phone}` : ""}</p>
        </div>
        <form action={signOutAction}>
          <button
            type="submit"
            className="inline-flex min-h-[var(--touch-target)] items-center justify-center rounded-input border border-rule-strong bg-paper px-4 py-2 text-small font-semibold text-ink hover:bg-paper-2"
          >
            Keluar dari Akun
          </button>
        </form>
      </div>

      {statusMessage ? (
        <div className="mt-4 rounded-input border border-info/30 bg-info/10 p-3 text-small text-info">
          {statusMessage}
        </div>
      ) : null}

      {/* Tabs Navigation */}
      <div className="mt-8 flex border-b border-rule" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === "pesanan"}
          onClick={() => setActiveTab("pesanan")}
          className={`min-h-[var(--touch-target)] px-4 text-small font-bold transition-colors ${
            activeTab === "pesanan"
              ? "border-b-2 border-accent text-accent"
              : "text-muted hover:text-ink"
          }`}
        >
          Pesanan Saya ({orders.length})
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "alamat"}
          onClick={() => setActiveTab("alamat")}
          className={`min-h-[var(--touch-target)] px-4 text-small font-bold transition-colors ${
            activeTab === "alamat"
              ? "border-b-2 border-accent text-accent"
              : "text-muted hover:text-ink"
          }`}
        >
          Buku Alamat ({addresses.length})
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "profil"}
          onClick={() => setActiveTab("profil")}
          className={`min-h-[var(--touch-target)] px-4 text-small font-bold transition-colors ${
            activeTab === "profil"
              ? "border-b-2 border-accent text-accent"
              : "text-muted hover:text-ink"
          }`}
        >
          Profil & Privasi
        </button>
      </div>

      {/* TAB 1: PESANAN SAYA */}
      {activeTab === "pesanan" ? (
        <div className="mt-6 space-y-4">
          {orders.length === 0 ? (
            <div className="rounded-card border border-rule bg-surface p-10 text-center">
              <h2 className="text-h3 font-bold text-ink">Belum Ada Pesanan</h2>
              <p className="mt-2 text-small text-muted">
                Kamu belum pernah melakukan pemesanan di Daster Tasbon Olshop.
              </p>
              <div className="mt-6">
                <Link
                  href="/"
                  className="inline-flex min-h-[var(--touch-target)] items-center justify-center rounded-input bg-accent px-6 py-2.5 text-button font-bold text-ink-inverse hover:bg-accent-hover"
                >
                  Mulai Belanja Koleksi
                </Link>
              </div>
            </div>
          ) : (
            orders.map((o) => {
              const label = customerOrderStatus[o.status as OrderStatusValue]?.label ?? o.status;
              return (
                <div
                  key={o.id}
                  className="rounded-card border border-rule bg-surface p-5 shadow-low transition-shadow hover:shadow-medium md:p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-4">
                    <div>
                      <span className="text-caption font-semibold text-muted">Nomor Pesanan</span>
                      <p className="font-mono text-body font-bold text-ink">{o.publicNumber}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-caption text-muted">
                        {new Date(o.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <span className="rounded-pill bg-paper-2 px-3 py-1 text-caption font-bold text-accent">
                        {label}
                      </span>
                    </div>
                  </div>

                  {/* Items snapshot */}
                  <div className="py-4">
                    <ul className="space-y-2">
                      {o.items.map((it) => (
                        <li key={it.id} className="flex items-center justify-between text-small">
                          <div>
                            <span className="font-semibold text-ink">{it.productNameSnap}</span>
                            <span className="ml-2 text-muted">× {it.quantity}</span>
                          </div>
                          <span className="font-medium text-ink tabular">
                            {formatRupiah(it.lineTotalIdr)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between border-t border-rule pt-4">
                    <div>
                      <span className="text-caption text-muted">Total Pembayaran:</span>
                      <p className="text-price font-bold text-accent tabular">
                        {formatRupiah(o.grandTotalIdr)}
                      </p>
                    </div>
                    <Link
                      href={`/pesanan/${o.publicNumber}`}
                      className="inline-flex min-h-[var(--touch-target)] items-center justify-center rounded-input bg-accent px-4 py-2 text-small font-bold text-ink-inverse hover:bg-accent-hover"
                    >
                      Lihat Rincian & Lacak
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : null}

      {/* TAB 2: BUKU ALAMAT */}
      {activeTab === "alamat" ? (
        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-h3 font-bold text-ink">Alamat Tersimpan</h2>
            <button
              onClick={() => setShowAddAddress(!showAddAddress)}
              className="inline-flex min-h-[var(--touch-target)] items-center justify-center rounded-input bg-accent px-4 py-2 text-small font-bold text-ink-inverse hover:bg-accent-hover"
            >
              {showAddAddress ? "Tutup Form" : "+ Tambah Alamat"}
            </button>
          </div>

          {showAddAddress ? (
            <div className="rounded-card border border-rule bg-surface p-6 shadow-low">
              <h3 className="text-h3 font-bold text-ink">Tambah Alamat Baru</h3>
              <form onSubmit={handleAddAddress} className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-small font-semibold text-ink">Label Alamat</label>
                  <input
                    name="label"
                    placeholder="Rumah, Kantor, Toko"
                    className="mt-1 min-h-[var(--touch-target)] w-full rounded-input border border-rule-strong bg-paper px-3 text-small text-ink"
                  />
                </div>
                <div>
                  <label className="block text-small font-semibold text-ink">Nama Penerima *</label>
                  <input
                    name="recipientName"
                    required
                    placeholder="Nama penerima paket"
                    className="mt-1 min-h-[var(--touch-target)] w-full rounded-input border border-rule-strong bg-paper px-3 text-small text-ink"
                  />
                </div>
                <div>
                  <label className="block text-small font-semibold text-ink">Nomor Telepon/HP *</label>
                  <input
                    name="phone"
                    required
                    type="tel"
                    placeholder="081234567890"
                    className="mt-1 min-h-[var(--touch-target)] w-full rounded-input border border-rule-strong bg-paper px-3 text-small text-ink"
                  />
                </div>
                <div>
                  <label className="block text-small font-semibold text-ink">Provinsi *</label>
                  <input
                    name="provinceName"
                    required
                    placeholder="Contoh: Sulawesi Selatan"
                    className="mt-1 min-h-[var(--touch-target)] w-full rounded-input border border-rule-strong bg-paper px-3 text-small text-ink"
                  />
                </div>
                <div>
                  <label className="block text-small font-semibold text-ink">Kota / Kabupaten *</label>
                  <input
                    name="cityName"
                    required
                    placeholder="Contoh: Makassar"
                    className="mt-1 min-h-[var(--touch-target)] w-full rounded-input border border-rule-strong bg-paper px-3 text-small text-ink"
                  />
                </div>
                <div>
                  <label className="block text-small font-semibold text-ink">Kecamatan *</label>
                  <input
                    name="districtName"
                    required
                    placeholder="Contoh: Panakkukang"
                    className="mt-1 min-h-[var(--touch-target)] w-full rounded-input border border-rule-strong bg-paper px-3 text-small text-ink"
                  />
                </div>
                <div>
                  <label className="block text-small font-semibold text-ink">Kode Pos</label>
                  <input
                    name="postalCode"
                    placeholder="90222"
                    className="mt-1 min-h-[var(--touch-target)] w-full rounded-input border border-rule-strong bg-paper px-3 text-small text-ink"
                  />
                </div>
                <div>
                  <label className="block text-small font-semibold text-ink">Patokan Lokasi</label>
                  <input
                    name="landmark"
                    placeholder="Dekat masjid / pagar hitam"
                    className="mt-1 min-h-[var(--touch-target)] w-full rounded-input border border-rule-strong bg-paper px-3 text-small text-ink"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-small font-semibold text-ink">Alamat Lengkap / Jalan *</label>
                  <textarea
                    name="street"
                    required
                    rows={2}
                    placeholder="Jalan, nomor rumah, RT/RW, kelurahan"
                    className="mt-1 w-full rounded-input border border-rule-strong bg-paper p-3 text-small text-ink"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-small text-ink">
                    <input type="checkbox" name="isDefault" className="size-4 rounded accent-accent" />
                    Jadikan sebagai alamat pengiriman utama
                  </label>
                </div>
                <div className="flex gap-2 md:col-span-2">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="min-h-[var(--touch-target)] rounded-input bg-accent px-6 text-button font-bold text-ink-inverse hover:bg-accent-hover disabled:opacity-50"
                  >
                    {isPending ? "Menyimpan..." : "Simpan Alamat"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddAddress(false)}
                    className="min-h-[var(--touch-target)] rounded-input border border-rule-strong bg-paper px-4 text-button font-semibold text-ink hover:bg-paper-2"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          ) : null}

          {addresses.length === 0 ? (
            <p className="text-small text-muted">Belum ada alamat tersimpan.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {addresses.map((a) => (
                <div
                  key={a.id}
                  className={`rounded-card border p-5 shadow-low ${
                    a.isDefault ? "border-accent bg-paper-2/40" : "border-rule bg-surface"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-caption font-bold text-muted uppercase">
                        {a.label || "Alamat"}
                      </span>
                      <h4 className="text-body font-bold text-ink">{a.recipientName}</h4>
                      <p className="text-small text-muted">{a.phone}</p>
                    </div>
                    {a.isDefault ? (
                      <span className="rounded-pill bg-accent px-2.5 py-0.5 text-caption font-bold text-ink-inverse">
                        Alamat Utama
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-3 text-small text-ink">{a.street}</p>
                  <p className="text-small text-muted">
                    {a.districtName}, {a.cityName}, {a.provinceName} {a.postalCode ? `(${a.postalCode})` : ""}
                  </p>
                  {a.landmark ? <p className="text-caption text-muted">Patokan: {a.landmark}</p> : null}

                  <div className="mt-4 flex items-center gap-2 border-t border-rule pt-3">
                    {!a.isDefault ? (
                      <button
                        onClick={() =>
                          startTransition(async () => {
                            await setDefaultAddressAction(a.id);
                          })
                        }
                        className="text-small font-semibold text-accent hover:underline"
                      >
                        Jadikan Utama
                      </button>
                    ) : null}
                    <button
                      onClick={() => {
                        if (confirm("Hapus alamat ini?")) {
                          startTransition(async () => {
                            await deleteAddressAction(a.id);
                          });
                        }
                      }}
                      className="ml-auto text-small text-danger hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {/* TAB 3: PROFIL & PRIVASI */}
      {activeTab === "profil" ? (
        <div className="mt-6 max-w-xl rounded-card border border-rule bg-surface p-6 shadow-low">
          <h2 className="text-h3 font-bold text-ink">Informasi Akun</h2>
          <form onSubmit={handleUpdateProfile} className="mt-4 space-y-4">
            <div>
              <label className="block text-small font-semibold text-ink">Alamat Email</label>
              <input
                disabled
                value={email}
                className="mt-1 min-h-[var(--touch-target)] w-full rounded-input border border-rule bg-paper-2 px-3 text-small text-muted cursor-not-allowed"
              />
              <p className="mt-1 text-caption text-muted">Email terdaftar tidak dapat diubah langsung.</p>
            </div>

            <div>
              <label className="block text-small font-semibold text-ink">Nama Tampilan</label>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
                className="mt-1 min-h-[var(--touch-target)] w-full rounded-input border border-rule-strong bg-paper px-3 text-small text-ink"
              />
            </div>

            <div>
              <label className="block text-small font-semibold text-ink">Nomor Telepon/WhatsApp</label>
              <input
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="081234567890"
                className="mt-1 min-h-[var(--touch-target)] w-full rounded-input border border-rule-strong bg-paper px-3 text-small text-ink"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 text-small text-ink">
                <input
                  type="checkbox"
                  checked={editMarketing}
                  onChange={(e) => setEditMarketing(e.target.checked)}
                  className="mt-1 size-4 rounded accent-accent"
                />
                <span>
                  Kirimkan saya rekomendasi produk dan promo eksklusif (opt-in pemasaran terpisah dari transaksi).
                </span>
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="min-h-[var(--touch-target)] rounded-input bg-accent px-6 text-button font-bold text-ink-inverse hover:bg-accent-hover disabled:opacity-50"
              >
                {isPending ? "Menyimpan..." : "Simpan Perubahan Profil"}
              </button>
            </div>
          </form>

          {/* FR-037: Informasi privasi & penghapusan data */}
          <div className="mt-8 border-t border-rule pt-6">
            <h3 className="text-small font-bold text-ink">Hak Privasi & Penghapusan Data</h3>
            <p className="mt-1 text-small text-muted">
              Sesuai ketentuan perlindungan data pribadi (UU PDP / FR-037), kamu berhak meminta koreksi atau penghapusan akun. Data riwayat transaksi finansial yang wajib disimpan untuk pelaporan pajak akan diarsipkan sesuai hukum. Hubungi tim support kami melalui menu bantuan jika ingin mengajukan penutupan akun.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
