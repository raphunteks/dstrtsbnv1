import Link from "next/link";
import { BrandLockup } from "@/components/brand/BrandLockup";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-4 py-16 text-center">
      <BrandLockup />
      <div className="mt-8 max-w-md rounded-card border border-rule bg-surface p-8 shadow-low">
        <span className="font-mono text-5xl font-black text-accent">404</span>
        <h1 className="mt-4 text-h2 font-bold text-ink">Halaman Tidak Ditemukan</h1>
        <p className="mt-2 text-small text-muted">
          Maaf, halaman atau produk daster yang kamu tuju mungkin telah dipindahkan, habis, atau tautannya keliru.
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex min-h-[var(--touch-target)] items-center justify-center rounded-input bg-accent px-6 text-button font-bold text-ink-inverse hover:bg-accent-hover"
          >
            Kembali ke Beranda
          </Link>
          <Link
            href="/bantuan"
            className="inline-flex min-h-[var(--touch-target)] items-center justify-center rounded-input border border-rule-strong bg-paper px-4 text-button font-semibold text-ink hover:bg-paper-2"
          >
            Pusat Bantuan
          </Link>
        </div>
      </div>
    </div>
  );
}
