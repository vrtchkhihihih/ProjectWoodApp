import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthProvider } from "@/components/AuthProvider";
import { CartProvider } from "@/components/CartProvider";
import { MetrikaLoader } from "@/components/MetrikaLoader";
import { SiteHeader } from "@/components/SiteHeader";
import { WishlistProvider } from "@/components/WishlistProvider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Wood App",
  description: "Wood App на Next.js и FastAPI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <Suspense fallback={null}>
                <MetrikaLoader />
              </Suspense>
              <div className="page-shell">
                <SiteHeader />
                {children}
              </div>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
