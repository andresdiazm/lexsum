"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, initStore } from "@/lib/auth-client";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const email = fd.get("email") as string;
    const password = fd.get("password") as string;

    initStore();
    const result = login(email, password);

    if (!result.ok) {
      setError(result.message ?? "Error al iniciar sesión.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "var(--space-5)" }}>
      <div className="field">
        <label htmlFor="email">Correo institucional</label>
        <input
          id="email"
          name="email"
          type="email"
          className="input"
          placeholder="usuario@institucion.cl"
          autoComplete="email"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          className="input"
          placeholder="••••••••"
          autoComplete="current-password"
          minLength={6}
          required
        />
      </div>

      {error && <p className="login-error">{error}</p>}

      <button type="submit" className="login-submit" disabled={loading}>
        {loading ? "Verificando..." : "Ingresar al sistema"}
      </button>

      <p className="login-security">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Sesión con cifrado seguro · Acceso por roles institucionales
      </p>
    </form>
  );
}
