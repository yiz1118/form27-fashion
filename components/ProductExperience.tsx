"use client";
import { UiIcon } from "@/components/UiIcon";
import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Plus, ArrowUpRight } from "lucide-react";
import { formatPrice, type Product, type Size } from "@/data/products";
import { useCart } from "./CartProvider";
import { ProductGallery } from "./ProductGallery";
import { isReduced } from "@/lib/motion-pref";
import { sizeCharts } from "@/data/size-charts";

const chartFor = (product: Product) => sizeCharts[product.category === "Pants" ? 0 : product.category === "Jackets" || product.category === "Limited" ? 1 : 2];

/** The chosen piece lifts off the sheet, turns off-axis and lands in the bag. Decorative: the bag state is already updated. */
function flyToBag() {
  if (isReduced()) return;
  const rail = document.querySelector<HTMLElement>(".gallery-rail");
  const target = document.querySelector<HTMLElement>("[data-bag-target] .bag-count") ?? document.querySelector<HTMLElement>("[data-bag-target]");
  if (!rail || !target) return;
  const slide = rail.querySelectorAll<HTMLElement>(".gallery-slide img")[Math.round(rail.scrollLeft / Math.max(1, rail.clientWidth))];
  if (!slide) return;
  const from = slide.getBoundingClientRect(), to = target.getBoundingClientRect();
  const ghost = slide.cloneNode() as HTMLImageElement;
  ghost.removeAttribute("srcset"); ghost.alt = ""; ghost.setAttribute("aria-hidden", "true");
  ghost.className = "bag-flight";
  Object.assign(ghost.style, { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px` });
  document.body.appendChild(ghost);
  const dx = to.left + to.width / 2 - (from.left + from.width / 2), dy = to.top + to.height / 2 - (from.top + from.height / 2);
  const scale = Math.max(0.04, to.width / from.width);
  ghost.animate([
    { transform: "translate(0,0) rotate(0deg) scale(1)", opacity: 1 },
    { transform: `translate(${dx * 0.35}px, ${dy * 0.35 - 60}px) rotate(-6deg) scale(0.62)`, opacity: 1, offset: 0.35 },
    { transform: `translate(${dx}px, ${dy}px) rotate(-14deg) scale(${scale})`, opacity: 0.2 },
  ], { duration: 720, easing: "cubic-bezier(.55,0,.25,1)" }).onfinish = () => ghost.remove();
}

export function ProductExperience({ product }: { product: Product }) {
  const [size, setSize] = useState<Size | null>(null);
  const [notice, setNotice] = useState("");
  const buyPanel = useRef<HTMLDivElement>(null);
  const { add } = useCart();
  const selected = product.variants.find(variant => variant.size === size);
  const addSelected = () => {
    if (!selected) {
      setNotice("Select a size to add this piece.");
      buyPanel.current?.querySelector<HTMLButtonElement>(".size-options button:not(:disabled)")?.focus({ preventScroll: true });
      buyPanel.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "center" });
      return;
    }
    if (!selected.available) { setNotice("This size is unavailable in the concept catalog."); return; }
    add(selected.id); flyToBag(); setNotice(`${product.name} / ${size} added to bag.`);
  };
  return <div className="product-detail-layout">
    <ProductGallery product={product} />
    <div className="purchase-panel" ref={buyPanel}><h1>{product.name}</h1><p className="sheet-note">{product.collection} / {product.category} / {product.code}</p><p className="product-tagline">{product.tagline}</p><div className="product-price">{formatPrice(product.priceCents)} <span>USD</span></div><p className="purchase-description">{product.description}</p><div className="product-option"><div><strong>COLOR</strong><span>{product.color.toUpperCase()}</span></div><button type="button" className="color-option" aria-pressed="true" aria-label={`${product.color}, selected color`}><span className={`color-swatch swatch-${product.color.toLowerCase()}`} />{product.color}</button></div><fieldset className="size-options"><legend><strong>SELECT SIZE</strong><Link href="/size-guide">SIZE GUIDE <UiIcon icon={ArrowUpRight} size="0.9475em" className="ui-icon-inline" /></Link></legend><div>{product.variants.map(variant => <button type="button" key={variant.id} disabled={!variant.available} className={size === variant.size ? "selected" : ""} onClick={() => { setSize(variant.size); setNotice(""); }} aria-pressed={size === variant.size}>{variant.size}{!variant.available && <span className="sr-only"> unavailable</span>}</button>)}</div></fieldset><p className="size-dimensions" aria-live="polite">{size ? <>Measured, size {size}: {chartFor(product).columns.map((column, i) => <span key={column}>{column} <b>{chartFor(product).rows.find(row => row.size === size)?.measurements[i]}</b></span>)} <small>cm, laid flat</small></> : <>Select a size to read its garment measurements.</>}</p><button className="black-button add-button" type="button" onClick={addSelected}>ADD TO BAG <UiIcon icon={Plus} size={20} /></button><p role="status" className="purchase-notice">{notice}</p><div className="product-accordions"><details open><summary>FIT & FORM <span><UiIcon icon={Plus} size={11} /></span></summary><p>{product.fit}</p></details><details><summary>MATERIAL <span><UiIcon icon={Plus} size={11} /></span></summary><p>{product.material}</p></details><details><summary>CARE <span><UiIcon icon={Plus} size={11} /></span></summary><p>{product.care}</p></details><details><summary>CONCEPT NOTE <span><UiIcon icon={Plus} size={11} /></span></summary><p>This is a fictional product in a design concept. Availability is simulated; no purchase can be completed.</p></details></div><Link className="text-arrow" href="/shop">EXPLORE THE COLLECTION <UiIcon icon={ArrowRight} size={17} /></Link></div>
    <div className="mobile-buy-bar"><span>{size ? `${product.name} / ${size}` : `${product.name} / SELECT SIZE`}<small>{formatPrice(product.priceCents)}</small></span><button type="button" onClick={addSelected}>{size ? "ADD TO BAG" : "CHOOSE SIZE"} <UiIcon icon={ArrowUpRight} size="0.9475em" className="ui-icon-inline" /></button></div>
  </div>;
}

