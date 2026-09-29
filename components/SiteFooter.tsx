import Link from "next/link";
import { Newsletter } from "./Newsletter";
import { CreatorCredit } from "./CreatorCredit";

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-news"><div><p className="eyebrow">NO. 01 / KEEP IN TOUCH</p><h2>STAY<br /><em>IN FORM.</em></h2></div><Newsletter /></div>
    <div className="footer-bottom"><Link className="footer-logo" href="/">FORM / 27<span>.</span></Link><nav aria-label="Footer navigation"><Link href="/shop">Shop</Link><Link href="/lookbook">Lookbook</Link><Link href="/campaign">Campaign</Link><Link href="/about">About</Link><Link href="/size-guide">Size Guide</Link><Link href="/cart">Bag</Link></nav></div>
    <CreatorCredit />
    <div className="footer-legal"><span>© FORM / 27 — FICTIONAL BRAND STUDY</span><span>CONCEPT PROJECT · GENERATED CAMPAIGN IMAGERY</span><span>DESIGNED FOR THE UNEXPECTED</span></div>
  </footer>;
}
