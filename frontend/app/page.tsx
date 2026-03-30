"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { assetUrl } from "@/lib/assets";
import { getSiteSettings, type SiteSettings } from "@/lib/api";

const heroImage = assetUrl("/legacy/img/interier_hero.png");

const catalogPrimary = [
  {
    id: "classic",
    title: "Акустическая панель Classic",
    image: assetUrl("/legacy/home/catalog-classic-card.png"),
  },
  {
    id: "avangard",
    title: "Акустическая панель Avangard",
    image: assetUrl("/legacy/home/catalog-avangard-card.png"),
  },
];

const catalogSecondary = [
  {
    id: "samples",
    title: "Образцы",
    image: assetUrl("/legacy/home/catalog-samples-card.png"),
    href: "/catalog/samples",
  },
  {
    id: "components",
    title: "Комплектующие",
    image: assetUrl("/legacy/img/komplect_block.png"),
    href: "/catalog/components",
  },
  {
    id: "accessories",
    title: "Аксессуары",
    image: assetUrl("/legacy/home/catalog-accessories-card.png"),
    href: "/catalog/accessories",
  },
];

const installSteps = [
  {
    number: "01",
    title: "Подготовка",
    text: "Убедитесь, что стена ровная, сухая и чистая. При необходимости выровняйте поверхность шпаклевкой.",
  },
  {
    number: "02",
    title: "Разметка",
    text: "С помощью уровня нанесите горизонтальные линии разметки под направляющие рейки.",
  },
  {
    number: "03",
    title: "Крепление реек",
    text: "Закрепите направляющие рейки на стену дюбелями или монтажным клеем согласно инструкции.",
  },
  {
    number: "04",
    title: "Установка панелей",
    text: "Вставьте панели в пазы реек последовательно, начиная от угла или центра стены.",
  },
];

const ideas = [
  assetUrl("/legacy/img/idei1_main.jpeg"),
  assetUrl("/legacy/img/idei3_main.jpeg"),
  assetUrl("/legacy/img/idei4_main.png"),
  assetUrl("/legacy/img/idei2_main.png"),
];

export default function HomePage() {
  const [cmsContent, setCmsContent] = useState<SiteSettings | null>(null);

  useEffect(() => {
    getSiteSettings()
      .then(setCmsContent)
      .catch(() => {
        setCmsContent({
          hero_eyebrow: "Wood App - акустика и дизайн",
          hero_title: "Акустические панели",
          hero_button_label: "Смотреть каталог",
          about_eyebrow: "About Us",
          about_title: "Привет! Мы рады приветствовать вас.",
          about_text_primary: "Мы создаем акустические панели для пространств, где важны не только форма и свет, но и звук.",
          about_text_secondary: "Наши решения объединяют технологию и дизайн, чтобы интерьер работал на ощущение спокойствия, глубины и комфорта.",
          about_quote: "Мы работаем с теми, кто понимает: правильно созданное пространство - это не только красота. Тишина тоже роскошь.",
          bitrix_webhook_url: "",
          bitrix_pipeline_id: "0",
          bitrix_responsible_id: "1",
          bitrix_sync_orders: true,
          bitrix_sync_contacts: true,
          metrika_counter_id: "",
          metrika_enabled: false,
        });
      });
  }, []);

  if (!cmsContent) {
    return null;
  }

  return (
    <main>
      <section className="home-hero">
        <img src={heroImage} alt="Акустические панели Wood App" className="home-hero-image" />
        <div className="home-hero-overlay">
          <div className="eyebrow hero-eyebrow">{cmsContent.hero_eyebrow}</div>
          <h1 className="home-hero-title">{cmsContent.hero_title}</h1>
          <Link href="/catalog" className="hero-outline-button">
            {cmsContent.hero_button_label}
          </Link>
        </div>
      </section>

      <section className="home-section container" id="catalog">
        <div className="section-head">
          <div className="eyebrow">Продукция</div>
          <h2 className="home-section-title">Каталог</h2>
        </div>

        <div className="home-catalog-grid">
          {catalogPrimary.map((item) => (
            <Link key={item.id} href={`/catalog/${item.id}`} className="catalog-tile catalog-tile-large">
              <img src={item.image} alt={item.title} />
              <span>{item.title}</span>
            </Link>
          ))}
        </div>

        <div className="home-catalog-grid home-catalog-grid-small">
          {catalogSecondary.map((item) => (
            <Link key={item.id} href={item.href} className="catalog-tile catalog-tile-small">
              <img src={item.image} alt={item.title} />
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="about-band">
        <div className="about-copy container">
          <div className="about-card">
            <div className="eyebrow accent-text">{cmsContent.about_eyebrow}</div>
            <h2 className="about-title">{cmsContent.about_title}</h2>
            <p>{cmsContent.about_text_primary}</p>
            <p>{cmsContent.about_text_secondary}</p>
          </div>
          <div className="about-image-wrap">
            <img src={assetUrl("/legacy/home/about-right.png")} alt="Интерьер Wood App" />
          </div>
        </div>
        <div className="about-quote">{cmsContent.about_quote}</div>
      </section>

      <section className="home-section container" id="install">
        <div className="section-head">
          <div className="eyebrow">Монтаж</div>
          <h2 className="home-section-title">Установка</h2>
        </div>
        <div className="install-grid">
          {installSteps.map((step) => (
            <article key={step.number} className="install-card">
              <strong>{step.number}</strong>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
        <div className="install-note">
          Монтаж не требует специальных инструментов и занимает 1-2 часа. Подробная инструкция прилагается к каждому заказу.
        </div>
      </section>

      <section className="delivery-band" id="delivery">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Логистика</div>
            <h2 className="home-section-title">Доставка и оплата</h2>
          </div>
          <div className="delivery-grid">
            <article className="delivery-card">
              <h3>Транспортные компании</h3>
              <p>Доставляем по всей России через СДЭК и Деловые Линии. Москва и МО - 1-2 дня, регионы - 3-7 дней.</p>
            </article>
            <article className="delivery-card">
              <h3>Самовывоз</h3>
              <p>Можно забрать заказ со склада в Москве или заранее согласовать собственный транспорт.</p>
            </article>
            <article className="delivery-card">
              <h3>Способы оплаты</h3>
              <div className="pay-tags">
                <span>Visa / Mastercard</span>
                <span>Мир</span>
                <span>СБП</span>
                <span>ЮMoney</span>
                <span>Mir Pay</span>
              </div>
              <p>Оплата банковской картой через защищенный шлюз.</p>
            </article>
            <article className="delivery-card">
              <h3>Как оплатить</h3>
              <ol>
                <li>Оформите заказ в корзине</li>
                <li>Выберите способ оплаты</li>
                <li>Подтвердите данные на защищенной странице</li>
              </ol>
            </article>
          </div>
        </div>
      </section>

      <section className="home-section container">
        <div className="section-head">
          <div className="eyebrow">Проекты</div>
          <h2 className="home-section-title">Готовые идеи</h2>
        </div>
        <div className="ideas-grid">
          {ideas.map((image, index) => (
            <div key={image} className="idea-tile">
              <img src={image} alt={`Интерьер ${index + 1}`} />
            </div>
          ))}
        </div>
        <div className="center-actions">
          <Link href="/catalog" className="btn">
            Смотреть все
          </Link>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container site-footer-inner">
          <strong>Wood App</strong>
          <div>
            <span>Политика конфиденциальности</span>
            <span>Договор оферты</span>
            <span>+7 (495) 763-77-55</span>
            <span>support@woodapp.ru</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
