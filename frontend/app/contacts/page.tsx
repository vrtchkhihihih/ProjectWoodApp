import { ContactsPageClient } from "@/components/ContactsPageClient";

export default function ContactsPage() {
  return (
    <main className="container page-space">
      <section className="section">
        <div className="eyebrow">Контакты</div>
        <h1 className="section-title">Связаться с нами</h1>
        <p className="section-subtitle">
          Оставьте заявку на подбор панелей, расчет проекта или консультацию по комплектации. Мы поможем с выбором и ответим на вопросы по заказу.
        </p>
      </section>
      <ContactsPageClient />
    </main>
  );
}
