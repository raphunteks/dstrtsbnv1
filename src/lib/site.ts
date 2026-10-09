import { publicEnv } from "@/lib/public-env";

export function getSiteUrl(): string {
  if (publicEnv.appUrl && !publicEnv.appUrl.includes("localhost")) {
    return publicEnv.appUrl.replace(/\/+$/, "");
  }
  return "https://dastertasbon.vercel.app";
}

export const SITE_METADATA = {
  name: "Daster Tasbon Olshop",
  shortName: "Daster Tasbon",
  description:
    "Daster dan busana wanita nyaman kualitas premium dengan informasi ukuran jelas, bahan adem, dan belanja transparan langsung dari Makassar.",
  keywords: [
    "daster tasbon",
    "daster tasbon olshop",
    "daster makassar",
    "daster rayon premium",
    "daster busui friendly",
    "daster jumbo",
    "baju daster adem",
    "daster kekinian",
    "olshop daster",
  ],
  locale: "id_ID",
  phone: "+6281242686868",
  email: "support@dastertasbon.com",
  addressLocality: "Makassar",
  addressRegion: "Sulawesi Selatan",
  postalCode: "90223",
  country: "ID",
} as const;
