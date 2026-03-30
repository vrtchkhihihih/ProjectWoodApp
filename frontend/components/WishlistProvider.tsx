"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  addWishlistItem,
  clearWishlistItems,
  listWishlistItems,
  removeWishlistItem as apiRemoveWishlistItem,
  type WishlistItem,
} from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";

export type WishlistProductInput = {
  productId: string;
  collectionId: string;
  name: string;
  image: string;
  art?: string | null;
  size?: string | null;
  price?: number | null;
  felt?: string | null;
};

type WishlistContextValue = {
  items: WishlistItem[];
  count: number;
  isInWishlist: (productId: string) => boolean;
  addItem: (item: WishlistProductInput) => Promise<{ ok: boolean; message: string }>;
  removeItem: (itemId: number) => Promise<void>;
  toggleItem: (item: WishlistProductInput) => Promise<{ ok: boolean; message: string }>;
  clearWishlist: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);

  async function refreshWishlist() {
    if (!user) {
      setItems([]);
      return;
    }

    try {
      setItems(await listWishlistItems(user.id));
    } catch {
      setItems([]);
    }
  }

  useEffect(() => {
    void refreshWishlist();
  }, [user?.id]);

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      count: items.length,
      isInWishlist: (productId) => items.some((item) => item.product_id === productId),
      addItem: async (item) => {
        if (!user) {
          return { ok: false, message: "Чтобы сохранять избранное, войдите в аккаунт." };
        }

        await addWishlistItem(user.id, {
          product_id: item.productId,
          collection_id: item.collectionId,
          product_name: item.name,
          image: item.image,
          art: item.art,
          size: item.size,
          felt: item.felt,
          price: item.price,
        });
        await refreshWishlist();
        return { ok: true, message: "Позиция добавлена в избранное." };
      },
      removeItem: async (itemId) => {
        if (!user) {
          return;
        }
        await apiRemoveWishlistItem(user.id, itemId);
        await refreshWishlist();
      },
      toggleItem: async (item) => {
        if (!user) {
          return { ok: false, message: "Чтобы сохранять избранное, войдите в аккаунт." };
        }

        const existing = items.find((entry) => entry.product_id === item.productId);
        if (existing) {
          await apiRemoveWishlistItem(user.id, existing.id);
          await refreshWishlist();
          return { ok: true, message: "Позиция удалена из избранного." };
        }

        await addWishlistItem(user.id, {
          product_id: item.productId,
          collection_id: item.collectionId,
          product_name: item.name,
          image: item.image,
          art: item.art,
          size: item.size,
          felt: item.felt,
          price: item.price,
        });
        await refreshWishlist();
        return { ok: true, message: "Позиция добавлена в избранное." };
      },
      clearWishlist: async () => {
        if (!user) {
          setItems([]);
          return;
        }
        await clearWishlistItems(user.id);
        setItems([]);
      },
      refreshWishlist,
    }),
    [items, user],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
