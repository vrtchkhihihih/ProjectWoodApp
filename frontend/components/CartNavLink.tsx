"use client";

import Link from "next/link";

import { useCart } from "@/components/CartProvider";

export function CartNavLink() {
  const { count } = useCart();

  return <Link href="/cart">Корзина{count > 0 ? ` (${count})` : ""}</Link>;
}
