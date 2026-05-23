"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSession } from "@/lib/store";
import { getSumarios } from "@/lib/store";
import type { Session, Sumario } from "@/lib/types";

export default function DashboardPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [sumarios, setSumarios] = useState<Sumario[]>([]);

  useEffect(() => {
    setSession(getSession());
    setSumarios(getSumarios());
  }, []);

  const instruidos = sumarios.filter((s) => s.estado === "INSTRUIDO").length;
  const enTramite = sumarios.filter((s) => s.estado === "EN_TRAMITE").length;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Bienvenido{session ? `, ${session.name.split(" ")[0]}` : ""}</h1>
          <p className="page-subtitle">Panel general del sistema LexSum</p>
        </div>
      </div>

      <div className="stat-grid" style={{ marginBottom: "var(--space-10)" }}>
        <div className="stat-card">
          <p className="stat-label">Sumarios totales</p>
          <p className="stat-value">{sumarios.length}</p>
          <p className="stat-sub">Registrados en el sistema</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Instruidos</p>
          <p className="stat-value" style={{ color: "var(--info-fg)" }}>{instruidos}</p>
          <p className="stat-sub">En fase de instrucción</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">En trámite</p>
          <p className="stat-value" style={{ color: "var(--warning-fg)" }}>{enTramite}</p>
          <p className="stat-sub">Con actuaciones pendientes</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Cerrados</p>
          <p className="stat-value" style={{ color: "var(--success-fg)" }}>
            {sumarios.filter((s) => s.estado === "CERRADO").length}
          </p>
          <p className="stat-sub">Resueltos</p>
        </div>
      </div>

      <div style={{ display: "grid", gap: "var(--space-4)", maxWidth: 680 }}>
        <div className="card">
          <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <h3 style={{ margin: 0 }}>Módulos disponibles</h3>
            <ModuleLink
              href="/instruccion"
              title="Instrucción de sumario"
              desc="Crear nuevos sumarios, asignar fiscales y generar resoluciones de designación."
              color="var(--info-bg)"
              accent="var(--info-fg)"
            />
            {session?.role === "ADMIN" && (
              <ModuleLink
                href="/admin/usuarios"
                title="Administración de usuarios"
                desc="Crear usuarios, asignar roles y gestionar perfiles institucionales."
                color="var(--accent-soft)"
                accent="var(--accent)"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ModuleLink({ href, title, desc, color, accent }: {
  href: string; title: string; desc: string; color: string; accent: string;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "flex", gap: "var(--space-4)", alignItems: "flex-start",
        padding: "var(--space-4)", background: color, borderRadius: "var(--radius-md)",
        textDecoration: "none", transition: "opacity var(--dur-fast) var(--ease-standard)"
      }}
    >
      <div style={{ width: 4, borderRadius: 2, background: accent, alignSelf: "stretch", flexShrink: 0 }} />
      <div>
        <p style={{ fontWeight: "var(--fw-semibold)", color: accent, marginBottom: 4, fontSize: "var(--fs-body-sm)" }}>{title}</p>
        <p style={{ fontSize: "var(--fs-body-sm)", color: "var(--fg-secondary)", margin: 0 }}>{desc}</p>
      </div>
    </Link>
  );
}
