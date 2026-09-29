"use client";
import { UiIcon } from "@/components/UiIcon";
import { useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, ArrowUpRight, ChevronDown } from "lucide-react";
import { products, type Category, type Color, type Size } from "@/data/products";
import { filterProducts, filtersToParams, parseFilters, type ShopFilters, type Sort } from "@/lib/shop";
import { ProductCard } from "./ProductCard";

const categories: Category[] = ["Pants", "Jackets", "Shirts", "Essentials", "Limited"];
const sizes: Size[] = ["XS", "S", "M", "L", "XL"];
const colors: Color[] = ["Coal", "Graphite", "Chalk", "Stone", "Citron"];

export function ShopClient() {
  const search = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const filters = parseFilters(new URLSearchParams(search.toString()));
  const shown = filterProducts(filters, products);
  const update = (next: ShopFilters) => {
    const query = filtersToParams(next).toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };
  const toggle = <T extends Category | Size | Color>(field: "categories" | "sizes" | "colors", value: T) => {
    const current = filters[field] as T[];
    update({ ...filters, [field]: current.includes(value) ? current.filter(item => item !== value) : [...current, value] });
  };
  const close = () => { dialog.current?.close(); trigger.current?.focus(); };
  const selectedCount = filters.categories.length + filters.sizes.length + filters.colors.length + Number(filters.maxPrice !== null);
  const controls = (prefix: string) => <div className="filter-groups">
    <fieldset><legend>01 / CATEGORY</legend><div className="filter-stack">{categories.map(value => <label key={value} className="filter-check"><input type="checkbox" checked={filters.categories.includes(value)} onChange={() => toggle("categories", value)} /><span>{value}</span><span className="filter-count">{products.filter(p => p.category === value).length.toString().padStart(2, "0")}</span></label>)}</div></fieldset>
    <fieldset><legend>02 / SIZE</legend><div className="filter-size-grid">{sizes.map(value => <label key={value}><input type="checkbox" checked={filters.sizes.includes(value)} onChange={() => toggle("sizes", value)} /><span>{value}</span></label>)}</div></fieldset>
    <fieldset><legend>03 / COLOR</legend><div className="filter-stack">{colors.map(value => <label key={value} className="filter-check"><input type="checkbox" checked={filters.colors.includes(value)} onChange={() => toggle("colors", value)} /><span className={`color-swatch swatch-${value.toLowerCase()}`} /><span>{value}</span></label>)}</div></fieldset>
    <fieldset><legend>04 / PRICE</legend><div className="filter-price"><label htmlFor={`${prefix}-price-max`}>Maximum price</label><span className="select-control"><select id={`${prefix}-price-max`} value={filters.maxPrice ?? ""} onChange={event => update({ ...filters, maxPrice: event.target.value ? Number(event.target.value) : null })}><option value="">Any price</option><option value="100">Under $100</option><option value="150">Under $150</option><option value="200">Under $200</option><option value="250">Under $250</option></select><UiIcon icon={ChevronDown} size={14} /></span></div></fieldset>
    {selectedCount > 0 && <button className="clear-filters" type="button" onClick={() => update({ ...filters, categories: [], sizes: [], colors: [], maxPrice: null })}><span>CLEAR ALL FILTERS <UiIcon icon={ArrowUpRight} size="0.9475em" className="ui-icon-inline" /></span></button>}
  </div>;
  return <>
    <div className="shop-toolbar"><div className="shop-result"><span className="eyebrow">THE COLLECTION</span><strong>{shown.length.toString().padStart(2, "0")} PIECES</strong></div><div className="shop-tools"><button ref={trigger} type="button" className="mobile-filter-trigger" onClick={() => dialog.current?.showModal()}><UiIcon icon={SlidersHorizontal} size={17} /> FILTERS {selectedCount ? `(${selectedCount})` : ""}</button><label htmlFor="shop-sort">SORT BY</label><span className="select-control"><select id="shop-sort" aria-label="Sort products" value={filters.sort} onChange={event => update({ ...filters, sort: event.target.value as Sort })}><option value="featured">Featured</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select><UiIcon icon={ChevronDown} size={14} /></span></div></div>
    <div className="shop-layout"><aside className="desktop-filters" aria-label="Product filters">{controls("desktop")}</aside><div><div className="active-filters">{[...filters.categories, ...filters.sizes, ...filters.colors, ...(filters.maxPrice ? [`Under $${filters.maxPrice}`] : [])].map(value => <span key={value}>{value}</span>)}</div>{shown.length ? <div className="product-grid">{shown.map((product, index) => <ProductCard key={product.slug} product={product} index={index} headingLevel={2} />)}</div> : <div className="shop-empty"><span>00 / NO MATCHES</span><h2>NOTHING IN<br />THIS SHAPE.</h2><p>Try another size, shade or price range.</p><button type="button" className="outline-button" onClick={() => update({ ...filters, categories: [], sizes: [], colors: [], maxPrice: null })}><span>CLEAR FILTERS <UiIcon icon={ArrowUpRight} size="0.9475em" className="ui-icon-inline" /></span></button></div>}</div></div>
    <dialog className="filter-dialog" ref={dialog} onClick={event => { if (event.target === dialog.current) close(); }} onClose={() => trigger.current?.focus()}><div className="filter-dialog-inner"><div className="filter-dialog-head"><strong>FILTERS / {selectedCount.toString().padStart(2, "0")}</strong><button type="button" aria-label="Close filters" onClick={close}><UiIcon icon={X} /></button></div>{controls("mobile")}<button type="button" className="black-button filter-done" onClick={close}><span>VIEW {shown.length} PIECES <UiIcon icon={ArrowUpRight} size="0.9475em" className="ui-icon-inline" /></span></button></div></dialog>
  </>;
}
