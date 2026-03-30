"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/AuthProvider";

export function RegisterPageClient() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = await register({ name, email, phone, password });
    setFeedback({ type: result.ok ? "success" : "error", text: result.message });

    if (result.ok) {
      window.setTimeout(() => router.push("/account"), 300);
    }
  }

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <div className="eyebrow">Регистрация</div>
        <h1 className="auth-title">Создать аккаунт</h1>
        <p className="section-subtitle">
          После регистрации пользователь сможет сохранять подборку и оформлять заказы.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="order-input"
            type="text"
            placeholder="Имя и фамилия"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
          <input
            className="order-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <input
            className="order-input"
            type="tel"
            placeholder="Телефон"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
          <input
            className="order-input"
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button className="btn btn-primary auth-submit" type="submit">
            Зарегистрироваться
          </button>
        </form>

        {feedback ? <div className={`order-feedback ${feedback.type}`}>{feedback.text}</div> : null}

        <p className="auth-switch">
          Уже есть аккаунт? <Link href="/login">Войти</Link>
        </p>
      </div>
    </section>
  );
}
