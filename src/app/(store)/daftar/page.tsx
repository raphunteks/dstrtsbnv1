"use client";

import { Suspense, useTransition, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { registerCustomer } from "./actions";

function DaftarContent() {
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/akun";

  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMsg(null);
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const res = await registerCustomer(formData);
      if (res.ok) {
        setIsSuccess(true);
      } else {
        setErrorMsg(res.message);
      }
    });
  }

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-[480px] flex-col justify-center px-4 py-12 md:px-6">
      <div className="rounded-card border border-rule bg-surface p-6 shadow-low md:p-8">
        <div className="text-center">
          <h1 className="text-h2 font-bold text-ink">Buat Akun Baru</h1>
          <p className="mt-2 text-small text-muted">
            Daftar untuk menyimpan alamat pengiriman dan melihat status seluruh pesanan kamu.
          </p>
        </div>

        {isSuccess ? (
          <div className="mt-6 rounded-card border border-success/30 bg-success/10 p-6 text-center">
            <h2 className="text-h3 font-bold text-success">Pendaftaran Berhasil!</h2>
            <p className="mt-2 text-small text-ink">
              Akun kamu telah dibuat. Silakan periksa email kamu untuk tautan verifikasi, atau langsung masuk.
            </p>
            <div className="mt-6">
              <Link
                href={`/masuk${nextUrl !== "/akun" ? `?next=${encodeURIComponent(nextUrl)}` : ""}`}
                className="inline-flex min-h-[var(--touch-target)] items-center justify-center rounded-input bg-accent px-6 py-2.5 text-button font-bold text-ink-inverse hover:bg-accent-hover"
              >
                Masuk ke Akun
              </Link>
            </div>
          </div>
        ) : (
          <>
            {errorMsg ? (
              <div
                role="alert"
                className="mt-6 rounded-input border border-danger/30 bg-danger/10 p-3 text-small text-danger"
              >
                {errorMsg}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="displayName" className="block text-small font-semibold text-ink">
                  Nama Lengkap
                </label>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  required
                  placeholder="Nama kamu"
                  className="mt-1.5 min-h-[var(--touch-target)] w-full rounded-input border border-rule-strong bg-paper px-3 text-body text-ink placeholder:text-muted focus:border-accent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-small font-semibold text-ink">
                  Alamat Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="nama@email.com"
                  className="mt-1.5 min-h-[var(--touch-target)] w-full rounded-input border border-rule-strong bg-paper px-3 text-body text-ink placeholder:text-muted focus:border-accent"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-small font-semibold text-ink">
                  Nomor WhatsApp / HP <span className="font-normal text-muted">(opsional)</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="081234567890"
                  className="mt-1.5 min-h-[var(--touch-target)] w-full rounded-input border border-rule-strong bg-paper px-3 text-body text-ink placeholder:text-muted focus:border-accent"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-small font-semibold text-ink">
                  Kata Sandi
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="Minimal 6 karakter"
                  className="mt-1.5 min-h-[var(--touch-target)] w-full rounded-input border border-rule-strong bg-paper px-3 text-body text-ink placeholder:text-muted focus:border-accent"
                />
              </div>

              {/* FR-034: Syarat layanan mandatory + opt-in marketing terpisah */}
              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-2.5 text-small text-ink">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    required
                    className="mt-1 size-4 rounded accent-accent"
                  />
                  <span>
                    Saya menyetujui{" "}
                    <Link href="/kebijakan/syarat" target="_blank" className="font-semibold text-accent underline">
                      Syarat & Ketentuan
                    </Link>{" "}
                    serta{" "}
                    <Link href="/kebijakan/privasi" target="_blank" className="font-semibold text-accent underline">
                      Kebijakan Privasi
                    </Link>{" "}
                    Daster Tasbon Olshop.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 text-small text-muted">
                  <input
                    type="checkbox"
                    name="marketingOptIn"
                    className="mt-1 size-4 rounded accent-accent"
                  />
                  <span>
                    Kirimkan saya rekomendasi produk baru dan promo eksklusif melalui email/WhatsApp (opsional).
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="mt-2 flex min-h-[var(--touch-target)] w-full items-center justify-center rounded-input bg-accent px-4 py-2.5 text-button font-bold text-ink-inverse transition-colors hover:bg-accent-hover disabled:opacity-50"
              >
                {isPending ? "Mendaftarkan..." : "Daftar Akun"}
              </button>
            </form>

            <div className="mt-6 border-t border-rule pt-6 text-center text-small text-muted">
              Sudah memiliki akun?{" "}
              <Link
                href={`/masuk${nextUrl !== "/akun" ? `?next=${encodeURIComponent(nextUrl)}` : ""}`}
                className="font-bold text-accent hover:underline"
              >
                Masuk di sini
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function DaftarPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">Memuat...</div>}>
      <DaftarContent />
    </Suspense>
  );
}
