"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { m, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { MotionReveal } from "@/components/MotionReveal";
import { UiIcon } from "@/components/UiIcon";
import { PlanGrid } from "@/components/plan/PlanGrid";
import { useMotionPref } from "@/components/MotionProvider";
import { collection } from "@/data/editorial";

const REST = -4;

/** The pointer steers the collection's axis. The photograph and the citron line turn together; the readout reports the angle. */
export function HeroPlan() {
  const section = useRef<HTMLElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const { reduced } = useMotionPref();
  const target = useMotionValue(REST);
  const angle = useSpring(target, { stiffness: 120, damping: 18, mass: 0.6 });
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const scrolled = useTransform(scrollYProgress, [0, 1], [0, -6]);
  const total = useTransform(() => angle.get() + (reduced ? 0 : scrolled.get()));
  const lift = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 90]);

  useMotionValueEvent(total, "change", value => {
    if (readout.current) readout.current.textContent = `${value < 0 ? "−" : "+"}${Math.abs(value).toFixed(1).padStart(4, "0")}`;
  });
  useEffect(() => { if (reduced) target.set(REST); }, [reduced, target]);

  return <section ref={section} className="home-hero" aria-labelledby="hero-title"
    onPointerMove={event => {
      if (reduced || event.pointerType !== "mouse") return;
      const bounds = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      target.set(REST + x * 9 - y * 3);
    }}
    onPointerLeave={() => target.set(REST)}>
    <PlanGrid />
    <m.div className="hero-axis-line" style={{ rotate: total }} aria-hidden="true"><span>AXIS</span></m.div>
    <m.figure className="hero-plate" style={{ rotate: total, y: lift }}>
      <div className="hero-plate-image"><Image src="/images/campaign/hero-v2.webp" alt="Two models in sculptural wide-leg trousers and architectural jackets on concrete stairs" fill priority sizes="(max-width: 800px) 92vw, 62vw" /></div>
      <figcaption>Frame 00 · North stair · Collection 01</figcaption>
    </m.figure>
    <div className="hero-copy">
      <MotionReveal as="h1" id="hero-title" className="hero-title">OFF<span className="hero-slash">/</span><br />AXIS<span className="accent-dot">.</span></MotionReveal>
      <div className="hero-actions"><p>{collection.line}</p><Link className="hero-cta" href="/shop">SHOP THE COLLECTION <UiIcon icon={ArrowRight} size={20} /></Link></div>
    </div>
    <p className="axis-readout" aria-hidden="true"><span>AXIS</span><span ref={readout} className="axis-angle">−04.0</span><span>°</span></p>
    <dl className="title-block">
      <div><dt>Project</dt><dd>FORM / 27</dd></div>
      <div><dt>Sheet</dt><dd>A-001 · Plan</dd></div>
      <div><dt>Collection</dt><dd>01 · OFF / AXIS</dd></div>
      <div className="title-block-hint"><dt>Move</dt><dd>Change your angle</dd></div>
    </dl>
  </section>;
}
