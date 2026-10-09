"use client";

import { useEffect } from "react";
import Link from "next/link";
import { BrandLockup } from "@/components/brand/BrandLockup";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error secara internal di klien (FR-062: jangan mengekspos stack trace / secret ke UI)
    console.error("[app:error]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-4 py-16 text-center">
      <BrandLockup />
      <div className="mt-8 max-w-md rounded-card border border-rule bg-surface p-8 shadow-low">
        <span className="text-4xl text-danger">⚠️</span>
        <h1 className="mt-4 text-h2 font-bold text-ink">Terjadi Kendala Teknis</h1>
        <p className="mt-2 text-small text-muted">
          Mohon maaf, sistem sedang mengalami kendala sementara. Kami tidak menampilkan rincian error demi keamanan sistem.
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex min-h-[var(--touch-target)] items-center justify-center rounded-input bg-accent px-6 text-button font-bold text-ink-inverse hover:bg-accent-hover"
          >
            Coba Muat Ulang
          </button>
          <Link
            href="/"
            className="inline-flex min-h-[var(--touch-target)] items-center justify-center rounded-input border border-rule-strong bg-paper px-4 text-button font-semibold text-ink hover:bg-paper-2"
          >
            Ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
