"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUsers, deleteUser, updateUser, createUser, getUserByEmail } from "@/lib/store";
import { getRoleLabel, roleProfiles } from "@/lib/roles";
import type { User, RoleId } from "@/lib/types";

const ROLE_BADGE: Record<RoleId, string> = {
  ADMIN: "badge-navy",
  FISCAL: "badge-teal",
  ACTUARIO: "badge-info",
  JEFATURA: "badge-warning",
  JURIDICA: "badge-success",
  AUDITOR: "badge-neutral",
};

interface ModalForm {
  name: string;
  cargo: string;
  email: string;
  unit: string;
  password: string;
  role: RoleId | "";
  active: boolean;
}

const EMPTY_FORM: ModalForm = {
  name: "", cargo: "", email: "", unit: "", password: "", role: "", active: true,
};

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<RoleId | "">("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<ModalForm>(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  function refresh() { setUsers(getUsers()); }
  useEffect(refresh, []);

  const filtered = users.filter((u) => {
    const matchSearch = !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = !filterRole || u.role === filterRole;
    return matchSearch && matchRole;
  });

  function openModal() { setForm(EMPTY_FORM); setFormError(""); setShowModal(true); }
  function closeModal() { setShowModal(false); setFormError(""); }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!form.role) { setFormError("Seleccione un rol."); return; }
    if (getUserByEmail(form.email)) { setFormError("Ya existe un usuario con ese correo."); return; }
    setSaving(true);
    createUser({
      name: form.name.trim(),
      cargo: form.cargo.trim(),
      email: form.email.trim().toLowerCase(),
      unit: form.unit.trim(),
      password: form.password || "Lexsum1234",
      role: form.role as RoleId,
      active: form.active,
    });
    refresh();
    setSaving(false);
    closeModal();
  }

  function handleToggleActive(id: string, active: boolean) {
    updateUser(id, { active });
    refresh();
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar al usuario "${name}"? Esta acción no se puede deshacer.`)) return;
    deleteUser(id);
    refresh();
  }

  function set(k: keyof ModalForm, v: string | boolean) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Usuarios del sistema</h1>
          <p className="page-subtitle">{users.length} usuario{users.length !== 1 ? "s" : ""} registrado{users.length !== 1 ? "s" : ""}</p>
        </div>
        <button className="btn btn-primary" onClick={openModal}>
          <PlusIcon /> Crear usuario
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "var(--space-3)", marginBottom: "var(--space-6)", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 260px" }}>
          <input className="input" placeholder="Buscar por nombre o correo..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div style={{ flex: "0 0 200px" }}>
          <select className="input" value={filterRole} onChange={(e) => setFilterRole(e.target.value as RoleId | "")}>
            <option value="">Todos los roles</option>
            {roleProfiles.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cargo</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Unidad</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", color: "var(--fg-tertiary)", padding: "var(--space-10)" }}>
                    {search || filterRole ? "Sin resultados para el filtro aplicado." : "No hay usuarios registrados aún."}
                  </td>
                </tr>
              )}
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                      <div style={{ width: 30, height: 30, borderRadius: "var(--radius-pill)", background: "var(--primary-soft)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--fs-caption)", fontWeight: "var(--fw-bold)", flexShrink: 0 }}>
                        {u.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
                      </div>
                      <span style={{ fontWeight: "var(--fw-medium)" }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: "var(--fs-body-sm)", color: "var(--fg-secondary)" }}>{u.cargo || "—"}</td>
                  <td style={{ color: "var(--fg-secondary)", fontFamily: "var(--font-mono)", fontSize: "var(--fs-body-sm)" }}>{u.email}</td>
                  <td><span className={`badge ${ROLE_BADGE[u.role]}`}>{getRoleLabel(u.role)}</span></td>
                  <td style={{ color: "var(--fg-secondary)", fontSize: "var(--fs-body-sm)" }}>{u.unit || "—"}</td>
                  <td><span className={`badge ${u.active ? "badge-success" : "badge-neutral"}`}>{u.active ? "Vigente" : "Inactivo"}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: "var(--space-2)" }}>
                      <Link href={`/admin/usuarios/editar?id=${u.id}`} className="btn btn-ghost btn-sm">Editar</Link>
                      <button className={`btn btn-sm ${u.active ? "btn-ghost" : "btn-accent"}`} onClick={() => handleToggleActive(u.id, !u.active)} style={{ fontSize: "var(--fs-caption)" }}>
                        {u.active ? "Desactivar" : "Activar"}
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id, u.name)} title="Eliminar"><TrashIcon /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create user modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="modal">
            <div className="modal-header">
              <div>
                <h3 style={{ margin: 0 }}>Crear usuario</h3>
                <p style={{ margin: "2px 0 0", fontSize: "var(--fs-caption)", color: "var(--fg-tertiary)" }}>
                  Complete los datos del nuevo usuario institucional
                </p>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={closeModal} style={{ padding: "0 8px" }}>✕</button>
            </div>

            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="field">
                    <label htmlFor="m-name">Nombre completo *</label>
                    <input id="m-name" className="input" required placeholder="Juan Pérez González" value={form.name} onChange={(e) => set("name", e.target.value)} />
                  </div>
                  <div className="field">
                    <label htmlFor="m-cargo">Cargo</label>
                    <input id="m-cargo" className="input" placeholder="Ej: Inspector fiscal" value={form.cargo} onChange={(e) => set("cargo", e.target.value)} />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="m-email">Correo institucional *</label>
                  <input id="m-email" type="email" className="input" required placeholder="usuario@institucion.cl" value={form.email} onChange={(e) => set("email", e.target.value)} />
                </div>

                <div className="form-row">
                  <div className="field">
                    <label htmlFor="m-unit">Unidad / Área</label>
                    <input id="m-unit" className="input" placeholder="Ej: Fiscalía Regional" value={form.unit} onChange={(e) => set("unit", e.target.value)} />
                  </div>
                  <div className="field">
                    <label htmlFor="m-role">Rol *</label>
                    <select id="m-role" className="input" required value={form.role} onChange={(e) => set("role", e.target.value)}>
                      <option value="">Seleccionar rol...</option>
                      {roleProfiles.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="field">
                    <label htmlFor="m-password">Contraseña inicial</label>
                    <input id="m-password" type="text" className="input" placeholder="Lexsum1234" value={form.password} onChange={(e) => set("password", e.target.value)} />
                    <p className="field-hint">Dejar en blanco para usar la contraseña por defecto.</p>
                  </div>
                  <div className="field">
                    <label>Estado</label>
                    <div style={{ display: "flex", gap: "var(--space-3)", paddingTop: 10 }}>
                      {[{ v: true, l: "Vigente" }, { v: false, l: "Inactivo" }].map(({ v, l }) => (
                        <label key={l} style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", cursor: "pointer", fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-medium)" }}>
                          <input type="radio" name="m-active" checked={form.active === v} onChange={() => set("active", v)} style={{ accentColor: "var(--accent)", width: 16, height: 16 }} />
                          {l}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {form.role && (
                  <div style={{ padding: "var(--space-3) var(--space-4)", background: "var(--info-bg)", border: "1px solid var(--info-border)", borderRadius: "var(--radius-sm)" }}>
                    <p style={{ fontSize: "var(--fs-caption)", fontWeight: "var(--fw-semibold)", color: "var(--info-fg)", margin: "0 0 4px" }}>
                      {roleProfiles.find(r => r.id === form.role)?.label}
                    </p>
                    <p style={{ fontSize: "var(--fs-caption)", color: "var(--fg-secondary)", margin: 0 }}>
                      {roleProfiles.find(r => r.id === form.role)?.description}
                    </p>
                  </div>
                )}

                {formError && <p className="login-error">{formError}</p>}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Creando..." : "Crear usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function PlusIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
}
function TrashIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" /></svg>;
}
