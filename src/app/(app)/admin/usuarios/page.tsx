"use client";

import { useEffect, useState } from "react";
import { getUsers, deleteUser, updateUser } from "@/lib/store";
import { getRoleLabel, roleProfiles } from "@/lib/roles";
import type { User, RoleId } from "@/lib/types";

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<RoleId | "">("");

  function refresh() { setUsers(getUsers()); }
  useEffect(refresh, []);

  const filtered = users.filter((u) => {
    const matchSearch = !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = !filterRole || u.role === filterRole;
    return matchSearch && matchRole;
  });

  function handleToggleActive(id: string, active: boolean) {
    updateUser(id, { active });
    refresh();
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar al usuario "${name}"? Esta acción no se puede deshacer.`)) return;
    deleteUser(id);
    refresh();
  }

  const ROLE_BADGE: Record<RoleId, string> = {
    ADMIN: "badge-navy",
    FISCAL: "badge-teal",
    ACTUARIO: "badge-info",
    JEFATURA: "badge-warning",
    JURIDICA: "badge-success",
    AUDITOR: "badge-neutral",
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Usuarios del sistema</h1>
          <p className="page-subtitle">{users.length} usuarios registrados</p>
        </div>
        <a href="/admin/usuarios/nuevo" className="btn btn-primary">
          <PlusIcon /> Crear usuario
        </a>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "var(--space-3)", marginBottom: "var(--space-6)", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 260px" }}>
          <input
            className="input"
            placeholder="Buscar por nombre o correo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
                  <td colSpan={6} style={{ textAlign: "center", color: "var(--fg-tertiary)", padding: "var(--space-10)" }}>
                    {search || filterRole ? "Sin resultados para el filtro aplicado" : "No hay usuarios registrados aún."}
                  </td>
                </tr>
              )}
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: "var(--radius-pill)",
                        background: "var(--primary-soft)", color: "var(--primary)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "var(--fs-caption)", fontWeight: "var(--fw-bold)", flexShrink: 0
                      }}>
                        {u.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
                      </div>
                      <span style={{ fontWeight: "var(--fw-medium)" }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ color: "var(--fg-secondary)", fontFamily: "var(--font-mono)", fontSize: "var(--fs-body-sm)" }}>{u.email}</td>
                  <td><span className={`badge ${ROLE_BADGE[u.role]}`}>{getRoleLabel(u.role)}</span></td>
                  <td style={{ color: "var(--fg-secondary)", fontSize: "var(--fs-body-sm)" }}>{u.unit || "—"}</td>
                  <td>
                    <span className={`badge ${u.active ? "badge-success" : "badge-neutral"}`}>
                      {u.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "var(--space-2)" }}>
                      <a href={`/admin/usuarios/${u.id}`} className="btn btn-ghost btn-sm">Editar</a>
                      <button
                        className={`btn btn-sm ${u.active ? "btn-ghost" : "btn-accent"}`}
                        onClick={() => handleToggleActive(u.id, !u.active)}
                        style={{ fontSize: "var(--fs-caption)" }}
                      >
                        {u.active ? "Desactivar" : "Activar"}
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(u.id, u.name)}
                        title="Eliminar usuario"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PlusIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
}
function TrashIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" /></svg>;
}
