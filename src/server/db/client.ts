import "server-only";
import { PrismaClient } from "@prisma/client";

/**
 * Satu PrismaClient per proses.
 * Dilengkapi connect_timeout=30 & pool_timeout=30 agar koneksi trans-kontinen
 * dari Indonesia ke Supabase AWS US-East-1 tidak terputus timeout 5 detik bawaan.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function getDatasourceUrl(): string | undefined {
  const raw = process.env.POSTGRES_PRISMA_URL;
  if (!raw) return undefined;
  if (!raw.includes("connect_timeout")) {
    return `${raw}${raw.includes("?") ? "&" : "?"}connect_timeout=30&pool_timeout=30`;
  }
  return raw;
}

const dsUrl = getDatasourceUrl();

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: dsUrl ? { db: { url: dsUrl } } : undefined,
    log: ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
