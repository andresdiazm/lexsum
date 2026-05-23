"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSumarios } from "@/lib/store";
import type { Sumario } from "@/lib/types";

const ESTADO_LABEL: Record<string, string> = {
  INSTRUIDO: "Instruido",
  EN_TRAMITE: "En trámite",
  CERRADO: "Cerrado",
};

export default function InstruccionPage() {
  const [sumarios, setSumarios] = useState<Sumario[]>([]);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  useEffect(() => { setSumarios(getSumarios()); }, []);

  const filtered = sumarios.filter((s) => {
    const matchSearch = !search ||
      s.numero.toLowerCase().includes(search.toLowerCase()) ||
      s.objeto.toLowerCase().includes(search.toLowerCase()) ||
      s.fiscalNombre.toLowerCase().includes(search.toLowerCase());
    const matchEstado = !filterEstado || s.estado === filterEstado;
    return matchSearch && matchEstado;
  });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Instrucción de sumarios</h1>
          <p className="page-subtitle">{sumarios.length} sumario{sumarios.length !== 1 ? "s" : ""} registrado{sumarios.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/instruccion/nuevo" className="btn btn-primary">
          <PlusIcon /> Instruir sumario
        </Link>
      </div>

      <div style={{ display: "flex", gap: "var(--space-3)", marginBottom: "var(--space-6)", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 260px" }}>
          <input
            className="input"
            placeholder="Buscar por N°, objeto o fiscal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ flex: "0 0 180px" }}>
          <select className="input" value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)}>
            <option value="">Todos los estados</option>
            <option value="INSTRUIDO">Instruido</option>
            <option value="EN_TRAMITE">En trámite</option>
            <option value="CERRADO">Cerrado</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <h3>No hay sumarios registrados</h3>
          <p style={{ marginBottom: "var(--space-5)" }}>
            {search || filterEstado ? "Sin resultados para los filtros aplicados." : "Comience instruyendo el primer sumario."}
          </p>
          {!search && !filterEstado && (
            <Link href="/instruccion/nuevo" className="btn btn-primary">Instruir primer sumario</Link>
          )}
        </div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>N° Resolución</th>
                  <th>Objeto / Materia</th>
                  <th>Fiscal designado</th>
                  <th>Fecha resolución</th>
                  <th>Plazo (días)</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <span className="mono" style={{ fontWeight: "var(--fw-semibold)", color: "var(--primary)" }}>
                        {s.numero}
                      </span>
                    </td>
                    <td style={{ maxWidth: 280 }}>
                      <p style={{ margin: 0, fontWeight: "var(--fw-medium)", fontSize: "var(--fs-body-sm)" }}>{s.objeto}</p>
                      {s.sujetos.length > 0 && (
                        <p style={{ margin: "2px 0 0", fontSize: "var(--fs-caption)", color: "var(--fg-tertiary)" }}>
                          {s.sujetos.length} sujeto{s.sujetos.length !== 1 ? "s" : ""} investigado{s.sujetos.length !== 1 ? "s" : ""}
                        </p>
                      )}
                    </td>
                    <td style={{ fontSize: "var(--fs-body-sm)" }}>{s.fiscalNombre}</td>
                    <td style={{ fontSize: "var(--fs-body-sm)", color: "var(--fg-secondary)" }}>
                      {new Date(s.fechaResolucion).toLocaleDateString("es-CL")}
                    </td>
                    <td style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "var(--fs-body-sm)" }}>
                      {s.plazo}
                    </td>
                    <td>
                      <span className={`badge status-${s.estado.toLowerCase()}`}>
                        {ESTADO_LABEL[s.estado]}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm" style={{ fontSize: "var(--fs-caption)" }}>
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function PlusIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
}
