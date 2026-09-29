import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopClient } from "@/components/ShopClient";

export const metadata: Metadata = { title: "Shop the Collection", description: "Explore eight fictional sculptural utility pieces from OFF / AXIS Collection 01." };
export default function ShopPage() {
  return <main id="main-content" className="shop-page"><div className="page-intro shop-intro"><p className="eyebrow">FORM / 27 / COLLECTION 01</p><h1>THE<br /><em>COLLECTION</em><span className="accent-dot">.</span></h1><div><span>OFF / AXIS — 2026</span><p>Pieces to move beyond the expected.</p></div></div><Suspense fallback={<p className="section-pad">Loading collection…</p>}><ShopClient /></Suspense></main>;
}
