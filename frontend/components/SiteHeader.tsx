"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/AuthProvider";
import { CartNavLink } from "@/components/CartNavLink";
import { WishlistNavLink } from "@/components/WishlistNavLink";

function getNavHref(pathname: string, anchor: string) {
  return pathname === "/" ? anchor : `/${anchor}`;
}

export function SiteHeader() {
  const pathname = usePathname();
  const { user, hydrated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleLogout() {
    logout();
    closeMenu();
  }

  return (
    <>
      <header className="topbar">
        <Link href="/" className="brand">
          Wood App
        </Link>

        <div className="topbar-desktop">
          <nav className="topnav">
            <Link href={getNavHref(pathname, "#catalog")}>Каталог</Link>
            <Link href={getNavHref(pathname, "#install")}>Установка</Link>
            <Link href={getNavHref(pathname, "#delivery")}>Доставка и оплата</Link>
            <Link href="/contacts">Контакты</Link>
          </nav>

          <div className="topnav topnav-actions">
            <WishlistNavLink />
            <CartNavLink />
            {!hydrated ? null : user ? (
              <>
                <Link href={user.role === "admin" ? "/admin" : "/account"}>
                  {user.role === "admin" ? "Админ" : "Аккаунт"}
                </Link>
                <button type="button" className="header-link-button" onClick={logout}>
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link href="/login">Вход</Link>
                <Link href="/register">Регистрация</Link>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          className={`mobile-menu-toggle ${menuOpen ? "is-open" : ""}`}
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <div className={`mobile-nav-drawer ${menuOpen ? "open" : ""}`}>
        <button type="button" className="mobile-nav-backdrop" aria-label="Закрыть меню" onClick={closeMenu} />
        <div className="mobile-nav-panel">
          <div className="mobile-nav-head">
            <div>
              <div className="eyebrow">Навигация</div>
              <strong>Wood App</strong>
            </div>
            <button type="button" className="mobile-nav-close" aria-label="Закрыть меню" onClick={closeMenu}>
              <span />
              <span />
            </button>
          </div>

          <nav className="mobile-nav-links">
            <Link href={getNavHref(pathname, "#catalog")} onClick={closeMenu}>
              Каталог
            </Link>
            <Link href={getNavHref(pathname, "#install")} onClick={closeMenu}>
              Установка
            </Link>
            <Link href={getNavHref(pathname, "#delivery")} onClick={closeMenu}>
              Доставка и оплата
            </Link>
            <Link href="/contacts" onClick={closeMenu}>
              Контакты
            </Link>
          </nav>

          <div className="mobile-nav-meta">
            <WishlistNavLink />
            <CartNavLink />
            {!hydrated ? null : user ? (
              <>
                <Link href={user.role === "admin" ? "/admin" : "/account"} onClick={closeMenu}>
                  {user.role === "admin" ? "Админ-панель" : "Аккаунт"}
                </Link>
                <button type="button" className="header-link-button mobile-nav-logout" onClick={handleLogout}>
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={closeMenu}>
                  Вход
                </Link>
                <Link href="/register" onClick={closeMenu}>
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
