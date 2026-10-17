import type { Metadata } from "next";
import { ShopClient } from "@/components/ShopClient";

export const metadata: Metadata = { title: "Shop the Collection", description: "Explore eight fictional sculptural utility pieces from OFF / AXIS Collection 01." };
/** Rendered per request with the URL filters, so shared filter links arrive complete and the grid is never rebuilt on load. */
export default async function ShopPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await searchParams;
  return <main id="main-content" className="shop-page"><div className="page-intro shop-intro"><p className="eyebrow">FORM / 27 / COLLECTION 01</p><h1>THE<br /><em>COLLECTION</em><span className="accent-dot">.</span></h1><div><span>OFF / AXIS — 2026</span><p>Pieces to move beyond the expected.</p></div></div><ShopClient /></main>;
}
