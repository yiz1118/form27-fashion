import type { Metadata } from "next";
import "@fontsource-variable/mona-sans/wdth.css";
import "@fontsource-variable/martian-mono/wdth.css";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { MotionProvider } from "@/components/MotionProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { conceptProject, creator } from "@/config/creator";
import { motionBootScript } from "@/lib/motion-pref";

export const metadata: Metadata = {
  title: { default: "FORM / 27 — OFF / AXIS", template: "%s | FORM / 27" },
  description: `${conceptProject.name} — an independent concept website designed and developed by ${creator.name}. Explore OFF / AXIS, a fictional collection of sculptural utility clothing.`,
  authors: [{ name: creator.name }],
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // The boot script sets data-motion before first paint, so <html> attributes legitimately differ from the server render.
  return <html lang="en" data-motion="full" suppressHydrationWarning>
    <head><script dangerouslySetInnerHTML={{ __html: motionBootScript }} /></head>
    <body><MotionProvider><CartProvider><SiteHeader />{children}<SiteFooter /></CartProvider></MotionProvider></body>
  </html>;
}
