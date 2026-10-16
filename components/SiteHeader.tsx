"use client";
import { UiIcon } from "@/components/UiIcon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useCart } from "./CartProvider";
import { MotionToggle } from "./MotionToggle";

const links = [{ href: "/shop", label: "Shop", axis: "A" }, { href: "/lookbook", label: "Lookbook", axis: "B" }, { href: "/campaign", label: "Campaign", axis: "C" }, { href: "/about", label: "About", axis: "D" }];

export function SiteHeader() {
  const { count, ready } = useCart();
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => { dialog.current?.close(); }, [pathname]);
  const close = () => { dialog.current?.close(); trigger.current?.focus(); };
  const shown = ready ? count : 0;
  return <>
    <header className="site-shell-header"><a className="skip-link" href="#main-content">Skip to content</a>
    <div className="concept-strip"><span className="strip-wide">FORM / 27 — INDEPENDENT FORM STUDIES</span><strong>CONCEPT PROJECT</strong><MotionToggle /></div>
    <div className="site-header">
      <button ref={trigger} type="button" className="menu-trigger" aria-label="Open navigation" onClick={() => dialog.current?.showModal()}><UiIcon icon={Menu} size={22} /></button>
      <Link className="wordmark" href="/" aria-label="FORM / 27 homepage">FORM<span className="wordmark-slash">/</span>27<span className="wordmark-dot">.</span></Link>
      <nav className="desktop-nav" aria-label="Primary navigation">{links.map(link => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined}><span className="nav-axis" aria-hidden="true">{link.axis}</span>{link.label}</Link>)}</nav>
      <Link className="header-cart" href="/cart" data-bag-target>Bag <span key={shown} className={shown ? "bag-count has-items" : "bag-count"} aria-label={`${shown} items`}>({shown})</span></Link>
    </div></header>
    <dialog ref={dialog} className="menu-dialog" onClick={event => { if (event.target === dialog.current) close(); }} onClose={() => trigger.current?.focus()}>
      <div className="menu-dialog-inner"><div className="menu-dialog-top"><span className="menu-dialog-title">FORM / 27 — Sheet index</span><button type="button" aria-label="Close navigation" onClick={close}><UiIcon icon={X} /></button></div>
        <nav aria-label="Mobile navigation">{links.map(link => <Link key={link.href} href={link.href} onClick={close}><span>{link.axis}</span>{link.label}<span><UiIcon icon={ArrowUpRight} size={11} className="ui-icon-inline" /></span></Link>)}<Link href="/size-guide" onClick={close}><span>E</span>Size Guide<span><UiIcon icon={ArrowUpRight} size={11} className="ui-icon-inline" /></span></Link></nav>
        <p>Cut for movement. Built around you.</p>
      </div>
    </dialog>
  </>;
}
