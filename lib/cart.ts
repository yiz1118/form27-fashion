import { variantById } from "@/data/products";

export interface CartItem { variantId: string; quantity: number }
export const CART_KEY = "form27-cart-v1";

export function restoreCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.reduce<CartItem[]>((items, item: unknown) => {
      if (!item || typeof item !== "object" || !("variantId" in item) || !("quantity" in item)) return items;
      const candidate = item as { variantId: unknown; quantity: unknown };
      if (typeof candidate.variantId !== "string" || typeof candidate.quantity !== "number" || !Number.isInteger(candidate.quantity) || candidate.quantity < 1) return items;
      const match = variantById(candidate.variantId);
      if (!match?.variant.available) return items;
      const existing = items.find(entry => entry.variantId === candidate.variantId);
      if (existing) existing.quantity = Math.min(99, existing.quantity + candidate.quantity);
      else items.push({ variantId: candidate.variantId, quantity: Math.min(99, candidate.quantity) });
      return items;
    }, []);
  } catch { return []; }
}

export function addItem(items: CartItem[], variantId: string): CartItem[] {
  const match = variantById(variantId);
  if (!match?.variant.available) return items;
  const existing = items.find(item => item.variantId === variantId);
  return existing ? items.map(item => item.variantId === variantId ? { ...item, quantity: Math.min(99, item.quantity + 1) } : item) : [...items, { variantId, quantity: 1 }];
}

export function setQuantity(items: CartItem[], variantId: string, quantity: number): CartItem[] {
  if (!Number.isInteger(quantity)) return items;
  if (quantity <= 0) return items.filter(item => item.variantId !== variantId);
  return items.map(item => item.variantId === variantId ? { ...item, quantity: Math.min(99, quantity) } : item);
}

export function subtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + (variantById(item.variantId)?.product.priceCents ?? 0) * item.quantity, 0);
}
