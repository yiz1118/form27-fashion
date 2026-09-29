import { UiIcon } from "@/components/UiIcon";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SizeChart } from "@/components/SizeChart";
export const metadata: Metadata = { title: "Size Guide" };
export default function SizeGuidePage() { return <main id="main-content" className="size-page"><div className="page-intro"><p className="eyebrow">FIT REFERENCE / FORM 27</p><h1>FIND YOUR<br /><em>FORM</em><span className="accent-dot">.</span></h1><p className="intro-lead">Our shapes are deliberately roomy. Compare the garment measurements below with a piece you already own. These are fictional concept measurements.</p></div><SizeChart /><section className="measure-guide section-pad"><p className="eyebrow">HOW TO MEASURE</p><div><article><span>01</span><h2>WAIST / CHEST</h2><p>Lay a garment flat. Measure across the waist or underarm and double the number.</p></article><article><span>02</span><h2>HIP / SHOULDER</h2><p>Measure across the widest part of the hip or from shoulder point to shoulder point.</p></article><article><span>03</span><h2>INSEAM / LENGTH</h2><p>For pants, measure crotch seam to hem. For tops, measure shoulder to hem.</p></article></div><Link className="text-arrow" href="/shop"><UiIcon icon={ArrowLeft} size={17} /> RETURN TO COLLECTION</Link></section></main>; }
