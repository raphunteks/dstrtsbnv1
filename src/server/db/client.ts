import "server-only";
import { PrismaClient } from "@prisma/client";

/**
 * Satu PrismaClient per proses.
 * Otomatis membersihkan tanda kutip tak disengaja dan memastikan connection_limit=1
 * serta connect_timeout=30 untuk performa maksimal di Vercel Serverless.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function getDatasourceUrl(): string | undefined {
  let raw = process.env.POSTGRES_PRISMA_URL;
  if (!raw) return undefined;

  // Bersihkan tanda kutip bila pengguna menyalin dengan tanda kutip di Vercel
  raw = raw.trim().replace(/^["']|["']$/g, "").trim();

  try {
    const url = new URL(raw);
    if (!url.searchParams.has("connection_limit")) {
      url.searchParams.set("connection_limit", "1");
    }
    if (!url.searchParams.has("connect_timeout")) {
      url.searchParams.set("connect_timeout", "30");
    }
    if (!url.searchParams.has("pool_timeout")) {
      url.searchParams.set("pool_timeout", "30");
    }
    if (!url.searchParams.has("schema")) {
      url.searchParams.set("schema", "app");
    }
    return url.toString();
  } catch {
    return raw;
  }
}

const dsUrl = getDatasourceUrl();

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: dsUrl ? { db: { url: dsUrl } } : undefined,
    log: ["warn", "error"],
  });

globalForPrisma.prisma = db;
