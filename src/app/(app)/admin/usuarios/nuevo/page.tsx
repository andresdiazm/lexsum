"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUser, getUserByEmail } from "@/lib/store";
import { roleProfiles } from "@/lib/roles";
import type { RoleId } from "@/lib/types";

export default function NuevoUsuarioPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const fd = new FormData(e.currentTarget);
    const email = (fd.get("email") as string).toLowerCase().trim();

    if (getUserByEmail(email)) {
      setError("Ya existe un usuario con ese correo electrónico.");
      setSaving(false);
      return;
    }

    createUser({
      name: fd.get("name") as string,
      email,
      role: fd.get("role") as RoleId,
      unit: fd.get("unit") as string,
      password: fd.get("password") as string,
      active: true,
    });

    router.push("/admin/usuarios");
  }

  return (
    <div className="page">
      <div style={{ maxWidth: 560 }}>
        <div style={{ marginBottom: "var(--space-6)" }}>
          <Link href="/admin/usuarios" className="btn btn-ghost btn-sm" style={{ marginBottom: "var(--space-3)" }}>
            ← Volver a usuarios
          </Link>
          <h1 className="page-title">Crear usuario</h1>
          <p className="page-subtitle">Complete los datos del nuevo usuario institucional</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="card-body">
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="name">Nombre completo *</label>
                  <input id="name" name="name" className="input" required placeholder="Juan Pérez González" />
                </div>

                <div className="field">
                  <label htmlFor="email">Correo electrónico institucional *</label>
                  <input id="email" name="email" type="email" className="input" required placeholder="usuario@institucion.cl" />
                </div>

                <div className="form-row">
                  <div className="field">
                    <label htmlFor="role">Rol *</label>
                    <select id="role" name="role" className="input" required>
                      <option value="">Seleccionar rol...</option>
                      {roleProfiles.map((r) => (
                        <option key={r.id} value={r.id}>{r.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="unit">Unidad / Área</label>
                    <input id="unit" name="unit" className="input" placeholder="Ej: Fiscalía Regional" />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="password">Contraseña inicial *</label>
                  <input id="password" name="password" type="text" className="input" required minLength={6} placeholder="Mínimo 6 caracteres" />
                  <p className="field-hint">El usuario deberá cambiarla en su primer ingreso.</p>
                </div>

                {error && <p className="login-error">{error}</p>}
              </div>
            </div>

            <div className="card-footer">
              <div className="form-actions" style={{ borderTop: "none", paddingTop: 0, marginTop: 0 }}>
                <Link href="/admin/usuarios" className="btn btn-secondary">Cancelar</Link>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Creando..." : "Crear usuario"}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="card" style={{ marginTop: "var(--space-6)" }}>
          <div className="card-header">
            <h3 style={{ margin: 0, fontSize: "var(--fs-h4)" }}>Roles disponibles</h3>
          </div>
          <div className="card-body">
            <div style={{ display: "grid", gap: "var(--space-3)" }}>
              {roleProfiles.map((rp) => (
                <div key={rp.id} style={{ display: "flex", gap: "var(--space-3)", alignItems: "flex-start" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", marginTop: 6, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontWeight: "var(--fw-semibold)", fontSize: "var(--fs-body-sm)", margin: 0 }}>{rp.label}</p>
                    <p style={{ fontSize: "var(--fs-caption)", color: "var(--fg-tertiary)", margin: 0 }}>{rp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
