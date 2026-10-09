"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tag,
  Wallet,
  Settings,
  ExternalLink,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { logoutStaff } from "@/app/admin/masuk/actions";
import { cn } from "@/lib/cn";

gsap.registerPlugin(useGSAP);

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/katalog", label: "Katalog & Produk", icon: ShoppingBag },
  { href: "/admin/pesanan", label: "Pesanan & Kirim", icon: Package },
  { href: "/admin/promosi", label: "Kupon Promo", icon: Tag },
  { href: "/admin/keuangan", label: "Keuangan & Refund", icon: Wallet },
  { href: "/admin/pengaturan", label: "Pengaturan & Audit", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);

  // Restore collapsed state from localStorage on client mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem("admin_sidebar_collapsed");
      if (saved !== null) {
        setIsCollapsed(saved === "true");
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, []);

  // Save collapsed state
  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("admin_sidebar_collapsed", String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  // Close mobile drawer on route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // GSAP animation on mount & item entrance
  useGSAP(
    () => {
      if (navContainerRef.current) {
        gsap.fromTo(
          navContainerRef.current.querySelectorAll(".nav-item-link"),
          { opacity: 0, x: -10 },
          { opacity: 1, x: 0, duration: 0.35, stagger: 0.05, ease: "power2.out" }
        );
      }
    },
    { scope: sidebarRef, dependencies: [isMounted] }
  );

  const isLinkActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ── MOBILE / TABLET TOP NAVIGATION BAR ── */}
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-rule bg-surface/95 px-4 backdrop-blur md:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            aria-label="Buka menu navigasi admin"
            className="inline-flex size-10 items-center justify-center rounded-lg border border-rule bg-paper text-ink transition-colors hover:bg-paper-2 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <Menu className="size-5" />
          </button>
          <BrandLockup compact />
          <div className="flex items-center gap-1.5">
            <span className="size-2 animate-pulse rounded-full bg-success"></span>
            <span className="text-[11px] font-bold tracking-wider text-muted uppercase">Admin</span>
          </div>
        </div>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-pill border border-rule bg-paper px-3 py-1.5 text-caption font-bold text-ink transition-colors hover:border-accent hover:text-accent"
        >
          <span>Toko</span>
          <ExternalLink className="size-3.5" />
        </Link>
      </header>

      {/* ── MOBILE / TABLET DRAWER SHEET & BACKDROP ── */}
      {isMobileOpen ? (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="relative z-10 flex w-72 max-w-[85vw] flex-col border-r border-rule bg-surface p-5 shadow-2xl transition-transform">
            <div className="flex items-center justify-between border-b border-rule pb-4">
              <div>
                <BrandLockup />
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-success"></span>
                  <span className="text-[11px] font-bold tracking-wider text-muted uppercase">
                    Panel Staf Toko
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                aria-label="Tutup menu navigasi"
                className="inline-flex size-9 items-center justify-center rounded-md border border-rule text-muted transition-colors hover:bg-paper-2 hover:text-ink"
              >
                <X className="size-5" />
              </button>
            </div>

            <nav className="mt-4 flex-1 space-y-1.5 overflow-y-auto py-2">
              {navItems.map((item) => {
                const active = isLinkActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "flex min-h-[44px] items-center gap-3 rounded-lg px-3.5 py-2.5 text-small font-semibold transition-all",
                      active
                        ? "border border-accent/20 bg-accent text-ink-inverse shadow-xs font-bold"
                        : "text-ink hover:bg-paper-2"
                    )}
                  >
                    <Icon className={cn("size-5 shrink-0", active ? "text-ink-inverse" : "text-muted")} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-rule pt-4 space-y-2">
              <Link
                href="/"
                target="_blank"
                className="flex min-h-[44px] items-center gap-2.5 rounded-lg px-3.5 py-2 text-small font-medium text-muted transition-colors hover:bg-paper hover:text-ink"
              >
                <ExternalLink className="size-4 shrink-0" />
                <span>Lihat Toko Depan ↗</span>
              </Link>
              <form action={logoutStaff}>
                <button
                  type="submit"
                  className="flex min-h-[44px] w-full items-center gap-2.5 rounded-lg px-3.5 py-2 text-small font-semibold text-danger transition-colors hover:bg-danger/10"
                >
                  <LogOut className="size-4 shrink-0" />
                  <span>Keluar Sesi</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}

      {/* ── DESKTOP COLLAPSIBLE SIDEBAR ── */}
      <aside
        ref={sidebarRef}
        aria-label="Navigasi admin toko"
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-rule bg-surface transition-all duration-300 ease-in-out md:flex z-20",
          isCollapsed ? "w-[76px] p-3" : "w-64 p-4"
        )}
      >
        {/* Sidebar Header & Collapse Toggle */}
        <div className="relative flex items-center justify-between border-b border-rule/70 pb-4">
          <div className={cn("flex flex-col overflow-hidden transition-opacity", isCollapsed ? "items-center w-full" : "")}>
            <BrandLockup compact={isCollapsed} />
            {!isCollapsed && (
              <div className="mt-2 flex items-center gap-1.5 px-0.5">
                <span className="size-2 rounded-full bg-success"></span>
                <span className="text-[11px] font-bold tracking-wider text-muted uppercase">
                  Panel Staf Toko
                </span>
              </div>
            )}
          </div>

          {/* Toggle Button with < and > */}
          <button
            type="button"
            onClick={toggleCollapse}
            aria-label={isCollapsed ? "Perlebar sidebar (>)" : "Ciutkan sidebar (<)"}
            title={isCollapsed ? "Perlebar sidebar (>)" : "Ciutkan sidebar (<)"}
            className={cn(
              "inline-flex size-7 items-center justify-center rounded-full border border-rule bg-surface text-ink shadow-xs transition-transform hover:scale-105 hover:bg-paper-2 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent",
              isCollapsed ? "mx-auto mt-2" : "shrink-0 ml-1"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <ChevronLeft className="size-4" />
            )}
          </button>
        </div>

        {/* Main Navigation Items */}
        <nav ref={navContainerRef} className="mt-4 flex-1 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = isLinkActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={cn(
                  "nav-item-link group relative flex min-h-[44px] items-center rounded-lg transition-all",
                  isCollapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3.5 py-2.5",
                  active
                    ? "bg-accent text-ink-inverse font-bold shadow-xs"
                    : "text-ink hover:bg-paper-2 font-medium"
                )}
              >
                <Icon
                  className={cn(
                    "size-5 shrink-0 transition-transform group-hover:scale-110",
                    active ? "text-ink-inverse" : "text-muted group-hover:text-ink"
                  )}
                />
                {!isCollapsed && <span className="text-small truncate">{item.label}</span>}

                {/* Collapsed Active Indicator Pill */}
                {isCollapsed && active && (
                  <span className="absolute left-1 h-5 w-1 rounded-full bg-ink-inverse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-rule/70 pt-3 space-y-1.5">
          <Link
            href="/"
            target="_blank"
            title={isCollapsed ? "Lihat Toko Depan ↗" : undefined}
            className={cn(
              "flex min-h-[40px] items-center rounded-lg text-small font-medium text-muted transition-colors hover:bg-paper hover:text-ink",
              isCollapsed ? "justify-center px-0 py-2" : "gap-2.5 px-3 py-2"
            )}
          >
            <ExternalLink className="size-4.5 shrink-0" />
            {!isCollapsed && <span className="truncate">Lihat Toko Depan ↗</span>}
          </Link>

          <form action={logoutStaff}>
            <button
              type="submit"
              title={isCollapsed ? "Keluar Sesi" : undefined}
              className={cn(
                "flex min-h-[40px] w-full items-center rounded-lg text-small font-semibold text-danger transition-colors hover:bg-danger/10",
                isCollapsed ? "justify-center px-0 py-2" : "gap-2.5 px-3 py-2"
              )}
            >
              <LogOut className="size-4.5 shrink-0" />
              {!isCollapsed && <span className="truncate">Keluar Sesi</span>}
            </button>
          </form>

          {!isCollapsed && (
            <div className="mt-3 flex items-center justify-between rounded-md bg-paper-2/60 px-2.5 py-1.5 text-[11px] text-muted">
              <span className="flex items-center gap-1 font-mono">
                <ShieldCheck className="size-3 text-success" /> v1.2 Enterprise
              </span>
              <span>Daster Tasbon</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
