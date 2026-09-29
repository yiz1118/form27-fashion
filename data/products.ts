export type Category = "Pants" | "Jackets" | "Shirts" | "Essentials" | "Limited";
export type Size = "XS" | "S" | "M" | "L" | "XL";
export type GalleryView = "front" | "back" | "detail" | "fabric" | "worn";
export type Color = "Coal" | "Graphite" | "Chalk" | "Stone" | "Citron";

export interface Variant {
  id: string;
  size: Size;
  color: Color;
  available: boolean;
}

export interface GalleryImage {
  view: GalleryView;
  label: string;
  src: string;
  color: Color;
}

export interface Product {
  slug: string;
  name: string;
  category: Category;
  collection: string;
  priceCents: number;
  color: Color;
  code: string;
  tagline: string;
  fit: string;
  material: string;
  care: string;
  description: string;
  image: string;
  gallery: GalleryImage[];
  variants: Variant[];
  featuredOrder: number;
}

const sizes: Size[] = ["XS", "S", "M", "L", "XL"];
const views: GalleryView[] = ["front", "back", "detail", "fabric", "worn"];
const viewLabels: Record<GalleryView, string> = {
  front: "Front view", back: "Back view", detail: "Construction detail", fabric: "Fabric texture", worn: "On model",
};

function makeProduct(input: Omit<Product, "gallery" | "variants" | "image"> & { unavailable?: Size[] }): Product {
  const image = `/images/products/${input.slug}-worn.webp`;
  return {
    ...input,
    image,
    gallery: views.map(view => ({ view, label: viewLabels[view], src: `/images/products/${input.slug}-${view}.webp`, color: input.color })),
    variants: sizes.map(size => ({ id: `${input.slug}-${input.color.toLowerCase()}-${size.toLowerCase()}`, size, color: input.color, available: !input.unavailable?.includes(size) })),
  };
}

export const products: Product[] = [
  makeProduct({ slug: "axis-trouser", name: "Axis Trouser", category: "Pants", collection: "OFF / AXIS", priceCents: 14800, color: "Coal", code: "F27–01", tagline: "A new line of movement.", fit: "Generous wide leg, high rise, full length. The articulated knee opens the silhouette in motion.", material: "Heavyweight cotton twill; matte finish and a structured hand.", care: "Cold machine wash inside out. Line dry. Cool iron if needed.", description: "Our signature volume. A clean front breaks into a shaped knee seam and a long, uninterrupted hem.", featuredOrder: 1, unavailable: ["XS"] }),
  makeProduct({ slug: "fold-trouser", name: "Fold Trouser", category: "Pants", collection: "OFF / AXIS", priceCents: 16400, color: "Chalk", code: "F27–02", tagline: "Volume, reconsidered.", fit: "Extra-wide leg, relaxed rise and a sculpted wrap front. Designed to sit at the waist.", material: "Dense cotton canvas with a softly washed surface.", care: "Gentle cold wash. Reshape while damp and line dry.", description: "A moving plane of fabric creates dimension without adding bulk. Worn loose, it reads like architecture in motion.", featuredOrder: 2 }),
  makeProduct({ slug: "line-trouser", name: "Line Trouser", category: "Pants", collection: "OFF / AXIS", priceCents: 13800, color: "Graphite", code: "F27–03", tagline: "The quieter departure.", fit: "Relaxed through the thigh with a subtle taper and cropped ankle.", material: "Smooth technical weave with a fluid drape.", care: "Cold gentle wash. Hang dry. Do not tumble dry.", description: "Double pleats draw a sharp line through an easy silhouette. A daily counterpoint to the collection’s wider cuts.", featuredOrder: 3 }),
  makeProduct({ slug: "shell-jacket", name: "Shell Jacket", category: "Jackets", collection: "OFF / AXIS", priceCents: 22800, color: "Chalk", code: "F27–04", tagline: "A layer with its own shape.", fit: "Boxy and cropped with room through the shoulder. Layer over a shirt or light knit.", material: "Structured cotton canvas with a dry matte finish.", care: "Cold gentle wash. Close zip before washing. Line dry.", description: "A high funnel collar and a broad shoulder frame the body, while the cropped hem keeps the proportion in balance.", featuredOrder: 4 }),
  makeProduct({ slug: "frame-jacket", name: "Frame Jacket", category: "Jackets", collection: "OFF / AXIS", priceCents: 24600, color: "Coal", code: "F27–05", tagline: "A deliberate outline.", fit: "Straight boxy body, dropped shoulder, cropped length.", material: "Heavy matte twill with a compact feel.", care: "Cold gentle wash inside out. Line dry.", description: "Wide shoulders and geometric utility pockets give this compact layer its own visual language.", featuredOrder: 5, unavailable: ["XL"] }),
  makeProduct({ slug: "plane-shirt", name: "Plane Shirt", category: "Shirts", collection: "OFF / AXIS", priceCents: 11200, color: "Stone", code: "F27–06", tagline: "A shirt with space to breathe.", fit: "Oversized straight cut, dropped shoulder and wide cuff.", material: "Crisp cotton poplin with a smooth hand.", care: "Cold machine wash. Line dry. Press lightly.", description: "A precise angular pocket interrupts an otherwise quiet plane. Wear buttoned or open as a light layer.", featuredOrder: 6 }),
  makeProduct({ slug: "base-tee", name: "Base Tee", category: "Essentials", collection: "OFF / AXIS", priceCents: 5800, color: "Coal", code: "F27–07", tagline: "The shape beneath everything.", fit: "Boxy cut, dropped shoulder and a slightly longer sleeve.", material: "Heavyweight cotton jersey with a substantial rib neckline.", care: "Cold machine wash inside out. Line dry.", description: "An everyday foundation cut with the same attention to proportion as the outer layers.", featuredOrder: 7 }),
  makeProduct({ slug: "shift-vest", name: "Shift Vest", category: "Limited", collection: "OFF / AXIS", priceCents: 17600, color: "Citron", code: "F27–08", tagline: "The season’s interruption.", fit: "Boxy sleeveless layer, easy over a tee or shirt.", material: "Matte woven technical fabric, lightly structured.", care: "Cold gentle wash. Do not bleach. Line dry.", description: "A single flash of citron in a monochrome collection. Angular pockets and a two-way zip create a new outline.", featuredOrder: 8, unavailable: ["XS", "XL"] }),
];

export const productBySlug = (slug: string) => products.find(product => product.slug === slug);
export const variantById = (id: string) => products.flatMap(product => product.variants.map(variant => ({ product, variant }))).find(item => item.variant.id === id);
export const formatPrice = (cents: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);
