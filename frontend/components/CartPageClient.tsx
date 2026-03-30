"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/components/AuthProvider";
import { useCart } from "@/components/CartProvider";
import { ProductThumb } from "@/components/ProductThumb";
import { createOrder } from "@/lib/api";
import { trackEvent } from "@/lib/analytics";

export function CartPageClient() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, removeItem, clearCart } = useCart();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [createdOrder, setCreatedOrder] = useState<{ orderNumber: string; totalAmount: number } | null>(null);

  const total = items.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0);

  async function handleCheckout() {
    if (items.length === 0) {
      setFeedback({ type: "error", text: "Корзина пока пуста." });
      return;
    }

    if (!user) {
      router.push("/login?next=/cart");
      return;
    }

    try {
      const order = await createOrder({
        user_id: user.id,
        customer_name: user.name,
        phone: user.phone || "",
        email: user.email,
        items: items.map((item) => ({
          product_id: item.product_id,
          collection_id: item.collection_id,
          product_name: item.product_name,
          image: item.image,
          art: item.art,
          size: item.size,
          felt: item.felt,
          price: item.price,
          quantity: item.quantity,
        })),
      });

      await trackEvent("order_created", { order_number: order.order_number, total: order.total_amount }, user.id);
      await clearCart();

      setCreatedOrder({
        orderNumber: order.order_number,
        totalAmount: order.total_amount,
      });
      setFeedback({ type: "success", text: `Заказ ${order.order_number} успешно оформлен.` });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setFeedback({
        type: "error",
        text: error instanceof Error ? error.message : "Не удалось оформить заказ.",
      });
    }
  }

  if (createdOrder) {
    return (
      <section className="detail-panel checkout-success-panel">
        <div className="eyebrow">Заказ оформлен</div>
        <h1 className="section-title">Спасибо, заказ принят в работу</h1>
        <p className="section-subtitle">
          Мы сохранили заказ <strong>{createdOrder.orderNumber}</strong>. Его состав уже доступен в личном кабинете, а
          данные переданы в CRM для дальнейшей обработки.
        </p>
        <div className="checkout-success-summary">
          <div>
            <span>Номер заказа</span>
            <strong>{createdOrder.orderNumber}</strong>
          </div>
          <div>
            <span>Сумма</span>
            <strong>{createdOrder.totalAmount.toLocaleString("ru-RU")} ₽</strong>
          </div>
        </div>
        <div className="actions">
          <button className="btn btn-primary" type="button" onClick={() => router.push("/account")}>
            Перейти в кабинет
          </button>
          <Link href="/#catalog" className="btn">
            Вернуться в каталог
          </Link>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="detail-panel">
        <p className="section-subtitle">Корзина пока пуста.</p>
        <Link href="/#catalog" className="btn btn-primary">
          Перейти в каталог
        </Link>
      </section>
    );
  }

  return (
    <section className="cart-grid">
      <div className="cart-items">
        {items.map((item) => (
          <article key={item.id} className="cart-item-card">
            <ProductThumb
              className="cart-item-image"
              image={item.image}
              productId={item.product_id}
              collectionId={item.collection_id}
              alt={item.product_name}
            />
            <div className="cart-item-body">
              <h3>{item.product_name}</h3>
              <p>
                {item.art ?? "Без артикула"}
                {item.size ? ` · ${item.size}` : ""}
                {item.quantity ? ` · x${item.quantity}` : ""}
              </p>
              <strong>{item.price ? `${item.price.toLocaleString("ru-RU")} ₽` : "По запросу"}</strong>
            </div>
            <button className="btn" type="button" onClick={() => void removeItem(item.id)}>
              Удалить
            </button>
          </article>
        ))}
      </div>
      <aside className="detail-panel">
        <p className="detail-block-title">Итого</p>
        <div className="detail-price">{total.toLocaleString("ru-RU")} ₽</div>
        <p className="section-subtitle">
          Корзина хранится в базе данных и оформляется как полноценный заказ с сохранением состава и передачей данных в
          CRM.
        </p>
        <div className="actions">
          <button className="btn btn-primary" type="button" onClick={() => void handleCheckout()}>
            Оформить заказ
          </button>
          <Link href="/contacts" className="btn">
            Контакты
          </Link>
          <button className="btn" type="button" onClick={() => void clearCart()}>
            Очистить
          </button>
        </div>
        {feedback ? <div className={`order-feedback ${feedback.type}`}>{feedback.text}</div> : null}
      </aside>
    </section>
  );
}
