"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BagIcon } from "@/components/ui/icons";

export function CartBadge({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  useEffect(() => {
    function onCartChange(e: Event) {
      const customEvent = e as CustomEvent<{ delta?: number; count?: number }>;
      if (typeof customEvent.detail?.count === "number") {
        setCount(customEvent.detail.count);
      } else if (typeof customEvent.detail?.delta === "number") {
        setCount((prev) => Math.max(0, prev + customEvent.detail.delta!));
      } else {
        setCount((prev) => prev + 1);
      }
    }
    window.addEventListener("cart:changed", onCartChange);
    return () => window.removeEventListener("cart:changed", onCartChange);
  }, []);

  return (
    <Link
      href="/keranjang"
      prefetch={true}
      className="relative inline-flex min-h-[var(--touch-target)] items-center gap-2 rounded-pill px-3 text-ink hover:bg-paper-2 transition-colors"
    >
      <BagIcon />
      <span className="text-small font-semibold">
        Keranjang
        <span className="sr-only">, {count} barang</span>
      </span>
      {count > 0 ? (
        <span
          aria-hidden="true"
          className="min-w-6 rounded-pill bg-accent px-1.5 text-center text-caption font-bold text-ink-inverse animate-in zoom-in-75 duration-150"
        >
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}
