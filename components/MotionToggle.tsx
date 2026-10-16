"use client";

import { useMotionPref } from "./MotionProvider";

/** Visitors whose system reduces motion can still choose to see it; everyone can switch it off. */
export function MotionToggle() {
  const { reduced, systemPrefersReduced, choose } = useMotionPref();
  const label = reduced ? (systemPrefersReduced ? "Motion off (system). Turn on" : "Motion off. Turn on") : "Motion on. Turn off";
  return <button type="button" className="motion-toggle" aria-pressed={!reduced} aria-label={label}
    onClick={() => choose(reduced ? (systemPrefersReduced ? "full" : "system") : (systemPrefersReduced ? "system" : "reduced"))}>
    <span className="motion-toggle-dot" aria-hidden="true" />MOTION {reduced ? "OFF" : "ON"}
  </button>;
}
