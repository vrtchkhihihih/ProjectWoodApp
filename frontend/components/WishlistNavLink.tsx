"use client";

import Link from "next/link";

import { useWishlist } from "@/components/WishlistProvider";

export function WishlistNavLink() {
  const { count } = useWishlist();

  return <Link href="/wishlist">Избранное{count > 0 ? ` (${count})` : ""}</Link>;
}
