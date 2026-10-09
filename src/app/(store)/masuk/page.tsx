"use client";

import { Suspense, useTransition, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginWithPassword } from "./actions";

function MasukContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/akun";

  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMsg(null);
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const res = await loginWithPassword(formData);
      if (res.ok) {
        router.push(nextUrl);
        router.refresh();
      } else {
        setErrorMsg(res.message);
      }
    });
  }

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-[440px] flex-col justify-center px-4 py-12 md:px-6">
      <div className="rounded-card border border-rule bg-surface p-6 shadow-low md:p-8">
        <div className="text-center">
          <h1 className="text-h2 font-bold text-ink">Masuk ke Akun</h1>
          <p className="mt-2 text-small text-muted">
            Akses riwayat pesanan, lacak pengiriman, dan kelola alamat tersimpan kamu.
          </p>
        </div>

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
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-small font-semibold text-ink">
                Kata Sandi
              </label>
              <Link
                href="/lupa-sandi"
                className="text-small font-medium text-accent hover:underline focus:underline"
              >
                Lupa sandi?
              </Link>
            </div>
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
            {isPending ? "Memeriksa..." : "Masuk"}
          </button>
        </form>

        <div className="mt-6 border-t border-rule pt-6 text-center text-small text-muted">
          Belum punya akun?{" "}
          <Link
            href={`/daftar${nextUrl !== "/akun" ? `?next=${encodeURIComponent(nextUrl)}` : ""}`}
            className="font-bold text-accent hover:underline"
          >
            Daftar sekarang
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function MasukPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">Memuat...</div>}>
      <MasukContent />
    </Suspense>
  );
}
