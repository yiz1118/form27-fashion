import { UiIcon } from "@/components/UiIcon";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, type Product } from "@/data/products";

/** Resting angles: every piece sits slightly off the grid and registers onto its axis when touched. */
export const OFF_AXIS = [-3, 2.2, -1.6, 3.2, -2.6, 1.4, -3.4, 2.6];
export const axisOf = (product: Product) => "ABCDEFGH"[product.featuredOrder - 1] ?? "A";

export function ProductCard({ product, index = 0, headingLevel = 3, sizes = "(max-width: 520px) 78vw, (max-width: 1050px) 44vw, 30vw" }: { product: Product; index?: number; headingLevel?: 2 | 3; sizes?: string }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const front = product.gallery.find(image => image.view === "front")!;
  return <article className="product-card" style={{ "--axis": `${OFF_AXIS[(product.featuredOrder - 1) % OFF_AXIS.length] * (index % 2 ? -1 : 1)}deg` } as React.CSSProperties}>
    <Link className="product-card-link" href={`/products/${product.slug}`} aria-label={`View ${product.name}, ${formatPrice(product.priceCents)}`}>
      <div className="product-card-image">
        <span className="plate-axis" aria-hidden="true">{axisOf(product)}</span>
        <Image className="plate-worn" src={product.image} alt={`${product.name} in ${product.color}, on model`} fill sizes={sizes} />
        <Image className="plate-front" src={front.src} alt="" aria-hidden="true" fill sizes={sizes} />
        <span className="product-card-tag">{product.code}</span>
        <span className="product-card-hover">TURN TO FRONT · EXPLORE <UiIcon icon={ArrowUpRight} size="0.9475em" className="ui-icon-inline" /></span>
      </div>
      <div className="product-card-meta"><div><p className="product-card-kind">{product.category} / {product.color}</p><Heading>{product.name}</Heading></div><span className="product-card-price">{formatPrice(product.priceCents)}</span></div>
      <span className="product-card-dimension" aria-hidden="true"><i />{product.code}<i /></span>
    </Link>
  </article>;
}
