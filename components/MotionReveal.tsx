"use client";

import { useCallback, useEffect, useRef, type HTMLAttributes } from "react";
import { isReduced, subscribe } from "@/lib/motion-pref";

type RevealVariant = "type" | "crop" | "image";
type MotionRevealProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "h1" | "h2" | "blockquote";
  variant?: RevealVariant;
};

const editorialEase = "cubic-bezier(.22, 1, .36, 1)";

/** Keeps the original element and layout. Content is visible before JS and on failure. */
export function MotionReveal({ as = "div", variant = "type", children, ...props }: MotionRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const setElement = useCallback((element: HTMLElement | null) => { ref.current = element; }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const preference = { get matches() { return isReduced(); } };
    if (preference.matches || typeof IntersectionObserver !== "function" || !element.animate) {
      element.dataset.motionState = preference.matches ? "reduced" : "complete";
      return;
    }
    let animations: Animation[] = [];
    let completed = false;

    const finish = () => {
      completed = true;
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
      animations = [];
      element.dataset.motionState = preference.matches ? "reduced" : "complete";
    };

    const reveal = () => {
      if (completed) return;
      observer.disconnect();
      if (preference.matches || element.contains(document.activeElement)) {
        finish();
        return;
      }
      // Less travel and a shorter crop on small screens; never animate dimensions.
      const mobile = window.matchMedia("(max-width: 800px)").matches;
      const duration = variant === "type" ? (mobile ? 440 : 560) : (mobile ? 560 : 720);
      const frames: Keyframe[] = variant === "type"
        ? [{ clipPath: "inset(0 0 100% 0)", transform: `translateY(${mobile ? 12 : 18}px)` }, { clipPath: "inset(0 0 0% 0)", transform: "none" }]
        : variant === "crop"
          ? [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)" }]
          : [{ clipPath: "inset(0 0 12% 0)" }, { clipPath: "inset(0 0 0% 0)" }];

      try {
        element.dataset.motionState = "revealing";
        const revealAnimation = element.animate(frames, { duration, easing: editorialEase });
        animations.push(revealAnimation);
        if (variant === "image") {
          const photograph = element.querySelector(":scope > img");
          if (photograph) animations.push(photograph.animate(
            [{ transform: `scale(${mobile ? 1.02 : 1.035})` }, { transform: "scale(1)" }],
            { duration, easing: editorialEase },
          ));
        }
        revealAnimation.onfinish = finish;
      } catch {
        finish();
      }
    };

    const onPreferenceChange = () => { if (preference.matches) finish(); };
    const onVisibilityChange = () => { if (document.hidden) finish(); };
    element.dataset.motionState = "idle";
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) reveal();
    }, { threshold: 0.08, rootMargin: "0px 0px 48px 0px" });
    observer.observe(element);
    const unsubscribe = subscribe(onPreferenceChange);
    document.addEventListener("visibilitychange", onVisibilityChange);
    element.addEventListener("focusin", finish);

    return () => {
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
      unsubscribe();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      element.removeEventListener("focusin", finish);
    };
  }, [variant]);

  const Tag = as;
  return <Tag {...props} ref={setElement} data-motion={variant}>{children}</Tag>;
}
