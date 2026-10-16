/**
 * One source of truth for motion. The system setting is the default; a visitor can opt in or out
 * on the page, and that choice is remembered. CSS reads `html[data-motion]`, JS reads `isReduced()`.
 */
export type MotionChoice = "system" | "full" | "reduced";
export const MOTION_KEY = "form27-motion";
const EVENT = "form27:motion";

export function readChoice(): MotionChoice {
  try {
    const stored = window.localStorage.getItem(MOTION_KEY);
    return stored === "full" || stored === "reduced" ? stored : "system";
  } catch { return "system"; }
}

export function systemReduced() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isReduced(choice: MotionChoice = readChoice()) {
  return choice === "reduced" || (choice === "system" && systemReduced());
}

/** Mirror the effective state on <html> so CSS can gate every animation from one attribute. */
export function applyChoice(choice: MotionChoice) {
  const root = document.documentElement;
  root.dataset.motion = isReduced(choice) ? "reduced" : "full";
  root.dataset.motionChoice = choice;
}

export function setChoice(choice: MotionChoice) {
  try {
    if (choice === "system") window.localStorage.removeItem(MOTION_KEY);
    else window.localStorage.setItem(MOTION_KEY, choice);
  } catch { /* The choice still applies for this page view. */ }
  applyChoice(choice);
  window.dispatchEvent(new Event(EVENT));
}

/** Notify on an on-page choice or a system preference change. */
export function subscribe(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const onSystem = () => { applyChoice(readChoice()); callback(); };
  media.addEventListener("change", onSystem);
  window.addEventListener(EVENT, callback);
  return () => { media.removeEventListener("change", onSystem); window.removeEventListener(EVENT, callback); };
}

/** Runs before first paint (inlined in <head>) so no animation flashes against the visitor's choice. */
export const motionBootScript = `(function(){try{var c=localStorage.getItem("${MOTION_KEY}");}catch(e){c=null}var r=c==="reduced"||(c!=="full"&&matchMedia("(prefers-reduced-motion: reduce)").matches);var d=document.documentElement;d.dataset.motion=r?"reduced":"full";d.dataset.motionChoice=c==="full"||c==="reduced"?c:"system";})();`;
