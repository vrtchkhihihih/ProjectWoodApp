import { CartPageClient } from "@/components/CartPageClient";

export default function CartPage() {
  return (
    <main className="container page-space">
      <section className="section">
        <div className="eyebrow">Корзина</div>
        <h1 className="section-title">Выбранные позиции</h1>
        <p className="section-subtitle">
          Здесь пользователь собирает подборку, а затем оформляет заказ с сохранением в личный кабинет.
        </p>
      </section>
      <CartPageClient />
    </main>
  );
}
