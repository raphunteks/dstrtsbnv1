"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  Calendar,
  Layers,
} from "lucide-react";
import { formatRupiah } from "@/lib/money";

gsap.registerPlugin(useGSAP);

export interface DailySalesPoint {
  date: string;
  displayDate: string;
  revenue: number;
  orders: number;
}

export interface StatusDistributionPoint {
  status: string;
  label: string;
  count: number;
  fill: string;
}

export interface CategoryDistributionPoint {
  name: string;
  value: number;
}

interface DashboardChartsProps {
  salesTrend: DailySalesPoint[];
  statusDistribution: StatusDistributionPoint[];
  categoryDistribution: CategoryDistributionPoint[];
  totalSales: number;
  totalOrders: number;
}

const CATEGORY_COLORS = ["#813A56", "#B35A7D", "#4B2233", "#D9822B", "#0F766E", "#2563EB", "#64748B"];

export function DashboardCharts({
  salesTrend,
  statusDistribution,
  categoryDistribution,
  totalSales,
  totalOrders,
}: DashboardChartsProps) {
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useGSAP(
    () => {
      if (isMounted && containerRef.current) {
        gsap.fromTo(
          containerRef.current.querySelectorAll(".chart-card"),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: "power2.out" }
        );
      }
    },
    { scope: containerRef, dependencies: [isMounted] }
  );

  if (!isMounted) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-80 animate-pulse rounded-card border border-rule bg-surface p-6" />
        <div className="h-80 animate-pulse rounded-card border border-rule bg-surface p-6" />
      </div>
    );
  }

  // Fallback category items if none exist
  const pieData =
    categoryDistribution.length > 0 && categoryDistribution.some((c) => c.value > 0)
      ? categoryDistribution
      : [
          { name: "Daster Rayon Premium", value: 8 },
          { name: "Daster Kaos Santai", value: 5 },
          { name: "Daster Silk Satin", value: 4 },
          { name: "Setelan Busana Rumah", value: 3 },
        ];

  return (
    <div ref={containerRef} className="space-y-6">
      {/* ── ROW 1: TREN PENJUALAN & OMZET (AREA CHART) ── */}
      <div className="chart-card rounded-card border border-rule bg-surface p-5 shadow-low md:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-rule pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <TrendingUp className="size-4.5" />
              </span>
              <h2 className="text-h3 font-bold text-ink">Tren Penjualan & Omzet Realtime</h2>
            </div>
            <p className="mt-1 text-caption text-muted">
              Pergerakan transaksi harian dan akumulasi nilai rupiah terkonfirmasi
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full border border-rule bg-paper px-3 py-1 text-caption font-semibold text-muted">
              <Calendar className="size-3.5 text-accent" />
              <span>14 Hari Terakhir</span>
            </div>
            <span className="text-small font-bold text-accent">
              {formatRupiah(totalSales)}
            </span>
          </div>
        </div>

        <div className="mt-6 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#813A56" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#813A56" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284C7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0284C7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-rule, #E2E8F0)" />
              <XAxis
                dataKey="displayDate"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "var(--color-muted, #64748B)" }}
              />
              <YAxis
                yAxisId="rev"
                orientation="left"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--color-muted, #64748B)" }}
                tickFormatter={(val: number) => {
                  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}jt`;
                  if (val >= 1_000) return `${(val / 1_000).toFixed(0)}rb`;
                  return `${val}`;
                }}
              />
              <YAxis
                yAxisId="ord"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#0284C7" }}
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length > 0 && payload[0]?.payload) {
                    const data = payload[0].payload as DailySalesPoint;
                    return (
                      <div className="rounded-lg border border-rule bg-surface p-3 shadow-medium">
                        <p className="text-caption font-bold text-ink">{data.date}</p>
                        <div className="mt-1.5 space-y-1">
                          <p className="text-small font-semibold text-accent">
                            Omzet: {formatRupiah(data.revenue)}
                          </p>
                          <p className="text-caption text-sky-600 font-medium">
                            Pesanan: {data.orders} transaksi
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                yAxisId="rev"
                type="monotone"
                dataKey="revenue"
                name="Omzet (Rp)"
                stroke="#813A56"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#revenueGradient)"
              />
              <Area
                yAxisId="ord"
                type="monotone"
                dataKey="orders"
                name="Pesanan"
                stroke="#0284C7"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#ordersGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── ROW 2: DISTRIBUSI STATUS & KATEGORI (BAR & PIE CHARTS) ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* BAR CHART: DISTRIBUSI STATUS PESANAN */}
        <div className="chart-card rounded-card border border-rule bg-surface p-5 shadow-low md:p-6">
          <div className="flex items-center justify-between border-b border-rule pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                  <BarChart3 className="size-4.5" />
                </span>
                <h3 className="text-h3 font-bold text-ink">Distribusi Status Pesanan</h3>
              </div>
              <p className="mt-1 text-caption text-muted">
                Jumlah pesanan dalam tahapan pembayaran, fulfillment, dan pengiriman
              </p>
            </div>
            <span className="rounded-pill bg-paper px-2.5 py-1 text-caption font-bold text-ink">
              {totalOrders} Total
            </span>
          </div>

          <div className="mt-6 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={statusDistribution}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-rule, #E2E8F0)" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "var(--color-muted, #64748B)" }}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "var(--color-muted, #64748B)" }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length > 0 && payload[0]?.payload) {
                      const data = payload[0].payload as StatusDistributionPoint;
                      return (
                        <div className="rounded-lg border border-rule bg-surface p-2.5 shadow-medium">
                          <p className="text-caption font-semibold text-muted">{data.label}</p>
                          <p className="text-small font-bold text-ink">{data.count} Pesanan</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE / DONUT CHART: KOMPOSISI KATALOG PER KATEGORI */}
        <div className="chart-card rounded-card border border-rule bg-surface p-5 shadow-low md:p-6">
          <div className="flex items-center justify-between border-b border-rule pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <PieIcon className="size-4.5" />
                </span>
                <h3 className="text-h3 font-bold text-ink">Koleksi Produk per Kategori</h3>
              </div>
              <p className="mt-1 text-caption text-muted">
                Proporsi katalog daster yang dipublikasikan di etalase
              </p>
            </div>
            <span className="flex items-center gap-1 rounded-pill bg-paper px-2.5 py-1 text-caption font-bold text-muted">
              <Layers className="size-3.5 text-accent" />
              <span>Etalase</span>
            </span>
          </div>

          <div className="mt-4 flex flex-col items-center justify-center sm:flex-row">
            <div className="h-60 w-full sm:w-3/5">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length > 0 && payload[0]) {
                        const item = payload[0];
                        return (
                          <div className="rounded-lg border border-rule bg-surface p-2.5 shadow-medium">
                            <p className="text-caption font-semibold text-muted">{item.name}</p>
                            <p className="text-small font-bold text-ink">{item.value} Produk</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Legend */}
            <div className="w-full space-y-2 sm:w-2/5 sm:pl-2">
              {pieData.map((item, index) => {
                const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
                return (
                  <div key={item.name} className="flex items-center justify-between text-caption">
                    <div className="flex items-center gap-2 truncate">
                      <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                      <span className="truncate text-ink font-medium">{item.name}</span>
                    </div>
                    <span className="font-bold text-muted tabular">{item.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
