"use client";

import Link from "next/link";

import { useCart } from "@/components/CartProvider";
import { useWishlist } from "@/components/WishlistProvider";
import { assetUrl } from "@/lib/assets";

export function WishlistPageClient() {
  const { items, clearWishlist, removeItem } = useWishlist();
  const { addItem } = useCart();

  async function handleAddAllToCart() {
    for (const item of items) {
      await addItem({
        collectionId: item.collection_id,
        productId: item.product_id,
        name: item.product_name,
        image: item.image,
        art: item.art,
        size: item.size,
        price: item.price,
        felt: item.felt,
      });
    }
  }

  if (items.length === 0) {
    return (
      <section className="detail-panel wishlist-empty">
        <div className="section-title">Избранное пока пусто</div>
        <p className="section-subtitle">
          Сохраняйте товары в избранное на странице коллекции, чтобы быстро вернуться к ним позже.
        </p>
        <Link href="/#catalog" className="btn btn-primary">
          Перейти в каталог
        </Link>
      </section>
    );
  }

  return (
    <section className="wishlist-layout">
      <div className="wishlist-toolbar">
        <div className="eyebrow">Сохраненные товары</div>
        <div className="wishlist-actions">
          <button type="button" className="btn btn-primary" onClick={() => void handleAddAllToCart()}>
            Добавить все в корзину
          </button>
          <button type="button" className="btn" onClick={() => void clearWishlist()}>
            Очистить список
          </button>
        </div>
      </div>

      <div className="wishlist-grid">
        {items.map((item) => (
          <article key={item.id} className="wishlist-card">
            <button type="button" className="wishlist-remove" onClick={() => void removeItem(item.id)} aria-label="Удалить из избранного">
              ×
            </button>
            <Link href={`/catalog/${item.collection_id}?color=${item.product_id}`} className="wishlist-card-link">
              <img className="wishlist-card-image" src={assetUrl(item.image)} alt={item.product_name} />
              <div className="wishlist-card-body">
                <strong className="wishlist-card-name">{item.product_name}</strong>
                <span className="wishlist-card-meta">
                  {item.art ?? "Без артикула"}
                  {item.felt ? ` · ${item.felt}` : ""}
                </span>
                <span className="wishlist-card-price">
                  {item.price ? `${item.price.toLocaleString("ru-RU")} ₽` : "По запросу"}
                </span>
              </div>
            </Link>
            <div className="wishlist-card-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  void addItem({
                    collectionId: item.collection_id,
                    productId: item.product_id,
                    name: item.product_name,
                    image: item.image,
                    art: item.art,
                    size: item.size,
                    price: item.price,
                    felt: item.felt,
                  })
                }
              >
                В корзину
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
