"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LacakPesananPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");
  const [token, setToken] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    const cleanNum = orderNumber.trim();
    const cleanTok = token.trim();

    if (!cleanNum) {
      setErrorMsg("Masukkan nomor pesanan DTS.");
      return;
    }

    if (cleanTok) {
      router.push(`/pesanan/${encodeURIComponent(cleanNum)}?t=${encodeURIComponent(cleanTok)}`);
    } else {
      router.push(`/pesanan/${encodeURIComponent(cleanNum)}`);
    }
  }

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-[500px] flex-col justify-center px-4 py-12 md:px-6">
      <div className="rounded-card border border-rule bg-surface p-6 shadow-low md:p-8">
        <div className="text-center">
          <span className="text-caption font-bold tracking-wider text-accent uppercase">Pelacakan Pesanan</span>
          <h1 className="mt-1 text-h2 font-bold text-ink">Lacak Pesanan Kamu</h1>
          <p className="mt-2 text-small text-muted">
            Masukkan nomor pesanan dan token akses yang tercantum pada link konfirmasi pembelian kamu.
          </p>
        </div>

        {errorMsg ? (
          <div role="alert" className="mt-6 rounded-input border border-danger/30 bg-danger/10 p-3 text-small text-danger">
            {errorMsg}
          </div>
        ) : null}

        <form onSubmit={handleTrack} className="mt-6 space-y-4">
          <div>
            <label htmlFor="orderNumber" className="block text-small font-semibold text-ink">
              Nomor Pesanan (Public Number)
            </label>
            <input
              id="orderNumber"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Contoh: DTS-2026-XXXXX"
              required
              className="mt-1.5 min-h-[var(--touch-target)] w-full rounded-input border border-rule-strong bg-paper px-3 font-mono text-body text-ink placeholder:font-sans placeholder:text-muted focus:border-accent"
            />
          </div>

          <div>
            <label htmlFor="token" className="block text-small font-semibold text-ink">
              Token Akses Pengunjung <span className="font-normal text-muted">(opsional jika cookie tersimpan)</span>
            </label>
            <input
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Salin parameter 't=' dari link konfirmasi"
              className="mt-1.5 min-h-[var(--touch-target)] w-full rounded-input border border-rule-strong bg-paper px-3 text-small text-ink placeholder:text-muted focus:border-accent"
            />
            <p className="mt-1 text-caption text-muted">
              Untuk menjaga privasi alamat dan data pesanan (FR-028), nomor pesanan saja tidak cukup tanpa token akses unik.
            </p>
          </div>

          <button
            type="submit"
            className="mt-2 flex min-h-[var(--touch-target)] w-full items-center justify-center rounded-input bg-accent px-4 py-2.5 text-button font-bold text-ink-inverse hover:bg-accent-hover"
          >
            Lacak Sekarang
          </button>
        </form>

        <div className="mt-6 border-t border-rule pt-6 text-center text-small text-muted">
          Punya akun terdaftar?{" "}
          <Link href="/akun" className="font-bold text-accent hover:underline">
            Lihat semua pesanan di Akun Saya
          </Link>
        </div>
      </div>
    </main>
  );
}
