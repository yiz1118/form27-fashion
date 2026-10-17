"use client";

import { useEffect, useRef } from "react";
import { m, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "motion/react";
import { useMotionPref } from "./MotionProvider";

const REST = 108, NARROW = 84, WIDE = 125, SPEED = 2400;

/**
 * Display type that stretches like cloth under movement: scroll speed widens the face's width axis,
 * and it settles back when the page stops. Lines never wrap, and the widest line is measured so the
 * stretch stops short of the container edge instead of pushing the page sideways on small screens.
 */
export function StretchHeading({ lines, id, className = "", as = "h2" }: { lines: React.ReactNode[]; id?: string; className?: string; as?: "h1" | "h2" }) {
  const { reduced } = useMotionPref();
  const node = useRef<HTMLHeadingElement>(null);
  const ceiling = useMotionValue(WIDE);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { stiffness: 140, damping: 30 });
  const stretch = useTransform(() => {
    const speed = velocity.get();
    const amount = Math.min(1, Math.abs(speed) / SPEED);
    return speed < 0 ? REST - (REST - NARROW) * amount : REST + (ceiling.get() - REST) * amount;
  });
  const fontStretch = useTransform(stretch, value => `${value}%`);

  useEffect(() => {
    const element = node.current;
    if (!element) return;
    const measure = () => {
      const previous = element.style.fontStretch;
      element.style.fontStretch = `${REST}%`;
      const range = document.createRange();
      const widest = Math.max(1, ...[...element.querySelectorAll<HTMLElement>(".stretch-line")].map(line => {
        range.selectNodeContents(line);
        return range.getBoundingClientRect().width;
      }));
      element.style.fontStretch = previous;
      // Advance widths grow roughly in proportion to the width axis; keep a small margin.
      ceiling.set(Math.max(REST, Math.min(WIDE, REST * (element.clientWidth / widest) * 0.97)));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, [ceiling]);

  const Tag = as === "h1" ? m.h1 : m.h2;
  return <Tag ref={node} id={id} className={`stretch-heading ${className}`} style={reduced ? undefined : { fontStretch }}>
    {lines.map((line, index) => <span className="stretch-line" key={index}>{line}</span>)}
  </Tag>;
}
