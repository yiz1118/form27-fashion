import type { LucideIcon } from "lucide-react";

/** Decorative SVGs share the existing fashion site's two-pixel Lucide stroke. */
export function UiIcon({ icon: Glyph, size = 24, className }: { icon: LucideIcon; size?: number | string; className?: string }) {
  return <Glyph size={size} strokeWidth={2} color="currentColor" aria-hidden="true" focusable="false" className={`ui-icon${className ? ` ${className}` : ""}`} />;
}
