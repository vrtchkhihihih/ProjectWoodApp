"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/components/AuthProvider";

export function LoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = await login({ email, password });
    setFeedback({ type: result.ok ? "success" : "error", text: result.message });

    if (!result.ok) {
      return;
    }

    const next = searchParams.get("next");
    const normalizedEmail = email.trim().toLowerCase();

    window.setTimeout(() => {
      if (normalizedEmail === "admin@woodapp.ru") {
        router.push("/admin");
        return;
      }
      router.push(next || "/account");
    }, 300);
  }

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <div className="eyebrow">Авторизация</div>
        <h1 className="auth-title">Вход в аккаунт</h1>
        <p className="section-subtitle">
          Войдите, чтобы работать с корзиной, заказами и личным кабинетом.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
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
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button className="btn btn-primary auth-submit" type="submit">
            Войти
          </button>
        </form>

        {feedback ? <div className={`order-feedback ${feedback.type}`}>{feedback.text}</div> : null}

        <div className="auth-hint">
          <span>Демо-доступ администратора:</span>
          <code>admin@woodapp.ru / admin123</code>
        </div>

        <p className="auth-switch">
          Нет аккаунта? <Link href="/register">Создать</Link>
        </p>
      </div>
    </section>
  );
}
