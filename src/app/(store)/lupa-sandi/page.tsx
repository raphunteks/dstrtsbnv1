"use client";

import { useTransition, useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "../masuk/actions";

export default function LupaSandiPage() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const res = await requestPasswordReset(formData);
      setMessage(res.message);
    });
  }

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-[440px] flex-col justify-center px-4 py-12 md:px-6">
      <div className="rounded-card border border-rule bg-surface p-6 shadow-low md:p-8">
        <div className="text-center">
          <h1 className="text-h2 font-bold text-ink">Pemulihan Kata Sandi</h1>
          <p className="mt-2 text-small text-muted">
            Masukkan alamat email yang terdaftar. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi kamu.
          </p>
        </div>

        {message ? (
          <div className="mt-6 rounded-card border border-info/30 bg-info/10 p-5 text-center">
            <p className="text-small text-ink">{message}</p>
            <div className="mt-6">
              <Link
                href="/masuk"
                className="inline-flex min-h-[var(--touch-target)] items-center justify-center rounded-input bg-accent px-6 py-2.5 text-button font-bold text-ink-inverse hover:bg-accent-hover"
              >
                Kembali ke Halaman Masuk
              </Link>
            </div>
          </div>
        ) : (
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

            <button
              type="submit"
              disabled={isPending}
              className="mt-2 flex min-h-[var(--touch-target)] w-full items-center justify-center rounded-input bg-accent px-4 py-2.5 text-button font-bold text-ink-inverse transition-colors hover:bg-accent-hover disabled:opacity-50"
            >
              {isPending ? "Mengirimkan..." : "Kirim Tautan Pemulihan"}
            </button>

            <div className="pt-2 text-center">
              <Link href="/masuk" className="text-small font-semibold text-accent hover:underline">
                Batal dan kembali masuk
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
