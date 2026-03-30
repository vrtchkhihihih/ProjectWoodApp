"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/components/AuthProvider";
import {
  createProductItem,
  deleteProductItem,
  getCollections,
  getSiteSettings,
  listAnalyticsEvents,
  listContactRequests,
  listCrmSyncLog,
  listOrders,
  listUsers,
  updateProductItem,
  updateSiteSettings,
  type AnalyticsEventRead,
  type CollectionCard,
  type ContactRequestRead,
  type CrmSyncLogItem,
  type OrderRead,
  type SessionUser,
  type SiteSettings,
} from "@/lib/api";

type AdminTab = "overview" | "cms" | "catalog" | "metrika" | "bitrix";

type ProductFormState = {
  collection_id: string;
  name: string;
  image: string;
  felt: string;
  art: string;
  size: string;
  price: string;
  is_new: boolean;
};

const adminTabs: Array<{ id: AdminTab; label: string; caption: string }> = [
  { id: "overview", label: "Обзор", caption: "Показатели и активность" },
  { id: "cms", label: "CMS", caption: "Контент главной страницы" },
  { id: "catalog", label: "Товары", caption: "Добавление и редактирование" },
  { id: "metrika", label: "Яндекс.Метрика", caption: "Аналитика и события" },
  { id: "bitrix", label: "Bitrix24", caption: "CRM и синхронизация" },
];

const emptyProductForm: ProductFormState = {
  collection_id: "classic",
  name: "",
  image: "",
  felt: "",
  art: "",
  size: "",
  price: "",
  is_new: false,
};

function formatDate(value?: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("ru-RU");
}

function getMetrikaUrl(counterId?: string | null) {
  if (!counterId) {
    return null;
  }

  return `https://metrika.yandex.ru/dashboard?id=${counterId}`;
}

function getBitrixUrl(webhookUrl?: string | null) {
  if (!webhookUrl) {
    return null;
  }

  try {
    const url = new URL(webhookUrl);
    return `${url.protocol}//${url.host}`;
  } catch {
    return webhookUrl;
  }
}

export function AdminPageClient() {
  const { user, hydrated } = useAuth();

  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [orders, setOrders] = useState<OrderRead[]>([]);
  const [users, setUsers] = useState<SessionUser[]>([]);
  const [contactRequests, setContactRequests] = useState<ContactRequestRead[]>([]);
  const [collections, setCollections] = useState<CollectionCard[]>([]);
  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEventRead[]>([]);
  const [crmLog, setCrmLog] = useState<CrmSyncLogItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [productForm, setProductForm] = useState<ProductFormState>(emptyProductForm);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function loadData() {
    try {
      const [usersData, ordersData, contactsData, collectionsData, settingsData, analyticsData, crmData] = await Promise.all([
        listUsers(),
        listOrders(),
        listContactRequests(),
        getCollections(),
        getSiteSettings(),
        listAnalyticsEvents(),
        listCrmSyncLog(),
      ]);

      setUsers(usersData);
      setOrders(ordersData);
      setContactRequests(contactsData);
      setCollections(collectionsData);
      setSettings(settingsData);
      setAnalyticsEvents(analyticsData);
      setCrmLog(crmData);

      if (!editingProductId && collectionsData[0]) {
        setProductForm((current) => ({
          ...current,
          collection_id: current.collection_id || collectionsData[0].id,
        }));
      }
    } catch {
      setFeedback("Не удалось загрузить данные админ-панели. Проверьте backend.");
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const revenue = useMemo(() => orders.reduce((sum, order) => sum + order.total_amount, 0), [orders]);
  const crmSuccessCount = useMemo(() => crmLog.filter((item) => item.status === "success").length, [crmLog]);
  const crmErrorCount = useMemo(() => crmLog.filter((item) => item.status !== "success").length, [crmLog]);
  const latestCrmEntry = crmLog[0] ?? null;
  const metrikaEventCount = analyticsEvents.length;
  const metrikaUrl = getMetrikaUrl(settings?.metrika_counter_id);
  const bitrixUrl = getBitrixUrl(settings?.bitrix_webhook_url);
  const topMetrikaEvents = useMemo(() => {
    const grouped = new Map<string, number>();
    analyticsEvents.forEach((event) => {
      grouped.set(event.event_type, (grouped.get(event.event_type) ?? 0) + 1);
    });

    return Array.from(grouped.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [analyticsEvents]);

  if (!hydrated) {
    return <section className="detail-panel">Загрузка админ-панели...</section>;
  }

  if (!user || user.role !== "admin") {
    return (
      <section className="detail-panel account-empty">
        <h1 className="section-title">Доступ ограничен</h1>
        <p className="section-subtitle">Эта страница доступна только администратору.</p>
        <Link href="/login?next=/admin" className="btn btn-primary">
          Войти как администратор
        </Link>
      </section>
    );
  }

  function startEditProduct(collectionId: string, product: CollectionCard["colors"][number]) {
    setEditingProductId(product.id);
    setProductForm({
      collection_id: collectionId,
      name: product.name,
      image: product.image,
      felt: product.felt ?? "",
      art: product.art ?? "",
      size: product.size ?? "",
      price: product.price ? String(product.price) : "",
      is_new: Boolean(product.is_new),
    });
    setActiveTab("catalog");
  }

  async function handleSaveSettings() {
    if (!settings) {
      return;
    }

    try {
      const updated = await updateSiteSettings(settings);
      setSettings(updated);
      setFeedback("Настройки сохранены.");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Не удалось сохранить настройки.");
    }
  }

  async function handleSaveProduct() {
    try {
      const payload = {
        collection_id: productForm.collection_id,
        name: productForm.name,
        image: productForm.image,
        felt: productForm.felt || undefined,
        art: productForm.art || undefined,
        size: productForm.size || undefined,
        price: productForm.price ? Number(productForm.price) : null,
        is_new: productForm.is_new,
      };

      if (editingProductId) {
        await updateProductItem(editingProductId, payload);
        setFeedback("Товар обновлен.");
      } else {
        await createProductItem(payload);
        setFeedback("Товар добавлен в выбранную категорию.");
      }

      setEditingProductId(null);
      setProductForm(emptyProductForm);
      await loadData();
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Не удалось сохранить товар.");
    }
  }

  async function handleDeleteProduct(productId: string) {
    try {
      await deleteProductItem(productId);
      setFeedback("Товар удален.");
      await loadData();
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Не удалось удалить товар.");
    }
  }

  return (
    <section className="admin-layout">
      <div className="admin-header admin-hero detail-panel">
        <div className="admin-hero-copy">
          <div className="eyebrow">Панель управления</div>
          <h1 className="section-title">Админ-кабинет Wood App</h1>
          <p className="section-subtitle">
            Управление контентом, каталогом, заказами, аналитикой и CRM-синхронизацией в едином интерфейсе.
          </p>
        </div>
        <div className="admin-hero-badge">
          <strong>CMS + CRM + Analytics</strong>
          <span>Единый центр управления сайтом и внешними интеграциями.</span>
        </div>
      </div>

      <div className="admin-tabs" role="tablist" aria-label="Разделы админки">
        {adminTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`admin-tab ${activeTab === tab.id ? "is-active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <strong>{tab.label}</strong>
            <span>{tab.caption}</span>
          </button>
        ))}
      </div>

      {activeTab === "overview" ? (
        <>
          <div className="admin-kpi-grid">
            <article className="detail-panel admin-kpi-card admin-kpi-card-accent">
              <span>Пользователи</span>
              <strong>{users.length}</strong>
              <p>Зарегистрированы в базе данных</p>
            </article>
            <article className="detail-panel admin-kpi-card">
              <span>Заказы</span>
              <strong>{orders.length}</strong>
              <p>Оформлены через корзину</p>
            </article>
            <article className="detail-panel admin-kpi-card">
              <span>Обращения</span>
              <strong>{contactRequests.length}</strong>
              <p>Заявки с формы контактов</p>
            </article>
            <article className="detail-panel admin-kpi-card">
              <span>Выручка</span>
              <strong>{revenue.toLocaleString("ru-RU")} ₽</strong>
              <p>Сумма оформленных заказов</p>
            </article>
          </div>

          <div className="admin-grid">
            <article className="detail-panel admin-card">
              <div className="detail-block-title">Последние заказы</div>
              <div className="admin-table">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="admin-table-row">
                    <div>
                      <strong>{order.order_number}</strong>
                      <span>{order.customer_name}</span>
                    </div>
                    <div>
                      <strong>{order.total_amount.toLocaleString("ru-RU")} ₽</strong>
                      <span>{order.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="detail-panel admin-card">
              <div className="detail-block-title">Последние обращения</div>
              <div className="admin-table">
                {contactRequests.slice(0, 5).map((request) => (
                  <div key={request.id} className="admin-table-row">
                    <div>
                      <strong>{request.customer_name}</strong>
                      <span>{request.phone}</span>
                    </div>
                    <div>
                      <strong>{request.subject || "Без темы"}</strong>
                      <span>{request.email || "Без email"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </>
      ) : null}

      {activeTab === "cms" && settings ? (
        <div className="admin-single-column">
          <article className="detail-panel admin-card">
            <div className="detail-block-title">CMS: контент главной страницы</div>
            <div className="admin-settings-grid">
              <input className="order-input admin-span-2" value={settings.hero_eyebrow} onChange={(e) => setSettings({ ...settings, hero_eyebrow: e.target.value })} />
              <input className="order-input admin-span-2" value={settings.hero_title} onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })} />
              <input className="order-input admin-span-2" value={settings.hero_button_label} onChange={(e) => setSettings({ ...settings, hero_button_label: e.target.value })} />
              <input className="order-input admin-span-2" value={settings.about_eyebrow} onChange={(e) => setSettings({ ...settings, about_eyebrow: e.target.value })} />
              <input className="order-input admin-span-2" value={settings.about_title} onChange={(e) => setSettings({ ...settings, about_title: e.target.value })} />
              <textarea className="order-input admin-textarea admin-span-2" value={settings.about_text_primary} onChange={(e) => setSettings({ ...settings, about_text_primary: e.target.value })} />
              <textarea className="order-input admin-textarea admin-span-2" value={settings.about_text_secondary} onChange={(e) => setSettings({ ...settings, about_text_secondary: e.target.value })} />
              <textarea className="order-input admin-textarea admin-span-2" value={settings.about_quote} onChange={(e) => setSettings({ ...settings, about_quote: e.target.value })} />
            </div>
          </article>
        </div>
      ) : null}

      {activeTab === "catalog" ? (
        <div className="admin-single-column">
          <article className="detail-panel admin-card">
            <div className="detail-block-title">{editingProductId ? "Редактирование товара" : "Добавление товара"}</div>
            <div className="admin-settings-grid">
              <select
                className="order-input admin-span-2"
                value={productForm.collection_id}
                onChange={(e) => setProductForm({ ...productForm, collection_id: e.target.value })}
              >
                {collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name}
                  </option>
                ))}
              </select>
              <input className="order-input admin-span-2" placeholder="Название товара" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
              <input className="order-input admin-span-2" placeholder="Путь к изображению" value={productForm.image} onChange={(e) => setProductForm({ ...productForm, image: e.target.value })} />
              <input className="order-input" placeholder="Фетр" value={productForm.felt} onChange={(e) => setProductForm({ ...productForm, felt: e.target.value })} />
              <input className="order-input" placeholder="Артикул" value={productForm.art} onChange={(e) => setProductForm({ ...productForm, art: e.target.value })} />
              <input className="order-input" placeholder="Размер" value={productForm.size} onChange={(e) => setProductForm({ ...productForm, size: e.target.value })} />
              <input className="order-input" placeholder="Цена" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
              <label className="admin-toggle admin-span-2">
                <input type="checkbox" checked={productForm.is_new} onChange={(e) => setProductForm({ ...productForm, is_new: e.target.checked })} />
                <span>Отметить товар как новинку</span>
              </label>
            </div>
            <div className="actions">
              <button type="button" className="btn btn-primary" onClick={() => void handleSaveProduct()}>
                {editingProductId ? "Сохранить товар" : "Добавить товар"}
              </button>
              {editingProductId ? (
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setEditingProductId(null);
                    setProductForm(emptyProductForm);
                  }}
                >
                  Отменить редактирование
                </button>
              ) : null}
            </div>
          </article>

          <article className="detail-panel admin-card">
            <div className="detail-block-title">Товары по категориям</div>
            <div className="admin-stack">
              {collections.map((collection) => (
                <div key={collection.id}>
                  <div className="eyebrow">{collection.name}</div>
                  <div className="admin-table">
                    {collection.colors.map((color) => (
                      <div key={color.id} className="admin-table-row">
                        <div>
                          <strong>{color.name}</strong>
                          <span>{color.art || "Без артикула"}</span>
                        </div>
                        <div className="actions">
                          <button type="button" className="btn" onClick={() => startEditProduct(collection.id, color)}>
                            Редактировать
                          </button>
                          <button type="button" className="btn" onClick={() => void handleDeleteProduct(color.id)}>
                            Удалить
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      ) : null}

      {activeTab === "metrika" && settings ? (
        <div className="admin-single-column">
          <article className="detail-panel admin-card">
            <div className="detail-block-title">Яндекс.Метрика</div>
            <div className="admin-integration-hero">
              <div className="admin-integration-copy">
                <strong>Аналитика сайта и ключевые пользовательские события</strong>
                <span>
                  Во вкладке отображаются статус подключения счетчика, накопленные события и быстрый переход в кабинет
                  Яндекс.Метрики для просмотра тепловых карт, вебвизора и карты кликов.
                </span>
              </div>
              <div className="admin-link-row">
                <a
                  className={`btn ${metrikaUrl ? "btn-primary" : ""}`}
                  href={metrikaUrl ?? "#"}
                  target={metrikaUrl ? "_blank" : undefined}
                  rel={metrikaUrl ? "noreferrer" : undefined}
                  aria-disabled={!metrikaUrl}
                >
                  Открыть Яндекс.Метрику
                </a>
              </div>
            </div>

            <div className="admin-kpi-grid admin-kpi-grid-compact admin-integration-kpis">
              <article className="detail-panel admin-kpi-card admin-kpi-card-accent">
                <span>Статус счетчика</span>
                <strong>{settings.metrika_enabled && settings.metrika_counter_id ? "Активен" : "Выключен"}</strong>
                <p>{settings.metrika_counter_id ? `ID: ${settings.metrika_counter_id}` : "ID счетчика пока не задан"}</p>
              </article>
              <article className="detail-panel admin-kpi-card">
                <span>События в базе</span>
                <strong>{metrikaEventCount}</strong>
                <p>Зафиксированы внутренним аналитическим модулем</p>
              </article>
              <article className="detail-panel admin-kpi-card">
                <span>Последнее событие</span>
                <strong>{analyticsEvents[0]?.event_type ?? "—"}</strong>
                <p>{analyticsEvents[0] ? formatDate(analyticsEvents[0].created_at) : "События пока не поступали"}</p>
              </article>
            </div>

            <div className="admin-settings-grid admin-integration-settings">
              <input
                className="order-input admin-span-2"
                placeholder="ID счетчика"
                value={settings.metrika_counter_id}
                onChange={(e) => setSettings({ ...settings, metrika_counter_id: e.target.value })}
              />
              <label className="admin-toggle admin-span-2">
                <input type="checkbox" checked={settings.metrika_enabled} onChange={(e) => setSettings({ ...settings, metrika_enabled: e.target.checked })} />
                <span>Включить подключение счетчика на сайте</span>
              </label>
            </div>

            <div className="admin-note admin-note-soft">
              <strong>Как интеграция выглядит в системе</strong>
              <span>
                В админке отображаются статус подключения счетчика, список сохраненных событий и основные пользовательские
                цели. Тепловая карта, карта кликов и вебвизор доступны внутри интерфейса Яндекс.Метрики после авторизации
                в сервисе и не встраиваются в сайт как отдельный публичный виджет.
              </span>
            </div>

            <div className="admin-table admin-table-card">
              {topMetrikaEvents.map(([eventName, count]) => (
                <div key={eventName} className="admin-table-row">
                  <div>
                    <strong>{eventName}</strong>
                    <span>Цель / событие</span>
                  </div>
                  <div>
                    <strong>{count}</strong>
                    <span>срабатываний</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="admin-table admin-table-card">
              {analyticsEvents.slice(0, 10).map((event) => (
                <div key={event.id} className="admin-table-row">
                  <div>
                    <strong>{event.event_type}</strong>
                    <span>{event.page_url || "Без URL"}</span>
                  </div>
                  <div>
                    <strong>{formatDate(event.created_at)}</strong>
                    <span>ID: {event.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      ) : null}

      {activeTab === "bitrix" && settings ? (
        <div className="admin-single-column">
          <article className="detail-panel admin-card">
            <div className="detail-block-title">Bitrix24</div>
            <div className="admin-integration-hero admin-integration-hero-crm">
              <div className="admin-integration-copy">
                <strong>CRM-синхронизация заказов и заявок</strong>
                <span>
                  Во вкладке показаны состояние webhook, последние обмены и журнал синхронизации. Отсюда можно быстро
                  перейти в портал Bitrix24 для проверки сделок и лидов.
                </span>
              </div>
              <div className="admin-link-row">
                <a
                  className={`btn ${bitrixUrl ? "btn-primary" : ""}`}
                  href={bitrixUrl ?? "#"}
                  target={bitrixUrl ? "_blank" : undefined}
                  rel={bitrixUrl ? "noreferrer" : undefined}
                  aria-disabled={!bitrixUrl}
                >
                  Открыть Bitrix24
                </a>
              </div>
            </div>

            <div className="admin-kpi-grid admin-kpi-grid-compact admin-integration-kpis">
              <article className="detail-panel admin-kpi-card admin-kpi-card-accent">
                <span>Webhook</span>
                <strong>{settings.bitrix_webhook_url ? "Подключен" : "Не задан"}</strong>
                <p>{settings.bitrix_webhook_url ? "Сайт может передавать заявки и заказы в CRM" : "Укажите URL входящего webhook"}</p>
              </article>
              <article className="detail-panel admin-kpi-card">
                <span>Успешные синхронизации</span>
                <strong>{crmSuccessCount}</strong>
                <p>Записей со статусом success</p>
              </article>
              <article className="detail-panel admin-kpi-card">
                <span>Ошибки синхронизации</span>
                <strong>{crmErrorCount}</strong>
                <p>Записей со статусом error</p>
              </article>
              <article className="detail-panel admin-kpi-card">
                <span>Последний обмен</span>
                <strong>{latestCrmEntry ? latestCrmEntry.status : "—"}</strong>
                <p>{latestCrmEntry ? formatDate(latestCrmEntry.created_at) : "Журнал еще пуст"}</p>
              </article>
            </div>

            <div className="admin-settings-grid admin-integration-settings">
              <input className="order-input admin-span-2" placeholder="Webhook URL" value={settings.bitrix_webhook_url} onChange={(e) => setSettings({ ...settings, bitrix_webhook_url: e.target.value })} />
              <input className="order-input" placeholder="Pipeline ID" value={settings.bitrix_pipeline_id} onChange={(e) => setSettings({ ...settings, bitrix_pipeline_id: e.target.value })} />
              <input className="order-input" placeholder="Responsible ID" value={settings.bitrix_responsible_id} onChange={(e) => setSettings({ ...settings, bitrix_responsible_id: e.target.value })} />
              <label className="admin-toggle admin-span-2">
                <input type="checkbox" checked={settings.bitrix_sync_orders} onChange={(e) => setSettings({ ...settings, bitrix_sync_orders: e.target.checked })} />
                <span>Синхронизировать заказы в Bitrix24</span>
              </label>
              <label className="admin-toggle admin-span-2">
                <input type="checkbox" checked={settings.bitrix_sync_contacts} onChange={(e) => setSettings({ ...settings, bitrix_sync_contacts: e.target.checked })} />
                <span>Синхронизировать заявки с формы контактов</span>
              </label>
            </div>

            <div className="admin-note admin-note-soft">
              <strong>Как выглядит интеграция</strong>
              <span>
                После отправки формы или оформления заказа сервер автоматически создает запрос к Bitrix24 и сохраняет
                результат синхронизации. Ниже отображаются последние обмены, их статус и ответ CRM.
              </span>
            </div>

            {latestCrmEntry ? (
              <div className="admin-note admin-note-strong">
                <strong>Последний обмен</strong>
                <span>
                  {latestCrmEntry.entity_type} #{latestCrmEntry.entity_id} • {latestCrmEntry.status} • {formatDate(latestCrmEntry.created_at)}
                </span>
              </div>
            ) : null}
          </article>

          <article className="detail-panel admin-card">
            <div className="detail-block-title">Журнал синхронизации CRM</div>
            <div className="admin-table admin-table-card">
              {crmLog.slice(0, 12).map((log) => (
                <div key={log.id} className="admin-table-row">
                  <div>
                    <strong>
                      {log.entity_type} #{log.entity_id}
                    </strong>
                    <span>{log.request_url || "Webhook не задан"}</span>
                  </div>
                  <div>
                    <strong>{log.status}</strong>
                    <span>{log.error_message || log.response_body || formatDate(log.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      ) : null}

      <div className="actions">
        <button type="button" className="btn btn-primary" onClick={() => void handleSaveSettings()}>
          Сохранить настройки
        </button>
      </div>

      {feedback ? <div className="order-feedback success">{feedback}</div> : null}
    </section>
  );
}
