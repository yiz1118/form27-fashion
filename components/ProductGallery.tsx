"use client";

import { useEffect, useRef, useState } from "react";
import type { GalleryView, Product } from "@/data/products";
import { isReduced } from "@/lib/motion-pref";
import { ProductArtwork } from "./ProductArtwork";

const SHEET: Record<GalleryView, string> = { front: "Front elevation", back: "Rear elevation", detail: "Construction detail", fabric: "Material sample", worn: "In use" };
const ZOOM = 2.4;

export function ProductGallery({ product }: { product: Product }) {
  const [index, setIndex] = useState(0);
  const rail = useRef<HTMLDivElement>(null);
  const lens = useRef<HTMLDivElement>(null);
  const activeIndex = useRef(0);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const selectView = (next: number) => {
    const clamped = Math.max(0, Math.min(product.gallery.length - 1, next));
    activeIndex.current = clamped;
    setIndex(clamped);
    rail.current?.scrollTo({ left: clamped * rail.current.clientWidth, behavior: isReduced() ? "instant" : "smooth" });
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

  /** A square loupe, like a reading glass over the drawing: follows a fine pointer and magnifies the current view. */
  const inspect = (event: React.PointerEvent<HTMLDivElement>) => {
    const loupe = lens.current;
    if (!loupe || event.pointerType !== "mouse" || drag.current?.moved) { if (loupe) loupe.hidden = true; return; }
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left, y = event.clientY - bounds.top;
    loupe.hidden = false;
    loupe.style.transform = `translate(${x - loupe.offsetWidth / 2}px, ${y - loupe.offsetHeight / 2}px)`;
    loupe.style.backgroundImage = `url("${product.gallery[activeIndex.current].src}")`;
    loupe.style.backgroundSize = `${bounds.width * ZOOM}px ${bounds.height * ZOOM}px`;
    loupe.style.backgroundPosition = `${-(x * ZOOM - loupe.offsetWidth / 2)}px ${-(y * ZOOM - loupe.offsetHeight / 2)}px`;
  };

  const current = product.gallery[index];
  return <div className="gallery-panel">
    <div className="gallery-sheet" aria-hidden="true"><span>{product.code}</span><span>Sheet {index + 1}/5 · {SHEET[current.view]}</span></div>
    <div className="gallery-main" onPointerMove={inspect} onPointerLeave={() => { if (lens.current) lens.current.hidden = true; }}>
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
        }}
        onPointerDown={event => {
          if (event.pointerType !== "mouse") return;
          drag.current = { x: event.clientX, left: event.currentTarget.scrollLeft, moved: false };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={event => {
          const state = drag.current;
          if (!state) return;
          const delta = event.clientX - state.x;
          if (Math.abs(delta) > 4) { state.moved = true; event.currentTarget.classList.add("is-turning"); }
          event.currentTarget.scrollLeft = state.left - delta * 1.4;
        }}
        onPointerUp={event => {
          const state = drag.current;
          drag.current = null;
          event.currentTarget.classList.remove("is-turning");
          if (state?.moved) selectView(Math.round(event.currentTarget.scrollLeft / event.currentTarget.clientWidth));
        }}>
        {product.gallery.map(image => <div className="gallery-slide" key={image.view}><ProductArtwork product={product} view={image.view} /></div>)}
      </div>
      <div ref={lens} className="gallery-loupe" hidden aria-hidden="true" />
    </div>
    <div className="gallery-thumbs" role="group" aria-label="Product views">
      {product.gallery.map((image, imageIndex) => <button type="button" key={image.view} onClick={() => selectView(imageIndex)}
        className={index === imageIndex ? "selected" : ""} aria-pressed={index === imageIndex} aria-label={`Show ${image.label.toLowerCase()}`}>
        <ProductArtwork product={product} view={image.view} />
        <span className="thumb-label" aria-hidden="true">{imageIndex + 1}</span>
      </button>)}
    </div>
    <div className="gallery-caption"><span>{product.code} / {product.color.toUpperCase()}</span><span aria-live="polite">{current?.label.toUpperCase()} — {index + 1}/5</span></div>
    <p className="gallery-hint"><span className="hint-fine">DRAG TO TURN · HOVER TO INSPECT · ARROW KEYS</span><span className="hint-touch">SWIPE TO TURN · TAP A VIEW BELOW</span></p>
  </div>;
}
