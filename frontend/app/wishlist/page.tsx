import { WishlistPageClient } from "@/components/WishlistPageClient";

export default function WishlistPage() {
  return (
    <main className="container page-space">
      <section className="section">
        <div className="eyebrow">Избранное</div>
        <h1 className="section-title">Сохраненные позиции</h1>
        <p className="section-subtitle">
          Здесь собраны панели, которые вы отметили, чтобы вернуться к ним позже или быстро добавить их в корзину.
        </p>
      </section>
      <WishlistPageClient />
    </main>
  );
}
