import type { Metadata } from "next";
import { CartPage } from "@/components/CartPage";
export const metadata: Metadata = { title: "Your Bag" };
export default function Page() { return <CartPage />; }
