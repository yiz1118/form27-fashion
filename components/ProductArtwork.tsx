import type { GalleryView, Product } from "@/data/products";
import Image from "next/image";

export function ProductArtwork({ product, view = "front", className = "" }: { product: Product; view?: GalleryView; className?: string }) {
  const label = `${product.name} in ${product.color}, ${product.gallery.find(image => image.view === view)?.label.toLowerCase()}`;
  const photo = product.gallery.find(image => image.view === view);
  if (!photo) return null;
  return <div className={`product-artwork sheet-${view} ${className}`}><Image src={photo.src} alt={label} fill sizes="(max-width: 520px) 80vw, (max-width: 1050px) 50vw, 35vw" /></div>;
}
