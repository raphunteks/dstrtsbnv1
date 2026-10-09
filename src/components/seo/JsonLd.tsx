import { getSiteUrl, SITE_METADATA } from "@/lib/site";

interface OrganizationJsonLdProps {
  supportEmail?: string | null;
  supportWhatsapp?: string | null;
}

export function OrganizationJsonLd({
  supportEmail,
  supportWhatsapp,
}: OrganizationJsonLdProps) {
  const baseUrl = getSiteUrl();

  const schema = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "@id": `${baseUrl}#organization`,
    name: SITE_METADATA.name,
    alternateName: SITE_METADATA.shortName,
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}/apple-icon.png`,
      caption: SITE_METADATA.name,
    },
    image: `${baseUrl}/apple-icon.png`,
    description: SITE_METADATA.description,
    telephone: supportWhatsapp || SITE_METADATA.phone,
    email: supportEmail || SITE_METADATA.email,
    priceRange: "$$",
    currenciesAccepted: "IDR",
    paymentAccepted: "QRIS, Bank Transfer, E-Wallet",
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE_METADATA.addressLocality,
      addressRegion: SITE_METADATA.addressRegion,
      postalCode: SITE_METADATA.postalCode,
      addressCountry: SITE_METADATA.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -5.166667,
      longitude: 119.416667,
    },
    sameAs: [
      "https://instagram.com/dastertasbon",
      "https://facebook.com/dastertasbon",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ProductJsonLdProps {
  product: {
    name: string;
    description: string;
    slug: string;
    mediaUrl?: string | null;
    sku?: string | null;
    minPriceIdr: number;
    compareAtPriceIdr?: number | null;
    inStock: boolean;
    categoryName?: string;
  };
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const baseUrl = getSiteUrl();
  const productUrl = `${baseUrl}/produk/${product.slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: product.name,
    description: product.description,
    image: product.mediaUrl ? [product.mediaUrl] : undefined,
    sku: product.sku || product.slug,
    category: product.categoryName || "Daster & Pakaian Wanita",
    brand: {
      "@type": "Brand",
      name: SITE_METADATA.shortName,
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "IDR",
      price: product.minPriceIdr,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      seller: {
        "@type": "Organization",
        "@id": `${baseUrl}#organization`,
        name: SITE_METADATA.name,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
