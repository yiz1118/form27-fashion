import type { Metadata } from "next";
import "@fontsource/archivo/400.css";
import "@fontsource/archivo/500.css";
import "@fontsource/archivo/600.css";
import "@fontsource/archivo/700.css";
import "@fontsource/archivo-black/400.css";
import "@fontsource/barlow-condensed/600.css";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { conceptProject, creator } from "@/config/creator";

export const metadata: Metadata = {
  title: { default: "FORM / 27 — OFF / AXIS", template: "%s | FORM / 27" },
  description: `${conceptProject.name} — an independent concept website designed and developed by ${creator.name}. Explore OFF / AXIS, a fictional collection of sculptural utility clothing.`,
  authors: [{ name: creator.name }],
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><CartProvider><SiteHeader />{children}<SiteFooter /></CartProvider></body></html>;
}
