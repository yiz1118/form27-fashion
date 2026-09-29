"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { addItem, CART_KEY, restoreCart, setQuantity, subtotal, type CartItem } from "@/lib/cart";

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotalCents: number;
  ready: boolean;
  add: (variantId: string) => void;
  changeQuantity: (variantId: string, quantity: number) => void;
  remove: (variantId: string) => void;
}
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      try { setItems(restoreCart(window.localStorage.getItem(CART_KEY))); } catch { setItems([]); }
      setReady(true);
    }, 0);
    const onStorage = (event: StorageEvent) => {
      if (event.key === CART_KEY) setItems(restoreCart(event.newValue));
    };
    window.addEventListener("storage", onStorage);
    return () => { window.clearTimeout(id); window.removeEventListener("storage", onStorage); };
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { window.localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch { /* Cart remains usable for this session. */ }
  }, [items, ready]);

  const add = useCallback((variantId: string) => setItems(current => addItem(current, variantId)), []);
  const changeQuantity = useCallback((variantId: string, quantity: number) => setItems(current => setQuantity(current, variantId, quantity)), []);
  const remove = useCallback((variantId: string) => setItems(current => current.filter(item => item.variantId !== variantId)), []);
  const value = useMemo(() => ({ items, count: items.reduce((count, item) => count + item.quantity, 0), subtotalCents: subtotal(items), ready, add, changeQuantity, remove }), [items, ready, add, changeQuantity, remove]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
