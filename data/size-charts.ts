import type { Size } from "./products";

export interface SizeChartData {
  name: string;
  note: string;
  columns: [string, string, string];
  rows: { size: Size; measurements: [number, number, number] }[];
}

const sizes: Size[] = ["XS", "S", "M", "L", "XL"];
const rows = (measurements: [number, number, number][]) => measurements.map((values, index) => ({ size: sizes[index], measurements: values }));

export const sizeCharts: SizeChartData[] = [
  { name: "Pants", note: "Garment measurements, laid flat. Compare with a pair you own.", columns: ["Waist", "Hip", "Inseam"],
    rows: rows([[72, 104, 77], [78, 110, 78], [84, 116, 79], [90, 122, 80], [96, 128, 81]]) },
  { name: "Jackets & vest", note: "Garment measurements. Designed for room through the body.", columns: ["Chest", "Shoulder", "Length"],
    rows: rows([[112, 52, 62], [118, 54, 64], [124, 56, 66], [130, 58, 68], [136, 60, 70]]) },
  { name: "Shirts & tee", note: "Garment measurements. Relaxed by intention.", columns: ["Chest", "Shoulder", "Length"],
    rows: rows([[108, 50, 69], [114, 52, 71], [120, 54, 73], [126, 56, 75], [132, 58, 77]]) },
];
