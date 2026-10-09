import Link from "next/link";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { logoutStaff } from "./masuk/actions";

export const metadata = {
  title: "Admin Panel — Daster Tasbon Olshop",
  robots: { index: false, follow: false },
};

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/katalog", label: "Katalog & Produk", icon: "👗" },
  { href: "/admin/pesanan", label: "Pesanan & Kirim", icon: "📦" },
  { href: "/admin/promosi", label: "Kupon Promo", icon: "🏷️" },
  { href: "/admin/keuangan", label: "Keuangan & Refund", icon: "💰" },
  { href: "/admin/pengaturan", label: "Pengaturan & Audit", icon: "⚙️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-paper font-sans text-ink">
      {/* Sidebar Desktop */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-rule bg-surface p-4 md:flex">
        <div className="pb-4">
          <BrandLockup />
          <div className="mt-2 flex items-center gap-1.5 px-1">
            <span className="size-2 rounded-full bg-success"></span>
            <span className="text-caption font-bold text-muted uppercase">Panel Staf Toko</span>
          </div>
        </div>

        <nav className="mt-4 flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-[var(--touch-target)] items-center gap-3 rounded-input px-3 py-2 text-small font-semibold text-ink transition-colors hover:bg-paper-2"
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-rule pt-4">
          <Link
            href="/"
            target="_blank"
            className="flex min-h-[var(--touch-target)] items-center gap-2 rounded-input px-3 py-2 text-small font-medium text-muted hover:text-ink hover:bg-paper"
          >
            <span>🌐</span>
            <span>Lihat Toko Depan ↗</span>
          </Link>
          <form action={logoutStaff} className="mt-2">
            <button
              type="submit"
              className="flex min-h-[var(--touch-target)] w-full items-center gap-2 rounded-input px-3 py-2 text-small font-semibold text-danger hover:bg-danger/10"
            >
              <span>🚪</span>
              <span>Keluar Sesi</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* Top Header Mobile */}
        <header className="sticky top-0 z-20 flex min-h-[var(--touch-target)] items-center justify-between border-b border-rule bg-surface/95 px-4 py-2.5 backdrop-blur md:hidden">
          <BrandLockup />
          <Link
            href="/"
            className="text-small font-bold text-accent"
          >
            Toko ↗
          </Link>
        </header>

        {/* Mobile Horizontal Navigation */}
        <nav className="flex gap-2 overflow-x-auto border-b border-rule bg-paper-2 px-4 py-2 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex min-h-[var(--touch-target)] shrink-0 items-center gap-1.5 rounded-pill bg-surface px-3 py-1 text-caption font-bold text-ink shadow-low"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Page View */}
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
