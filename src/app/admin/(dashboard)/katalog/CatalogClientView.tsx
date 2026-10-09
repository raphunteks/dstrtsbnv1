"use client";

import { useState, useTransition } from "react";
import { formatRupiah } from "@/lib/money";
import { toggleProductStatusAction } from "@/app/admin/actions";

type ProductVariant = {
  id: string;
  sku: string;
  stockOnHand: number;
  stockReserved: number;
  priceIdr: number;
  status: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  status: "draft" | "published" | "archived" | string;
  category: { name: string };
  minPriceIdr: number | null;
  maxPriceIdr: number | null;
  variants: ProductVariant[];
};

export function CatalogClientView({ initialProducts }: { initialProducts: Product[] }) {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = initialProducts.filter((p) => {
    if (filter !== "all" && p.status !== filter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function handleStatusChange(productId: string, newStatus: "draft" | "published" | "archived") {
    startTransition(async () => {
      await toggleProductStatusAction(productId, newStatus);
    });
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-caption font-bold tracking-wider text-accent uppercase">Manajemen Produk</span>
          <h1 className="mt-1 text-display font-bold text-ink">Katalog & Stok</h1>
          <p className="mt-1 text-small text-muted">Kelola status penerbitan, varian SKU, dan ketersediaan stok fisik.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Cari nama produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-h-[var(--touch-target)] w-full max-w-xs rounded-input border border-rule-strong bg-surface px-3 text-small text-ink placeholder:text-muted sm:w-auto"
        />
        <div className="flex gap-1.5 overflow-x-auto">
          {["all", "published", "draft", "archived"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`min-h-[var(--touch-target)] rounded-pill px-4 text-caption font-bold capitalize transition-colors ${
                filter === s
                  ? "bg-accent text-ink-inverse"
                  : "border border-rule-strong bg-surface text-muted hover:text-ink"
              }`}
            >
              {s === "all" ? "Semua Status" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-card border border-rule bg-surface p-4 shadow-low md:p-6">
        {filtered.length === 0 ? (
          <p className="py-10 text-center text-small text-muted">Tidak ada produk yang cocok dengan filter.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-small">
              <thead>
                <tr className="border-b border-rule font-bold text-ink">
                  <th className="py-3">Produk & Kategori</th>
                  <th className="py-3">Rentang Harga</th>
                  <th className="py-3">Varian & SKU</th>
                  <th className="py-3">Stok Fisik / Hold</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 text-right">Ubah Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule text-muted">
                {filtered.map((p) => {
                  const totalOnHand = p.variants.reduce((s, v) => s + v.stockOnHand, 0);
                  const totalReserved = p.variants.reduce((s, v) => s + v.stockReserved, 0);
                  return (
                    <tr key={p.id} className="hover:bg-paper-2/40">
                      <td className="py-4">
                        <div className="font-bold text-ink">{p.name}</div>
                        <div className="text-caption text-muted">{p.category?.name || "Kategori"} • /{p.slug}</div>
                      </td>
                      <td className="py-4 font-medium text-ink tabular">
                        {p.minPriceIdr ? formatRupiah(p.minPriceIdr) : "—"}
                        {p.maxPriceIdr && p.maxPriceIdr !== p.minPriceIdr ? ` – ${formatRupiah(p.maxPriceIdr)}` : ""}
                      </td>
                      <td className="py-4">
                        <span className="font-mono text-caption">{p.variants.length} varian</span>
                        <div className="text-caption text-muted truncate max-w-[150px]">
                          {p.variants.map((v) => v.sku).slice(0, 2).join(", ")}
                          {p.variants.length > 2 ? "..." : ""}
                        </div>
                      </td>
                      <td className="py-4 tabular">
                        <span className="font-bold text-ink">{totalOnHand} pcs</span>
                        {totalReserved > 0 ? (
                          <span className="ml-1 text-caption text-warning">({totalReserved} hold)</span>
                        ) : null}
                      </td>
                      <td className="py-4">
                        <span
                          className={`rounded-pill px-2.5 py-0.5 text-caption font-bold ${
                            p.status === "published"
                              ? "bg-success/15 text-success"
                              : p.status === "draft"
                              ? "bg-warning/15 text-warning"
                              : "bg-muted/15 text-muted"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <select
                          disabled={isPending}
                          value={p.status}
                          onChange={(e) =>
                            handleStatusChange(p.id, e.target.value as "draft" | "published" | "archived")
                          }
                          className="min-h-[36px] rounded-input border border-rule-strong bg-paper px-2 text-caption font-semibold text-ink focus:border-accent"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Publish</option>
                          <option value="archived">Arsipkan</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
