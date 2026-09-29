import { products, type Product, type Category, type Color, type Size } from "@/data/products";

export type Sort = "featured" | "price-asc" | "price-desc";
export interface ShopFilters { categories: Category[]; sizes: Size[]; colors: Color[]; maxPrice: number | null; sort: Sort }
const categories: Category[] = ["Pants", "Jackets", "Shirts", "Essentials", "Limited"];
const sizes: Size[] = ["XS", "S", "M", "L", "XL"];
const colors: Color[] = ["Coal", "Graphite", "Chalk", "Stone", "Citron"];
const pick = <T extends string>(values: string[], allowed: readonly T[]) => [...new Set(values.filter((value): value is T => allowed.includes(value as T)))];

export function parseFilters(params: URLSearchParams): ShopFilters {
  const price = Number(params.get("max"));
  return {
    categories: pick(params.getAll("category"), categories),
    sizes: pick(params.getAll("size"), sizes),
    colors: pick(params.getAll("color"), colors),
    maxPrice: params.has("max") && Number.isFinite(price) && price > 0 ? price : null,
    sort: ["price-asc", "price-desc"].includes(params.get("sort") ?? "") ? params.get("sort") as Sort : "featured",
  };
}

export function filterProducts(filters: ShopFilters, catalog = products): Product[] {
  const selected = catalog.filter(product =>
    (!filters.categories.length || filters.categories.includes(product.category)) &&
    (!filters.sizes.length || product.variants.some(variant => filters.sizes.includes(variant.size) && variant.available)) &&
    (!filters.colors.length || filters.colors.includes(product.color)) &&
    (filters.maxPrice === null || product.priceCents <= filters.maxPrice * 100)
  );
  return [...selected].sort((a, b) => filters.sort === "price-asc" ? a.priceCents - b.priceCents : filters.sort === "price-desc" ? b.priceCents - a.priceCents : a.featuredOrder - b.featuredOrder);
}

export function filtersToParams(filters: ShopFilters): URLSearchParams {
  const params = new URLSearchParams();
  filters.categories.forEach(value => params.append("category", value));
  filters.sizes.forEach(value => params.append("size", value));
  filters.colors.forEach(value => params.append("color", value));
  if (filters.maxPrice !== null) params.set("max", String(filters.maxPrice));
  if (filters.sort !== "featured") params.set("sort", filters.sort);
  return params;
}
