"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { addCartItem, clearCartItems, listCartItems, removeCartItem, type CartItem } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";

export type CartProductInput = {
  productId: string;
  collectionId: string;
  name: string;
  image: string;
  art?: string | null;
  size?: string | null;
  price?: number | null;
  felt?: string | null;
  quantity?: number;
};

type ActionResult = {
  ok: boolean;
  message: string;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  addItem: (item: CartProductInput) => Promise<ActionResult>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  async function refreshCart() {
    if (!user) {
      setItems([]);
      return;
    }

    try {
      setItems(await listCartItems(user.id));
    } catch {
      setItems([]);
    }
  }

  useEffect(() => {
    void refreshCart();
  }, [user?.id]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.length,
      addItem: async (item) => {
        if (!user) {
          return { ok: false, message: "Чтобы сохранять корзину, войдите в аккаунт." };
        }

        await addCartItem(user.id, {
          product_id: item.productId,
          collection_id: item.collectionId,
          product_name: item.name,
          image: item.image,
          art: item.art,
          size: item.size,
          felt: item.felt,
          price: item.price,
          quantity: item.quantity ?? 1,
        });
        await refreshCart();
        return { ok: true, message: "Позиция добавлена в корзину." };
      },
      removeItem: async (itemId) => {
        if (!user) {
          return;
        }
        await removeCartItem(user.id, itemId);
        await refreshCart();
      },
      clearCart: async () => {
        if (!user) {
          setItems([]);
          return;
        }
        await clearCartItems(user.id);
        setItems([]);
      },
      refreshCart,
    }),
    [items, user],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
