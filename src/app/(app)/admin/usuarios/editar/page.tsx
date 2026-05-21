"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getUserById, updateUser } from "@/lib/store";
import { roleProfiles, getRoleProfile } from "@/lib/roles";
import type { User, RoleId } from "@/lib/types";

function EditarUsuarioContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const id = params.get("id");
    if (!id) { router.replace("/admin/usuarios"); return; }
    const u = getUserById(id);
    if (!u) { router.replace("/admin/usuarios"); return; }
    setUser(u);
  }, [params, router]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    setError(""); setSaving(true);

    const fd = new FormData(e.currentTarget);
    const updated = updateUser(user.id, {
      name: fd.get("name") as string,
      role: fd.get("role") as RoleId,
      unit: fd.get("unit") as string,
    });

    if (!updated) { setError("Error al actualizar el usuario."); setSaving(false); return; }
    setUser(updated);
    setSuccess(true);
    setSaving(false);
    setTimeout(() => setSuccess(false), 2500);
  }

  if (!user) return null;

  const roleProfile = getRoleProfile(user.role);

  return (
    <div className="page">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "var(--space-8)", maxWidth: 960 }}>
        <div>
          <a href="/lexsum/admin/usuarios" className="btn btn-ghost btn-sm" style={{ marginBottom: "var(--space-3)" }}>
            ← Volver a usuarios
          </a>
          <h1 className="page-title" style={{ marginBottom: "var(--space-1)" }}>Editar usuario</h1>
          <p className="page-subtitle" style={{ marginBottom: "var(--space-6)" }}>{user.email}</p>

          <div className="card">
            <form onSubmit={handleSubmit}>
              <div className="card-body">
                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="name">Nombre completo</label>
                    <input id="name" name="name" className="input" defaultValue={user.name} required />
                  </div>

                  <div className="field">
                    <label>Correo electrónico</label>
                    <input className="input" value={user.email} disabled />
                    <p className="field-hint">El correo no puede modificarse.</p>
                  </div>

                  <div className="form-row">
                    <div className="field">
                      <label htmlFor="role">Rol</label>
                      <select id="role" name="role" className="input" defaultValue={user.role}>
                        {roleProfiles.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="unit">Unidad / Área</label>
                      <input id="unit" name="unit" className="input" defaultValue={user.unit} />
                    </div>
                  </div>

                  {error && <p className="login-error">{error}</p>}
                  {success && (
                    <div style={{ padding: "var(--space-3) var(--space-4)", background: "var(--success-bg)", border: "1px solid var(--success-border)", borderRadius: "var(--radius-sm)", color: "var(--success-fg)", fontSize: "var(--fs-body-sm)" }}>
                      Usuario actualizado correctamente.
                    </div>
                  )}
                </div>
              </div>
              <div className="card-footer">
                <div className="form-actions" style={{ borderTop: "none", paddingTop: 0, marginTop: 0 }}>
                  <a href="/lexsum/admin/usuarios" className="btn btn-secondary">Cancelar</a>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div style={{ paddingTop: 48 }}>
          <div className="card">
            <div className="card-header">
              <h3 style={{ margin: 0, fontSize: "var(--fs-h4)" }}>Permisos del rol</h3>
            </div>
            <div className="card-body" style={{ paddingTop: "var(--space-4)" }}>
              <p style={{ fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-semibold)", marginBottom: "var(--space-2)" }}>
                {roleProfile?.label}
              </p>
              <p style={{ fontSize: "var(--fs-caption)", color: "var(--fg-tertiary)", marginBottom: "var(--space-4)" }}>
                {roleProfile?.description}
              </p>
              <div className="perms-list">
                {roleProfile?.permissions.map((perm) => (
                  <div key={perm} className="perm-item">
                    <CheckIcon />
                    <span>{perm}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card" style={{ marginTop: "var(--space-4)" }}>
            <div className="card-header">
              <h3 style={{ margin: 0, fontSize: "var(--fs-h4)" }}>Estado de la cuenta</h3>
            </div>
            <div className="card-body">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
                <span style={{ fontSize: "var(--fs-body-sm)" }}>Estado actual:</span>
                <span className={`badge ${user.active ? "badge-success" : "badge-neutral"}`}>
                  {user.active ? "Activo" : "Inactivo"}
                </span>
              </div>
              <button
                className={`btn btn-sm ${user.active ? "btn-danger" : "btn-accent"}`}
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => {
                  updateUser(user.id, { active: !user.active });
                  setUser({ ...user, active: !user.active });
                }}
              >
                {user.active ? "Desactivar usuario" : "Activar usuario"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditarUsuarioPage() {
  return (
    <Suspense fallback={<div style={{ padding: "var(--space-8)", color: "var(--fg-tertiary)" }}>Cargando...</div>}>
      <EditarUsuarioContent />
    </Suspense>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--success-fg)", flexShrink: 0 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
