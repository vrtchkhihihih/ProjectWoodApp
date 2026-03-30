"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/components/AuthProvider";
import { useCart } from "@/components/CartProvider";
import { ProductThumb } from "@/components/ProductThumb";
import { useWishlist } from "@/components/WishlistProvider";
import { listOrders, type OrderRead } from "@/lib/api";

type TabId = "orders" | "profile" | "cart" | "wishlist";

export function AccountPageClient() {
  const { user, hydrated, updateProfile } = useAuth();
  const { items, refreshCart } = useCart();
  const { items: wishlistItems, removeItem: removeWishlistItem, refreshWishlist } = useWishlist();

  const [activeTab, setActiveTab] = useState<TabId>("orders");
  const [orders, setOrders] = useState<OrderRead[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    setName(user.name);
    setPhone(user.phone ?? "");

    listOrders(user.id)
      .then(setOrders)
      .catch(() => setOrders([]));
    void refreshCart();
    void refreshWishlist();
  }, [user?.id]);

  const totalSpent = useMemo(() => orders.reduce((sum, order) => sum + order.total_amount, 0), [orders]);

  if (!hydrated) {
    return <section className="detail-panel">Загрузка кабинета...</section>;
  }

  if (!user) {
    return (
      <section className="detail-panel account-empty">
        <h1 className="section-title">Личный кабинет</h1>
        <p className="section-subtitle">Сначала войдите в систему, чтобы увидеть свои данные, избранное и заказы.</p>
        <div className="actions">
          <Link href="/login" className="btn btn-primary">
            Войти
          </Link>
          <Link href="/register" className="btn">
            Регистрация
          </Link>
        </div>
      </section>
    );
  }

  if (user.role === "admin") {
    return (
      <section className="detail-panel account-empty">
        <h1 className="section-title">Администратор</h1>
        <p className="section-subtitle">Для роли администратора открыт отдельный кабинет управления.</p>
        <Link href="/admin" className="btn btn-primary">
          Перейти в админ-панель
        </Link>
      </section>
    );
  }

  async function handleSaveProfile() {
    const result = await updateProfile({ name, phone, password });
    setFeedback({ type: result.ok ? "success" : "error", text: result.message });
    if (result.ok) {
      setPassword("");
    }
  }

  return (
    <section className="account-layout">
      <aside className="account-sidebar">
        <div className="account-avatar">{user.name.slice(0, 1).toUpperCase()}</div>
        <div className="account-name">{user.name}</div>
        <div className="account-email">{user.email}</div>
        <div className="account-summary">
          <div>
            <strong>{orders.length}</strong>
            <span>заказов</span>
          </div>
          <div>
            <strong>{totalSpent.toLocaleString("ru-RU")} ₽</strong>
            <span>сумма</span>
          </div>
          <div>
            <strong>{wishlistItems.length}</strong>
            <span>в избранном</span>
          </div>
        </div>
        <div className="account-menu">
          <button type="button" className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>
            Мои заказы
          </button>
          <button type="button" className={activeTab === "cart" ? "active" : ""} onClick={() => setActiveTab("cart")}>
            Текущая корзина
          </button>
          <button type="button" className={activeTab === "wishlist" ? "active" : ""} onClick={() => setActiveTab("wishlist")}>
            Избранное
          </button>
          <button type="button" className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>
            Профиль
          </button>
        </div>
      </aside>

      <div className="account-content">
        {activeTab === "orders" ? (
          <div className="detail-panel">
            <div className="eyebrow">Заказы</div>
            <h2 className="account-section-title">История заказов</h2>
            {orders.length === 0 ? (
              <div className="empty-state-panel">
                <p>Заказов пока нет. Можно собрать корзину и оформить первую покупку.</p>
                <Link href="/#catalog" className="btn btn-primary">
                  Открыть каталог
                </Link>
              </div>
            ) : (
              <div className="account-orders">
                {orders.map((order) => (
                  <article key={order.id} className="account-order-card">
                    <div className="account-order-head">
                      <div>
                        <strong>{order.order_number}</strong>
                        <span>{order.status}</span>
                      </div>
                      <div>
                        <strong>{order.total_amount.toLocaleString("ru-RU")} ₽</strong>
                        <span>{order.email}</span>
                      </div>
                    </div>
                    <div className="account-order-items">
                      {order.items.map((item) => (
                        <div key={`${order.id}-${item.id}`} className="account-order-item">
                          <ProductThumb
                            image={item.image}
                            productId={item.product_id}
                            collectionId={item.collection_id}
                            alt={item.product_name}
                          />
                          <div>
                            <strong>{item.product_name}</strong>
                            <span>
                              {item.art ?? "Без артикула"}
                              {item.size ? ` · ${item.size}` : ""}
                              {item.quantity ? ` · x${item.quantity}` : ""}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {activeTab === "cart" ? (
          <div className="detail-panel">
            <div className="eyebrow">Подборка</div>
            <h2 className="account-section-title">Текущая корзина</h2>
            {items.length === 0 ? (
              <div className="empty-state-panel">
                <p>В корзине пока нет позиций.</p>
                <Link href="/#catalog" className="btn btn-primary">
                  Перейти в каталог
                </Link>
              </div>
            ) : (
              <div className="account-order-items">
                {items.map((item) => (
                  <div key={item.id} className="account-order-item">
                    <ProductThumb
                      image={item.image}
                      productId={item.product_id}
                      collectionId={item.collection_id}
                      alt={item.product_name}
                    />
                    <div>
                      <strong>{item.product_name}</strong>
                      <span>
                        {item.art ?? "Без артикула"}
                        {item.price ? ` · ${item.price.toLocaleString("ru-RU")} ₽` : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {activeTab === "wishlist" ? (
          <div className="detail-panel">
            <div className="eyebrow">Избранное</div>
            <h2 className="account-section-title">Сохраненные товары</h2>
            {wishlistItems.length === 0 ? (
              <div className="empty-state-panel">
                <p>В избранном пока нет позиций.</p>
                <Link href="/#catalog" className="btn btn-primary">
                  Перейти в каталог
                </Link>
              </div>
            ) : (
              <div className="account-order-items">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="account-order-item">
                    <ProductThumb
                      image={item.image}
                      productId={item.product_id}
                      collectionId={item.collection_id}
                      alt={item.product_name}
                    />
                    <div>
                      <strong>{item.product_name}</strong>
                      <span>
                        {item.art ?? "Без артикула"}
                        {item.price ? ` · ${item.price.toLocaleString("ru-RU")} ₽` : ""}
                      </span>
                    </div>
                    <button type="button" className="btn" onClick={() => void removeWishlistItem(item.id)}>
                      Удалить
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {activeTab === "profile" ? (
          <div className="detail-panel">
            <div className="eyebrow">Профиль</div>
            <h2 className="account-section-title">Данные пользователя</h2>
            <div className="profile-grid">
              <input className="order-input" type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="Имя" />
              <input className="order-input" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Телефон" />
              <input className="order-input profile-wide" type="email" value={user.email} readOnly />
              <input
                className="order-input profile-wide"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Новый пароль"
              />
            </div>
            <div className="actions">
              <button type="button" className="btn btn-primary" onClick={() => void handleSaveProfile()}>
                Сохранить
              </button>
            </div>
            {feedback ? <div className={`order-feedback ${feedback.type}`}>{feedback.text}</div> : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
