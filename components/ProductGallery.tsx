"use client";

import { useEffect, useRef, useState } from "react";
import type { Product } from "@/data/products";
import { ProductArtwork } from "./ProductArtwork";

export function ProductGallery({ product }: { product: Product }) {
  const [index, setIndex] = useState(0);
  const rail = useRef<HTMLDivElement>(null);
  const activeIndex = useRef(0);
  const selectView = (next: number) => {
    const clamped = Math.max(0, Math.min(product.gallery.length - 1, next));
    activeIndex.current = clamped;
    setIndex(clamped);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.current?.scrollTo({ left: clamped * rail.current.clientWidth, behavior: reduced ? "instant" : "smooth" });
  };

  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      element.scrollTo({ left: activeIndex.current * element.clientWidth, behavior: "instant" });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div className="gallery-panel">
    <div className="gallery-main">
      <div ref={rail} className="gallery-rail" role="region" aria-label="Product gallery, use arrow keys or swipe to change views" tabIndex={0}
        onScroll={event => {
          const element = event.currentTarget;
          const next = Math.round(element.scrollLeft / element.clientWidth);
          activeIndex.current = next;
          setIndex(next);
        }}
        onKeyDown={event => {
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            selectView(index + (event.key === "ArrowRight" ? 1 : -1));
          }
        }}>
        {product.gallery.map(image => <div className="gallery-slide" key={image.view}><ProductArtwork product={product} view={image.view} /></div>)}
      </div>
    </div>
    <div className="gallery-thumbs" role="group" aria-label="Product views">
      {product.gallery.map((image, imageIndex) => <button type="button" key={image.view} onClick={() => selectView(imageIndex)}
        className={index === imageIndex ? "selected" : ""} aria-pressed={index === imageIndex} aria-label={`Show ${image.label.toLowerCase()}`}>
        <ProductArtwork product={product} view={image.view} />
      </button>)}
    </div>
    <div className="gallery-caption"><span>{product.code} / {product.color.toUpperCase()}</span><span aria-live="polite">{product.gallery[index]?.label.toUpperCase()} — {index + 1}/5</span></div>
    <p className="gallery-hint">SWIPE OR USE ARROW KEYS TO EXPLORE THE DETAILS</p>
  </div>;
}
