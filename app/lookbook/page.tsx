import { MotionReveal } from "@/components/MotionReveal";
import { UiIcon } from "@/components/UiIcon";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ProductArtwork } from "@/components/ProductArtwork";
import { products } from "@/data/products";

export const metadata: Metadata = { title: "Lookbook", description: "An editorial study of OFF / AXIS Collection 01." };
export default function LookbookPage() {
  return <main id="main-content" className="lookbook-page"><div className="lookbook-cover"><Image src="/images/campaign/campaign-two-v2.webp" alt="Two models in off-axis poses wearing monochrome utility clothes on a concrete rooftop" fill priority sizes="100vw" /><div className="lookbook-cover-shade" /><p>FORM / 27 — VISUAL JOURNAL / 001</p><MotionReveal as="h1">THE<br />SPACE<br /><em>BETWEEN.</em></MotionReveal><span>LOOKBOOK / OFF — AXIS / 2026</span></div>
    <section className="lookbook-opening section-pad"><div><p className="eyebrow">01 / AN INTRODUCTION</p><MotionReveal as="h2">ROOM TO<br /><em>MOVE.</em></MotionReveal></div><p>A collection is a proposition. This one asks what happens when a garment holds its shape while the body finds its own. Eight pieces in dialogue with light, concrete and open space.</p></section>
    <section className="lookbook-spread spread-one"><MotionReveal variant="crop" className="spread-photo"><Image src="/images/campaign/campaign-one-v2.webp" alt="Model in a white jacket and wide charcoal trousers crossing a concrete colonnade" fill sizes="(max-width: 800px) 100vw, 66vw" /></MotionReveal><div className="spread-caption"><span>001 / IN TRANSIT</span><MotionReveal as="h2">LINES THAT<br />MOVE.</MotionReveal><p>The Axis Trouser and Shell Jacket.</p><Link href="/products/axis-trouser">SHOP THE AXIS TROUSER <UiIcon icon={ArrowRight} size={17} /></Link></div></section>
    <section className="lookbook-interlude"><span>NOT THE BODY IN SERVICE OF CLOTHES.</span><strong>CLOTHES IN SERVICE OF MOVEMENT.</strong><span>FORM / 27 — 001</span></section>
    <section className="lookbook-spread spread-two"><MotionReveal variant="image" className="spread-detail"><Image src="/images/campaign/lookbook-detail-v2.webp" alt="Close study of a structured pale jacket and charcoal trouser at a concrete stair" fill sizes="(max-width: 800px) 100vw, 44vw" /><span>002 / THE JOIN</span></MotionReveal><div className="spread-product"><ProductArtwork product={products[1]} view="worn" /><div><span>003 / VOLUME STUDY</span><h2>THE<br />FOLD.</h2><Link href="/products/fold-trouser">EXPLORE THE FOLD TROUSER <UiIcon icon={ArrowUpRight} size="0.84em" className="ui-icon-inline" /></Link></div></div></section>
    <section className="lookbook-finale"><p>FINAL FRAME / 004</p><div><MotionReveal as="h2">WEAR<br />YOUR OWN<br /><em>FORM.</em></MotionReveal><Link className="hero-cta" href="/shop">DISCOVER THE COLLECTION <UiIcon icon={ArrowRight} size={18} /></Link></div><Image src="/images/campaign/hero-v2.webp" alt="Two models in sculptural monochrome fashion on concrete stairs" fill sizes="100vw" /></section>
  </main>;
}

