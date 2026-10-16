"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { UiIcon } from "@/components/UiIcon";
import { useMotionPref } from "@/components/MotionProvider";

const FRAMES = [
  { src: "/images/campaign/campaign-two-v2.webp", alt: "Two models in monochrome utility clothing on a concrete rooftop", note: "Frame 02 · Roof deck", ratio: "portrait" },
  { src: "/images/campaign/lookbook-detail-v2.webp", alt: "Close detail of a structured chalk jacket and charcoal trouser", note: "Frame 03 · The join", ratio: "portrait" },
  { src: "/images/campaign/hero-v2.webp", alt: "Two models in sculptural trousers and jackets on concrete stairs", note: "Frame 00 · North stair", ratio: "landscape" },
  { src: "/images/campaign/campaign-one-v2.webp", alt: "Model in a white jacket crossing a concrete colonnade", note: "Frame 01 · Colonnade", ratio: "landscape" },
] as const;
const TILT = [-4, 3, -1.5, 5];

/** Site photographs pinned to the plan. Throw the top one aside (or press Next) to bring the next frame forward. */
export function FrameStack() {
  const [order, setOrder] = useState(() => FRAMES.map((_, index) => index));
  const { reduced } = useMotionPref();
  const next = () => setOrder(current => [...current.slice(1), current[0]]);
  const top = FRAMES[order[0]];
  return <section className="lookbook-teaser frame-stack-section" aria-labelledby="stack-title">
    <div className="stack-copy">
      <h2 id="stack-title">Volume<br />in motion<span className="accent-dot">.</span></h2>
      <p>Four site photographs from the OFF / AXIS shoot. Drag the top frame away, or step through them.</p>
      <div className="stack-controls">
        <button type="button" className="outline-button" onClick={next}><span>NEXT FRAME <UiIcon icon={RotateCcw} size={16} /></span></button>
        <Link className="text-arrow" href="/lookbook">OPEN THE LOOKBOOK <UiIcon icon={ArrowRight} size={18} /></Link>
      </div>
      <p className="stack-status" aria-live="polite">{top.note} · {order[0] + 1} of {FRAMES.length}</p>
    </div>
    <div className="frame-stack">
      <AnimatePresence initial={false}>
        {order.slice(0, 3).reverse().map((frameIndex, depthFromBack) => {
          const frame = FRAMES[frameIndex];
          const depth = 2 - depthFromBack;
          const isTop = depth === 0;
          return <m.figure key={frameIndex} className={`stack-frame ${frame.ratio}`}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 - depth * 0.04, y: depth * 18, rotate: TILT[frameIndex] + depth * 1.5 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: 380, rotate: 18, transition: { duration: 0.35 } }}
            drag={isTop && !reduced ? "x" : false} dragSnapToOrigin dragElastic={0.6}
            onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 110 || Math.abs(info.velocity.x) > 600) next(); }}
            whileDrag={{ scale: 1.03, rotate: 0 }}
            style={{ zIndex: 3 - depth }} aria-hidden={!isTop}>
            <div className="stack-frame-image"><Image src={frame.src} alt={isTop ? frame.alt : ""} fill sizes="(max-width: 800px) 80vw, 34vw" draggable={false} /></div>
            <figcaption>{frame.note}</figcaption>
          </m.figure>;
        })}
      </AnimatePresence>
    </div>
  </section>;
}
