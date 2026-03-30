"use client";

import { FormEvent, useState } from "react";

import { assetUrl } from "@/lib/assets";
import { createContactRequest } from "@/lib/api";
import { trackEvent } from "@/lib/analytics";

type ContactRow = {
  label: string;
  value: string;
  href?: string;
};

type ContactGroup = {
  title: string;
  rows: ContactRow[];
};

const CONTACT_INFO: ContactGroup[] = [
  {
    title: "Телефон и email",
    rows: [
      { label: "Телефон", value: "+7 (495) 763-77-55", href: "tel:+74957637755" },
      { label: "По заказам", value: "support@woodapp.ru", href: "mailto:support@woodapp.ru" },
      { label: "Сотрудничество", value: "cooperation@woodapp.ru", href: "mailto:cooperation@woodapp.ru" },
    ],
  },
  {
    title: "Адреса",
    rows: [
      { label: "Шоурум", value: "г. Мытищи, ул. Коммунистическая, д. 25Г, павильон 3" },
      { label: "Склад и самовывоз", value: "МО, Пушкинский р-н, Правдинский р.п., ул. Фабричная, д. 8" },
    ],
  },
];

const WORK_HOURS = [
  { day: "Пн - Пт", time: "10:00 - 19:00", note: "Шоурум и офис" },
  { day: "Сб - Вс", time: "11:00 - 17:00", note: "Только шоурум" },
  { day: "Онлайн-заказы", time: "Круглосуточно", note: "Обработка в рабочие часы" },
];

export function ContactsPageClient() {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Консультация по подбору");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      await createContactRequest({
        customer_name: customerName,
        phone,
        email: email || undefined,
        subject: subject || undefined,
        comment: comment || undefined,
      });
      await trackEvent("contact_request_sent", { subject });
      setFeedback({ type: "success", text: "Заявка отправлена. Мы свяжемся с вами для консультации." });
      setCustomerName("");
      setPhone("");
      setEmail("");
      setSubject("Консультация по подбору");
      setComment("");
    } catch {
      setFeedback({ type: "error", text: "Не удалось отправить заявку. Проверьте backend." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="contacts-stack">
      <section className="contacts-layout">
        <div className="detail-panel contacts-visual">
          <img
            className="contacts-visual-image"
            src={assetUrl("/legacy/dealers/contacts-showroom.jpg")}
            alt="Интерьер с акустическими панелями Wood App"
          />
          <div className="contacts-visual-copy">
            <p className="detail-block-title">Шоурум и консультация</p>
            <h2 className="collection-name">Поможем подобрать панели под интерьер</h2>
            <p className="collection-description">
              Подскажем по размерам, оттенкам, типам фетра, комплектации и сочетанию панелей с вашим интерьером.
            </p>
          </div>
        </div>

        <div className="detail-panel">
          <form className="order-form" onSubmit={handleSubmit}>
            <p className="detail-block-title">Оставить заявку</p>
            <input
              className="order-input"
              type="text"
              placeholder="Ваше имя"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
            <input
              className="order-input"
              type="tel"
              placeholder="Телефон"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <input className="order-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="order-input" type="text" placeholder="Тема" value={subject} onChange={(e) => setSubject(e.target.value)} />
            <textarea className="order-textarea" placeholder="Комментарий" value={comment} onChange={(e) => setComment(e.target.value)} />
            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Отправка..." : "Отправить заявку"}
            </button>
            {feedback ? <div className={`order-feedback ${feedback.type}`}>{feedback.text}</div> : null}
          </form>
        </div>
      </section>

      <section className="contacts-info-grid">
        <div className="detail-panel">
          {CONTACT_INFO.map((group) => (
            <div key={group.title} className="contacts-info-group">
              <p className="detail-block-title">{group.title}</p>
              <div className="contacts-info-rows">
                {group.rows.map((row) => (
                  <div key={`${group.title}-${row.label}`} className="contacts-info-row">
                    <span className="contacts-info-key">{row.label}</span>
                    {row.href ? (
                      <a className="contacts-info-value" href={row.href}>
                        {row.value}
                      </a>
                    ) : (
                      <span className="contacts-info-value">{row.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="detail-panel">
          <p className="detail-block-title">Режим работы</p>
          <div className="contacts-hours-grid">
            {WORK_HOURS.map((item) => (
              <article key={item.day} className="contacts-hours-card">
                <strong>{item.day}</strong>
                <span>{item.time}</span>
                <small>{item.note}</small>
              </article>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}
