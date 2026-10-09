"use client";

import { Suspense, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { loginStaff } from "./actions";

function AdminMasukContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/admin";

  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mfaNotice, setMfaNotice] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
    setMfaNotice(false);
    const fd = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await loginStaff(fd);
      if (res.ok) {
        if (res.needMfa) {
          setMfaNotice(true);
        } else {
          router.push(nextUrl);
          router.refresh();
        }
      } else {
        setErrorMsg(res.message);
      }
    });
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-4 py-12">
      <BrandLockup />

      <div className="mt-8 w-full max-w-[420px] rounded-card border border-rule bg-surface p-6 shadow-medium md:p-8">
        <div className="text-center">
          <span className="text-caption font-bold tracking-wider text-accent uppercase">Staff Portal</span>
          <h1 className="mt-1 text-h2 font-bold text-ink">Masuk Panel Admin</h1>
          <p className="mt-1 text-small text-muted">
            Khusus pengelola katalog, pesanan, keuangan, dan pengaturan toko.
          </p>
        </div>

        {errorMsg ? (
          <div role="alert" className="mt-6 rounded-input border border-danger/30 bg-danger/10 p-3 text-small text-danger">
            {errorMsg}
          </div>
        ) : null}

        {mfaNotice ? (
          <div className="mt-6 rounded-card border border-warning/30 bg-warning/10 p-4 text-small text-warning">
            <h2 className="font-bold">Verifikasi Dua Langkah (MFA) Diperlukan</h2>
            <p className="mt-1 text-caption text-ink">
              Akun staf kamu mewajibkan verifikasi TOTP/AAL2 aktif (SEC-001). Silakan masukkan kode OTP dari aplikasi authenticator kamu di dashboard Supabase atau selesaikan pendaftaran MFA.
            </p>
            <div className="mt-3">
              <Link
                href="/admin"
                className="inline-flex min-h-[var(--touch-target)] items-center justify-center rounded-input bg-accent px-4 text-small font-bold text-ink-inverse"
              >
                Lanjut ke Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-small font-semibold text-ink">
                Email Staf
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="staf@dastertasbon.com"
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
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="mt-1.5 min-h-[var(--touch-target)] w-full rounded-input border border-rule-strong bg-paper px-3 text-body text-ink placeholder:text-muted focus:border-accent"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="mt-2 flex min-h-[var(--touch-target)] w-full items-center justify-center rounded-input bg-accent px-4 py-2.5 text-button font-bold text-ink-inverse transition-colors hover:bg-accent-hover disabled:opacity-50"
            >
              {isPending ? "Memverifikasi hak staf..." : "Masuk Staf"}
            </button>
          </form>
        )}

        <div className="mt-6 border-t border-rule pt-4 text-center">
          <Link href="/" className="text-small text-muted hover:text-ink">
            ← Kembali ke Toko Depan
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminMasukPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper flex items-center justify-center">Memuat...</div>}>
      <AdminMasukContent />
    </Suspense>
  );
}
