import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MotionReveal } from "@/components/MotionReveal";
import { UiIcon } from "@/components/UiIcon";
import { HeroPlan } from "@/components/home/HeroPlan";
import { AxisTrack } from "@/components/home/AxisTrack";
import { ElevationFeature } from "@/components/home/ElevationFeature";
import { SectionCut } from "@/components/home/SectionCut";
import { FrameStack } from "@/components/home/FrameStack";
import { collection } from "@/data/editorial";
import { products } from "@/data/products";

export default function HomePage() {
  return <main id="main-content" className="home">
    <HeroPlan />
    <AxisTrack products={products} />
    <ElevationFeature />
    <SectionCut />
    <FrameStack />
    <section className="manifesto section-pad" aria-labelledby="manifesto-title">
      <h2 id="manifesto-title" className="sr-only">What FORM / 27 believes</h2>
      <MotionReveal as="blockquote">“Clothes should make <em>space</em> for the body.”</MotionReveal>
      <div><p>{collection.manifesto}</p><Link className="text-arrow" href="/about">THE IDEA BEHIND FORM / 27 <UiIcon icon={ArrowRight} size={18} /></Link></div>
    </section>
  </main>;
}
