import { publicEnv } from "@/lib/public-env";

/**
 * Pemetaan gambar demo produk contoh menggunakan Unsplash CDN publik
 * berkualitas tinggi dengan tema daster, homewear, dan busana wanita.
 */
export const DEMO_PRODUCT_IMAGES: Record<string, string> = {
  "contoh/daster-jumbo-santai.jpg":
    "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=80",
  "contoh/daster-rayon-harian.jpg":
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
  "contoh/tunik-santai-rayon.jpg":
    "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80",
};

/**
 * Mengembalikan URL publik foto produk.
 * Mendukung URL absolut (Unsplash / CDN eksternal), pemetaan demo contoh,
 * dan Supabase Storage bucket produk.
 */
export function productImageUrl(objectKey: string): string {
  if (!objectKey) return "";

  // 1. Jika sudah merupakan URL lengkap (misal Unsplash atau CDN lain)
  if (objectKey.startsWith("http://") || objectKey.startsWith("https://")) {
    return objectKey;
  }

  const cleanKey = objectKey.replace(/^\/+/, "");

  // 2. Jika merupakan gambar contoh demo bawaan, gunakan Unsplash resolusi tinggi
  if (DEMO_PRODUCT_IMAGES[cleanKey]) {
    return DEMO_PRODUCT_IMAGES[cleanKey];
  }

  // 3. Fallback ke Supabase Storage bucket 'produk'
  const base = publicEnv.supabaseUrl?.replace(/\/+$/, "");
  return base
    ? `${base}/storage/v1/object/public/produk/${encodeURI(cleanKey)}`
    : `https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=80`;
}
