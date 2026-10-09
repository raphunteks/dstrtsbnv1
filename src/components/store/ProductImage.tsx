import Image from "next/image";
import { cn } from "@/lib/cn";
import { productImageUrl } from "@/lib/media";

type ProductImageProps = {
  image: { objectKey: string; altText: string } | null;
  sizes: string;
  priority?: boolean;
  className?: string;
};

export function ProductImage({ image, sizes, priority = false, className }: ProductImageProps) {
  const src = image?.objectKey ? productImageUrl(image.objectKey) : "";

  return (
    <div className={cn("relative aspect-[4/5] overflow-hidden rounded-card bg-paper-3", className)}>
      {src ? (
        <Image
          src={src}
          alt={image?.altText || "Foto produk Daster Tasbon"}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-small text-muted">Foto belum tersedia</span>
      )}
    </div>
  );
}
