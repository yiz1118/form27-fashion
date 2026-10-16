"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { m, useScroll, useTransform } from "motion/react";
import { MotionReveal } from "@/components/MotionReveal";
import { StretchHeading } from "@/components/StretchHeading";
import { UiIcon } from "@/components/UiIcon";
import { useMotionPref } from "@/components/MotionProvider";

/** A section cut through the building: solid poché, the colonnade seen through the cut, the photograph moving slower than the page. */
export function SectionCut() {
  const section = useRef<HTMLElement>(null);
  const { reduced } = useMotionPref();
  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-70, 70]);
  const rotate = useTransform(scrollYProgress, [0, 1], reduced ? [-2, -2] : [-5, 1.5]);
  return <section ref={section} className="campaign-strip section-cut" aria-labelledby="cut-title">
    <span className="cut-mark" aria-hidden="true">Section B–B · Colonnade</span>
    <MotionReveal variant="image" className="cut-window">
      <m.div className="cut-photo" style={{ y, rotate }}><Image src="/images/campaign/campaign-one-v2.webp" alt="Model wearing a white shell jacket and wide charcoal trousers in a concrete colonnade" fill sizes="(max-width: 800px) 100vw, 58vw" /></m.div>
    </MotionReveal>
    <div className="cut-copy">
      <StretchHeading id="cut-title" lines={["Body.", "Space.", <em key="shape">Shape.</em>]} />
      <p>A study of bodies in motion and the structures that frame them.</p>
      <Link className="text-arrow" href="/campaign">ENTER OFF / AXIS <UiIcon icon={ArrowRight} size={18} /></Link>
    </div>
  </section>;
}
