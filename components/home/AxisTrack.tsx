"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { m, useScroll, useSpring, useTransform } from "motion/react";
import { ProductCard } from "@/components/ProductCard";
import { StretchHeading } from "@/components/StretchHeading";
import { UiIcon } from "@/components/UiIcon";
import { useMotionPref } from "@/components/MotionProvider";
import type { Product } from "@/data/products";

/**
 * The eight pieces stand on axes A to H. On wide screens, scrolling travels along the axis:
 * the section pins while the rail slides by native scroll (no hijacking). Phones get a swipe rail.
 */
export function AxisTrack({ products }: { products: Product[] }) {
  const section = useRef<HTMLElement>(null);
  const rail = useRef<HTMLOListElement>(null);
  const { reduced } = useMotionPref();
  const [travel, setTravel] = useState(0);
  const pinned = travel > 0 && !reduced;
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useSpring(useTransform(scrollYProgress, [0.04, 0.96], [0, -travel], { clamp: true }), { stiffness: 220, damping: 40 });
  const progress = useTransform(scrollYProgress, [0.04, 0.96], [0, 1], { clamp: true });

  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    const wide = window.matchMedia("(min-width: 900px)");
    const measure = () => setTravel(wide.matches ? Math.max(0, element.scrollWidth - element.parentElement!.clientWidth) : 0);
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    wide.addEventListener("change", measure);
    measure();
    return () => { observer.disconnect(); wide.removeEventListener("change", measure); };
  }, []);

  /** Keyboard users tab along the rail: bring the focused stop into view by scrolling the page to its point on the axis. */
  const follow = (index: number) => {
    if (!pinned || !section.current) return;
    const box = section.current.getBoundingClientRect();
    const span = section.current.offsetHeight - window.innerHeight;
    const top = window.scrollY + box.top + span * (0.04 + 0.92 * (index / (products.length - 1)));
    window.scrollTo({ top, behavior: "instant" });
  };

  return <section ref={section} className={`axis-track ${pinned ? "is-pinned" : ""}`} aria-labelledby="track-title" style={pinned ? { height: `calc(100vh + ${travel}px)` } : undefined}>
    <div className="track-viewport">
      <div className="track-head">
        <StretchHeading id="track-title" lines={["Eight pieces", <>on axis<span className="accent-dot">.</span></>]} />
        <div><p>One study in volume, utility and the space between. Every piece is drawn on its own axis, A to H.</p><Link className="text-arrow" href="/shop">VIEW ALL 08 PIECES <UiIcon icon={ArrowRight} size={18} /></Link></div>
      </div>
      <m.ol ref={rail} className="track-rail" style={pinned ? { x } : undefined}>
        {products.map((product, index) => <li key={product.slug} className="track-stop" onFocus={() => follow(index)}>
          <ProductCard product={product} index={index} sizes="(max-width: 900px) 70vw, 24vw" />
        </li>)}
      </m.ol>
      <div className="track-scale" aria-hidden="true"><m.span style={{ scaleX: pinned ? progress : 1 }} /><b>A</b><b>H</b></div>
    </div>
  </section>;
}
