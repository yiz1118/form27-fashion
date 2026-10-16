"use client";

import { m, useScroll, useSpring, useTransform, useVelocity } from "motion/react";
import { useMotionPref } from "./MotionProvider";

/**
 * Display type that stretches like cloth under movement: scroll speed widens the face's width axis,
 * and it settles back when the page stops. Lines never wrap, so the box keeps its size.
 */
export function StretchHeading({ lines, id, className = "", as = "h2" }: { lines: React.ReactNode[]; id?: string; className?: string; as?: "h1" | "h2" }) {
  const { reduced } = useMotionPref();
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { stiffness: 140, damping: 30 });
  const stretch = useTransform(velocity, [-2400, 0, 2400], [84, 108, 125], { clamp: true });
  const fontStretch = useTransform(stretch, value => `${value}%`);
  const Tag = as === "h1" ? m.h1 : m.h2;
  return <Tag id={id} className={`stretch-heading ${className}`} style={reduced ? undefined : { fontStretch }}>
    {lines.map((line, index) => <span className="stretch-line" key={index}>{line}</span>)}
  </Tag>;
}
