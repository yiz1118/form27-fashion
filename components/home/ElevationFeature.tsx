"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { animate, useInView } from "motion/react";
import { MotionReveal } from "@/components/MotionReveal";
import { UiIcon } from "@/components/UiIcon";
import { useMotionPref } from "@/components/MotionProvider";
import { sizeCharts } from "@/data/size-charts";
import type { Size } from "@/data/products";

const pants = sizeCharts[0];
const SIZES = pants.rows.map(row => row.size);

/** A number that counts to its new value, like a dimension being re-measured. */
function Measure({ value, reduced }: { value: number; reduced: boolean }) {
  const node = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);
  useEffect(() => {
    if (!node.current) return;
    if (reduced) { node.current.textContent = String(value); shown.current = value; return; }
    const controls = animate(shown.current, value, { duration: 0.6, ease: [0.16, 1, 0.3, 1], onUpdate: latest => { shown.current = latest; if (node.current) node.current.textContent = String(Math.round(latest)); } });
    return () => controls.stop();
  }, [value, reduced]);
  return <span ref={node}>{value}</span>;
}

/** The Axis Trouser as an elevation: dimension strings drawn on the drawing, re-measured for the chosen size. */
export function ElevationFeature() {
  const [size, setSize] = useState<Size>("M");
  const { reduced } = useMotionPref();
  const sheet = useRef<HTMLDivElement>(null);
  const seen = useInView(sheet, { once: true, amount: 0.35 });
  const row = pants.rows.find(item => item.size === size)!;
  const [waist, hip, inseam] = row.measurements;
  return <section className="feature-story elevation" aria-labelledby="axis-title">
    <div ref={sheet} className={`elevation-field ${seen ? "is-drawn" : ""}`}>
      <span className="elevation-sheet-label">F27–01 · Front elevation · 1:10</span>
      <MotionReveal variant="crop" className="feature-image elevation-figure">
        <Image src="/images/products/axis-trouser-front.webp" alt="Axis Trouser front view with the angled knee seams" fill sizes="(max-width: 800px) 46vw, 22vw" />
        <svg className="elevation-lines" viewBox="0 0 380 1024" preserveAspectRatio="none" aria-hidden="true">
          <path pathLength={1} className="dim" d="M92 34H290M92 22V46M290 22V46" />
          <path pathLength={1} className="dim" d="M58 214H324M58 202V226M324 202V226" />
          <path pathLength={1} className="dim" d="M368 300V946M356 300H380M356 946H380" />
          <path pathLength={1} className="seam" d="M40 480L180 545M342 480L205 545" />
        </svg>
        <span className="callout callout-waist" aria-hidden="true">Waist <b><Measure value={waist} reduced={reduced} /></b> cm</span>
        <span className="callout callout-hip" aria-hidden="true">Hip <b><Measure value={hip} reduced={reduced} /></b> cm</span>
        <span className="callout callout-inseam" aria-hidden="true">Inseam <b><Measure value={inseam} reduced={reduced} /></b> cm</span>
        <span className="callout callout-seam" aria-hidden="true">Angled knee seam · off axis</span>
      </MotionReveal>
    </div>
    <div className="feature-copy">
      <h2 id="axis-title">The Axis<br /><em>Trouser.</em></h2>
      <p>A generous silhouette, interrupted by a single angled seam. Made to change shape when you move.</p>
      <fieldset className="elevation-sizes">
        <legend>Measure a size</legend>
        <div>{SIZES.map(item => <button key={item} type="button" aria-pressed={size === item} onClick={() => setSize(item)}>{item}</button>)}</div>
        <dl className="elevation-readout"><div><dt>Waist</dt><dd><Measure value={waist} reduced={reduced} /> cm</dd></div><div><dt>Hip</dt><dd><Measure value={hip} reduced={reduced} /> cm</dd></div><div><dt>Inseam</dt><dd><Measure value={inseam} reduced={reduced} /> cm</dd></div></dl>
        <p className="elevation-note" aria-live="polite">Size {size}. Garment measurements, laid flat. Illustrative concept sizing.</p>
      </fieldset>
      <Link className="outline-button" href="/products/axis-trouser">EXPLORE THE PIECE <UiIcon icon={ArrowRight} size={18} /></Link>
    </div>
  </section>;
}
