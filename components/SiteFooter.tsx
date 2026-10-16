import Link from "next/link";
import { Newsletter } from "./Newsletter";
import { CreatorCredit } from "./CreatorCredit";
import { PlanGrid } from "./plan/PlanGrid";

/** The drawing's title block: who drew it, which sheets exist, and how to stay in touch. */
export function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-news"><PlanGrid cols={4} rows={2} className="footer-grid" /><div><h2>Stay<br /><em>in form.</em></h2></div><Newsletter /></div>
    <div className="footer-bottom"><Link className="footer-logo" href="/">FORM / 27<span>.</span></Link><nav aria-label="Footer navigation"><Link href="/shop">Shop</Link><Link href="/lookbook">Lookbook</Link><Link href="/campaign">Campaign</Link><Link href="/about">About</Link><Link href="/size-guide">Size Guide</Link><Link href="/cart">Bag</Link></nav>
      <dl className="footer-titleblock"><div><dt>Sheet set</dt><dd>OFF / AXIS · 01</dd></div><div><dt>Drawn by</dt><dd>Alson Chua</dd></div><div><dt>Status</dt><dd>Concept · not for sale</dd></div></dl>
    </div>
    <CreatorCredit />
    <div className="footer-legal"><span>© FORM / 27 — FICTIONAL BRAND STUDY</span><span>CONCEPT PROJECT · GENERATED CAMPAIGN IMAGERY</span><span>DESIGNED FOR THE UNEXPECTED</span></div>
  </footer>;
}
