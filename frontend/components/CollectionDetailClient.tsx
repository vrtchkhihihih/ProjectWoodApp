"use client";

import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/components/AuthProvider";
import { useCart } from "@/components/CartProvider";
import { useWishlist } from "@/components/WishlistProvider";
import { trackEvent } from "@/lib/analytics";
import { assetUrl } from "@/lib/assets";
import { getColorSwatch } from "@/lib/colorSwatches";
import { getProductImageOverride } from "@/lib/productImageOverrides";
import type { CollectionCard, ProductColor } from "@/lib/api";

type Props = {
  collection: CollectionCard;
  initialColorId?: string;
};

type ProductGroup = {
  id: string;
  title: string;
  description: string;
  optionLabel: string;
  options: ProductColor[];
};

function getDefaultColor(colors: ProductColor[]) {
  return colors[0] ?? null;
}

function isPanelCollection(collectionId: string) {
  return collectionId === "classic" || collectionId === "avangard" || collectionId === "samples";
}

function getDisplayColorName(color: ProductColor) {
  return color.name.replace(/^ARTDECO\s+/i, "");
}

function getOptionLabel(collectionId: string, color: ProductColor) {
  if (collectionId === "components") {
    return color.name.replace(/^Торцевая планка\s+/i, "");
  }

  if (collectionId === "accessories") {
    const cleaned = color.name.replace(/^ARTDECO\s+/i, "");

    if (color.id.startsWith("ad-h")) {
      return cleaned
        .replace(/^Вешалка с крючком 190\s+/i, "")
        .replace(/^Вешалка с крючком 270\s+/i, "")
        .replace(/^Вешалка\s+/i, "");
    }

    if (color.id.startsWith("ad-l")) {
      return cleaned
        .replace(/^Комплект подсветки x2\s+/i, "x2 ")
        .replace(/^Комплект подсветки\s+/i, "");
    }

    return color.size ?? cleaned;
  }

  return color.name;
}

function buildAccessoryGroups(colors: ProductColor[]): ProductGroup[] {
  const groups: ProductGroup[] = [];

  const addGroup = (id: string, title: string, description: string, optionLabel: string, matcher: (color: ProductColor) => boolean) => {
    const options = colors.filter(matcher);
    if (options.length) {
      groups.push({ id, title, description, optionLabel, options });
    }
  };

  addGroup("hanger-80", "Вешалка 80 мм", "Компактная настенная вешалка для прихожей и локальных акцентов.", "Цвет", (color) =>
    color.id.startsWith("ad-h80-"),
  );
  addGroup("hanger-190", "Вешалка с крючком 190 мм", "Вертикальная модель для одежды, сумок и аксессуаров.", "Цвет", (color) =>
    color.id.startsWith("ad-h190-"),
  );
  addGroup("hanger-270", "Вешалка с крючком 270 мм", "Удлиненный формат для более выразительной композиции.", "Цвет", (color) =>
    color.id.startsWith("ad-h270-"),
  );
  addGroup("shelf-narrow", "Полка узкая", "Настенные полки для декора и повседневных мелочей.", "Размер", (color) =>
    color.id.startsWith("ad-sh"),
  );
  addGroup("shelf-wide", "Полка широкая", "Широкие полки для выразительных интерьерных композиций.", "Размер", (color) =>
    color.id.startsWith("ad-sw"),
  );
  addGroup("lights", "Комплекты подсветки", "Варианты профиля для теплой интерьерной подсветки.", "Вариант", (color) =>
    color.id.startsWith("ad-l"),
  );

  return groups;
}

function buildComponentGroups(colors: ProductColor[]): ProductGroup[] {
  const groups: ProductGroup[] = [];

  const plankOptions = colors.filter((color) => color.id.startsWith("ac-") && /^ac-\d+$/.test(color.id));
  if (plankOptions.length) {
    groups.push({
      id: "end-plank",
      title: "Торцевая планка",
      description: "Подберите декор планки под цвет основной панели.",
      optionLabel: "Декор",
      options: plankOptions,
    });
  }

  const singles = [
    { id: "ac-mat", title: "Акустический мат", description: "Дополнительный слой для усиления звукопоглощения." },
    { id: "ac-ring", title: "Компенсационное кольцо d60", description: "Аксессуар для аккуратного монтажа вокруг выводов." },
    { id: "ac-screw", title: "Саморезы 4,2×32 мм", description: "Крепеж для надежной фиксации элементов." },
    { id: "ac-glue", title: "Клей монтажный 280 мл", description: "Быстрый способ монтажа на подготовленную поверхность." },
  ];

  singles.forEach((single) => {
    const option = colors.find((color) => color.id === single.id);
    if (option) {
      groups.push({
        id: single.id,
        title: single.title,
        description: single.description,
        optionLabel: "Вариант",
        options: [option],
      });
    }
  });

  return groups;
}

function getProductGroups(collection: CollectionCard): ProductGroup[] {
  if (collection.id === "components") {
    return buildComponentGroups(collection.colors);
  }

  if (collection.id === "accessories") {
    return buildAccessoryGroups(collection.colors);
  }

  return [];
}

function buildWishlistPayload(collection: CollectionCard, color: ProductColor) {
  return {
    collectionId: collection.id,
    productId: color.id,
    name: `${collection.name} · ${color.name}`,
    image: color.image,
    art: color.art,
    size: color.size,
    price: color.price,
    felt: color.felt,
  };
}

function addColorToCart(addItem: ReturnType<typeof useCart>["addItem"], collection: CollectionCard, color: ProductColor) {
  return addItem({
    collectionId: collection.id,
    productId: color.id,
    name: `${collection.name} · ${color.name}`,
    image: color.image,
    art: color.art,
    size: color.size,
    price: color.price,
    felt: color.felt,
  });
}

export function CollectionDetailClient({ collection, initialColorId }: Props) {
  const { user } = useAuth();
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const [brokenColorIds, setBrokenColorIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const feltOptions = useMemo(
    () => Array.from(new Set(collection.colors.map((color) => color.felt).filter(Boolean))),
    [collection.colors],
  );

  const [selectedFelt, setSelectedFelt] = useState<string | null>((feltOptions[0] as string | undefined) ?? null);

  const filteredColors = useMemo(() => {
    if (!selectedFelt) return collection.colors;
    return collection.colors.filter((color) => color.felt === selectedFelt);
  }, [collection.colors, selectedFelt]);

  const [selectedColorId, setSelectedColorId] = useState<string>(
    initialColorId ?? getDefaultColor(filteredColors)?.id ?? collection.colors[0]?.id ?? "",
  );

  const productGroups = useMemo(() => getProductGroups(collection), [collection]);
  const [groupSelections, setGroupSelections] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!initialColorId) {
      return;
    }

    const matchingColor = collection.colors.find((color) => color.id === initialColorId);
    if (matchingColor?.felt) {
      setSelectedFelt(matchingColor.felt);
    }
    setSelectedColorId(initialColorId);
  }, [collection.colors, initialColorId]);

  useEffect(() => {
    const firstColor = getDefaultColor(filteredColors);
    if (!firstColor) return;

    const stillExists = filteredColors.some((color) => color.id === selectedColorId);
    if (!stillExists) {
      setSelectedColorId(firstColor.id);
    }
  }, [filteredColors, selectedColorId]);

  useEffect(() => {
    if (!productGroups.length) {
      return;
    }

    setGroupSelections((current) => {
      const next = { ...current };
      productGroups.forEach((group) => {
        if (!next[group.id]) {
          next[group.id] = group.options[0]?.id ?? "";
        }
      });
      return next;
    });
  }, [productGroups]);

  const selectedColor =
    filteredColors.find((color) => color.id === selectedColorId) ??
    getDefaultColor(filteredColors) ??
    collection.colors[0];

  function getColorImage(color: ProductColor) {
    const preferredImage = getProductImageOverride(color.id, color.image || collection.preview_image);
    if (brokenColorIds.includes(color.id)) {
      return assetUrl(collection.preview_image);
    }
    return assetUrl(preferredImage);
  }

  function markImageBroken(colorId: string) {
    setBrokenColorIds((current) => (current.includes(colorId) ? current : [...current, colorId]));
  }

  async function handleAddToCart(color: ProductColor | undefined = selectedColor) {
    if (!color) {
      setFeedback("Сначала выберите вариант.");
      return;
    }

    const result = await addColorToCart(addItem, collection, color);
    if (result?.ok) {
      await trackEvent("add_to_cart", {
        collection_id: collection.id,
        collection_name: collection.name,
        product_id: color.id,
        product_name: color.name,
        felt: color.felt ?? null,
        art: color.art ?? null,
      });
    }
    setFeedback("Позиция добавлена в корзину.");
  }

  async function handleToggleWishlist(color: ProductColor | undefined = selectedColor) {
    if (!color) {
      setFeedback("Сначала выберите вариант.");
      return;
    }

    const wasInWishlist = isInWishlist(color.id);
    await toggleItem(buildWishlistPayload(collection, color));
    await trackEvent(wasInWishlist ? "remove_from_wishlist" : "add_to_wishlist", {
      collection_id: collection.id,
      collection_name: collection.name,
      product_id: color.id,
      product_name: color.name,
      felt: color.felt ?? null,
      art: color.art ?? null,
    });
    setFeedback(wasInWishlist ? "Позиция удалена из избранного." : "Позиция добавлена в избранное.");
  }

  if (isPanelCollection(collection.id)) {
    return (
      <>
        <section className="showcase-shell">
          <div className="showcase-stage">
            {selectedColor ? (
              <img
                className="showcase-main-image"
                src={getColorImage(selectedColor)}
                alt={selectedColor.name}
                onError={() => markImageBroken(selectedColor.id)}
              />
            ) : (
              <img className="showcase-main-image" src={assetUrl(collection.preview_image)} alt={collection.name} />
            )}
          </div>

          <aside className="showcase-sidebar">
            <div className="eyebrow">Коллекция</div>
            <h1 className="showcase-title">{collection.name}</h1>
            <p className="showcase-description">{collection.description}</p>

            <div className="showcase-price">
              {selectedColor?.price ? `${selectedColor.price.toLocaleString("ru-RU")} ₽` : "По запросу"}
            </div>

            <div className="showcase-meta">
              <div>
                <span>Артикул</span>
                <strong>{selectedColor?.art ?? "—"}</strong>
              </div>
              <div>
                <span>Размер</span>
                <strong>{selectedColor?.size ?? "—"}</strong>
              </div>
              {selectedColor?.felt ? (
                <div>
                  <span>Основа</span>
                  <strong>{selectedColor.felt}</strong>
                </div>
              ) : null}
            </div>

            {feltOptions.length > 0 ? (
              <div className="showcase-felt">
                {feltOptions.map((felt) => (
                  <button
                    key={felt}
                    type="button"
                    className={`felt-switch ${felt === selectedFelt ? "active" : ""}`}
                    onClick={() => setSelectedFelt(felt ?? null)}
                  >
                    {felt === "черный" ? "Черный фетр" : felt === "серый" ? "Серый фетр" : felt}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="swatch-picker">
              <div className="swatch-picker-head">
                <div>
                  <p className="detail-block-title">Выбор цвета</p>
                  <strong>{selectedColor?.name}</strong>
                </div>
                <button type="button" className="btn" onClick={() => setDrawerOpen(true)}>
                  Все варианты
                </button>
              </div>

              <div className="swatch-circle-row">
                {filteredColors.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    className={`swatch-circle ${color.id === selectedColor?.id ? "active" : ""}`}
                    style={{ backgroundColor: getColorSwatch(getDisplayColorName(color)) }}
                    onClick={() => setSelectedColorId(color.id)}
                    aria-label={color.name}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="showcase-actions">
              <button className="btn btn-primary" type="button" onClick={() => handleAddToCart()}>
                В корзину
              </button>
              <button
                className={`btn ${selectedColor && isInWishlist(selectedColor.id) ? "btn-primary" : ""}`}
                type="button"
                onClick={() => handleToggleWishlist()}
              >
                {selectedColor && isInWishlist(selectedColor.id) ? "В избранном" : "В избранное"}
              </button>
            </div>

            {!user ? <div className="inline-note">После входа можно быстро оформить заказ из корзины.</div> : null}
            {feedback ? <div className="order-feedback success">{feedback}</div> : null}
          </aside>
        </section>

        <div className={`swatch-drawer ${drawerOpen ? "open" : ""}`}>
          <button type="button" className="swatch-drawer-backdrop" onClick={() => setDrawerOpen(false)} aria-label="Закрыть панель" />
          <div className="swatch-drawer-panel">
            <div className="swatch-drawer-head">
              <div>
                <div className="eyebrow">Все оттенки</div>
                <h2 className="collection-name">{collection.name}</h2>
              </div>
              <button type="button" className="btn" onClick={() => setDrawerOpen(false)}>
                Закрыть
              </button>
            </div>

            <div className="swatch-drawer-list">
              {filteredColors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  className={`swatch-drawer-item ${color.id === selectedColor?.id ? "active" : ""}`}
                  onClick={() => {
                    setSelectedColorId(color.id);
                    setDrawerOpen(false);
                  }}
                >
                  <img src={getColorImage(color)} alt={color.name} onError={() => markImageBroken(color.id)} />
                  <div>
                    <strong>{color.name}</strong>
                    <span>{color.art ?? "Без артикула"}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <section className="stacked-products">
      <div className="stacked-products-hero">
        <div>
          <div className="eyebrow">Каталог</div>
          <h1 className="section-title">{collection.name}</h1>
        </div>
        <p className="section-subtitle">{collection.description}</p>
      </div>

      <div className="stacked-products-list">
        {productGroups.map((group) => {
          const selectedOption =
            group.options.find((option) => option.id === groupSelections[group.id]) ??
            group.options[0];

          return (
            <article key={group.id} className="stacked-product-card">
              <div className="stacked-product-media">
                <img
                  src={getColorImage(selectedOption)}
                  alt={selectedOption.name}
                  onError={() => markImageBroken(selectedOption.id)}
                />
              </div>

              <div className="stacked-product-content">
                <div className="detail-block-title">{group.optionLabel}</div>
                <h2 className="collection-name">{group.title}</h2>
                <p className="collection-description">{group.description}</p>

                <div className="stacked-product-price">
                  {selectedOption.price ? `${selectedOption.price.toLocaleString("ru-RU")} ₽` : "По запросу"}
                </div>

                <div className="stacked-product-meta">
                  <span>Артикул: {selectedOption.art ?? "—"}</span>
                  <span>Размер: {selectedOption.size ?? "—"}</span>
                </div>

                <div className="stacked-product-options">
                  {group.options.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={`stacked-option ${selectedOption.id === option.id ? "active" : ""}`}
                      onClick={() =>
                        setGroupSelections((current) => ({
                          ...current,
                          [group.id]: option.id,
                        }))
                      }
                    >
                      {getOptionLabel(collection.id, option)}
                    </button>
                  ))}
                </div>

                <div className="stacked-product-actions">
                  <button className="btn btn-primary" type="button" onClick={() => handleAddToCart(selectedOption)}>
                    В корзину
                  </button>
                  <button
                    className={`btn ${isInWishlist(selectedOption.id) ? "btn-primary" : ""}`}
                    type="button"
                    onClick={() => handleToggleWishlist(selectedOption)}
                  >
                    {isInWishlist(selectedOption.id) ? "В избранном" : "В избранное"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {feedback ? <div className="order-feedback success">{feedback}</div> : null}
    </section>
  );
}
