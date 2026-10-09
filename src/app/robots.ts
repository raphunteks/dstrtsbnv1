import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/katalog",
          "/katalog/*",
          "/kategori",
          "/kategori/*",
          "/produk",
          "/produk/*",
          "/cari",
          "/cari/*",
          "/kebijakan/*",
          "/bantuan",
          "/bantuan/*",
        ],
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/checkout",
          "/checkout/*",
          "/keranjang",
          "/keranjang/*",
          "/pesanan",
          "/pesanan/*",
          "/akun",
          "/akun/*",
          "/masuk",
          "/daftar",
          "/lupa-sandi",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
