"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUsers } from "@/lib/store";
import { roleProfiles } from "@/lib/roles";
import type { User } from "@/lib/types";

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => { setUsers(getUsers()); }, []);

  const active = users.filter((u) => u.active).length;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Panel administrador</h1>
          <p className="page-subtitle">Gestión de usuarios, roles y permisos del sistema</p>
        </div>
        <Link href="/admin/usuarios" className="btn btn-primary">
          <PlusIcon /> Crear usuario
        </Link>
      </div>

      <div className="stat-grid" style={{ marginBottom: "var(--space-10)" }}>
        <div className="stat-card">
          <p className="stat-label">Usuarios totales</p>
          <p className="stat-value">{users.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Activos</p>
          <p className="stat-value" style={{ color: "var(--success-fg)" }}>{active}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Inactivos</p>
          <p className="stat-value" style={{ color: "var(--fg-tertiary)" }}>{users.length - active}</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: "var(--space-8)" }}>
        <div className="card-header">
          <h3 style={{ margin: 0 }}>Distribución por roles</h3>
          <Link href="/admin/usuarios" className="btn btn-ghost btn-sm">Ver todos los usuarios →</Link>
        </div>
        <div className="card-body">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "var(--space-4)" }}>
            {roleProfiles.map((rp) => {
              const count = users.filter((u) => u.role === rp.id).length;
              return (
                <div key={rp.id} style={{
                  padding: "var(--space-4)", background: "var(--bg-surface-2)",
                  borderRadius: "var(--radius-md)", display: "flex",
                  justifyContent: "space-between", alignItems: "center"
                }}>
                  <div>
                    <p style={{ fontWeight: "var(--fw-semibold)", fontSize: "var(--fs-body-sm)", margin: 0 }}>{rp.label}</p>
                    <p style={{ fontSize: "var(--fs-caption)", color: "var(--fg-tertiary)", margin: 0 }}>{rp.description}</p>
                  </div>
                  <span style={{
                    width: 32, height: 32, borderRadius: "var(--radius-pill)",
                    background: "var(--bg-inverse)", color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "var(--fs-body-sm)", fontWeight: "var(--fw-bold)", flexShrink: 0
                  }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
