import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products, productBySlug } from "@/data/products";
import { ProductExperience } from "@/components/ProductExperience";
import { ProductCard } from "@/components/ProductCard";

export function generateStaticParams() { return products.map(product => ({ slug: product.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = productBySlug(slug);
  return { title: product ? product.name : "Piece not found", description: product?.description };
}
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) notFound();
  const related = products.filter(item => item.slug !== product.slug && (item.category === product.category || item.color === product.color)).slice(0, 3);
  while (related.length < 3) { const next = products.find(item => item.slug !== product.slug && !related.includes(item)); if (!next) break; related.push(next); }
  return <main id="main-content"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/shop">SHOP</Link><span>/</span><span>{product.category.toUpperCase()}</span><span>/</span><span aria-current="page">{product.name.toUpperCase()}</span></nav><ProductExperience product={product} /><section className="related section-pad"><div className="section-heading compact-heading"><h2>OTHER<br /><em>FORMS.</em></h2><p className="sheet-note">Still in FORM / 27</p></div><div className="home-product-grid">{related.map((item, index) => <ProductCard key={item.slug} product={item} index={index} />)}</div></section></main>;
}
