import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Plus_Jakarta_Sans } from "next/font/google";
import { getSiteUrl, SITE_METADATA } from "@/lib/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Daster Tasbon Olshop — Pakaian & Daster Busana Nyaman",
    template: "%s · Daster Tasbon Olshop",
  },
  description: SITE_METADATA.description,
  applicationName: SITE_METADATA.name,
  keywords: [...SITE_METADATA.keywords],
  authors: [{ name: SITE_METADATA.shortName }],
  creator: SITE_METADATA.name,
  publisher: SITE_METADATA.name,
  formatDetection: { telephone: false },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: SITE_METADATA.locale,
    url: siteUrl,
    siteName: SITE_METADATA.name,
    title: "Daster Tasbon Olshop — Pakaian & Daster Busana Nyaman",
    description: SITE_METADATA.description,
    images: [
      {
        url: "/apple-icon.png",
        width: 512,
        height: 512,
        alt: SITE_METADATA.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daster Tasbon Olshop — Pakaian & Daster Busana Nyaman",
    description: SITE_METADATA.description,
    images: ["/apple-icon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#813A56",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="id" className={`${jakarta.variable} ${dmSerif.variable}`}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="min-h-dvh bg-paper text-ink antialiased">
        <a
          href="#konten"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-input focus:bg-surface focus:px-4 focus:py-3 focus:shadow-medium"
        >
          Langsung ke konten
        </a>
        {children}
      </body>
    </html>
  );
}
