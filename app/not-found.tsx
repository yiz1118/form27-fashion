import { UiIcon } from "@/components/UiIcon";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
export default function NotFound() { return <main id="main-content" className="not-found"><p className="eyebrow">404 / OUT OF FRAME</p><h1>THIS FORM<br />IS MISSING<span className="accent-dot">.</span></h1><p>The page or piece you asked for is not in this collection.</p><Link className="black-button" href="/shop"><span>BACK TO THE COLLECTION <UiIcon icon={ArrowUpRight} size="0.9475em" className="ui-icon-inline" /></span></Link></main>; }
