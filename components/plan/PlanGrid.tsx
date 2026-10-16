/** The structural grid of the drawing: axis lines with circled references. Purely decorative. */
export const AXES_X = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;
export const AXES_Y = ["1", "2", "3", "4"] as const;

export function PlanGrid({ cols = AXES_X.length, rows = AXES_Y.length, className = "" }: { cols?: number; rows?: number; className?: string }) {
  return <div className={`plan-grid ${className}`} aria-hidden="true" style={{ "--cols": cols, "--rows": rows } as React.CSSProperties}>
    <div className="plan-lines" />
    <div className="axis-x">{AXES_X.slice(0, cols).map((axis, index) => <span key={axis} style={{ "--i": index } as React.CSSProperties}>{axis}</span>)}</div>
    <div className="axis-y">{AXES_Y.slice(0, rows).map((axis, index) => <span key={axis} style={{ "--i": index } as React.CSSProperties}>{axis}</span>)}</div>
  </div>;
}
