"use client";

import { useState } from "react";
import { sizeCharts } from "@/data/size-charts";

type Unit = "cm" | "in";

export function SizeChart() {
  const [unit, setUnit] = useState<Unit>("cm");
  const display = (value: number) => unit === "cm" ? value.toString() : (value / 2.54).toFixed(1);
  return <div className="size-chart-wrap">
    <div className="unit-toggle" role="group" aria-label="Measurement unit">
      <button type="button" aria-pressed={unit === "cm"} onClick={() => setUnit("cm")}>CM</button>
      <button type="button" aria-pressed={unit === "in"} onClick={() => setUnit("in")}>IN</button>
    </div>
    {sizeCharts.map((chart, index) => <section key={chart.name} className="chart-section">
      <div><h2>{chart.name}</h2><p className="sheet-note">0{index + 1} / Fit reference</p><p>{chart.note}</p></div>
      <div className="chart-scroll" role="region" aria-label={`${chart.name} measurements; scroll horizontally for more columns`} tabIndex={0}>
        <table>
          <caption className="sr-only">{chart.name} garment measurements in {unit}</caption>
          <thead><tr><th scope="col">SIZE</th>{chart.columns.map(column => <th key={column} scope="col">{column.toUpperCase()}</th>)}</tr></thead>
          <tbody>{chart.rows.map(row => <tr key={row.size}><th scope="row">{row.size}</th>{row.measurements.map((value, columnIndex) => <td key={columnIndex}>{display(value)}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </section>)}
  </div>;
}
