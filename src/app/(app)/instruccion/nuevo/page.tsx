"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getFiscales, createSumario, getSession, getSumarios } from "@/lib/store";
import type { Sumario, User, Sujeto, TematicaSumario, TipoSumario } from "@/lib/types";

type Step = 1 | 2 | 3;

const TEMATICA_OPTIONS: { value: TematicaSumario; label: string }[] = [
  { value: "LEY_KARIN", label: "Ley Karin (acoso / violencia en el trabajo)" },
  { value: "LICENCIAS_MEDICAS", label: "Licencias médicas" },
  { value: "AUSENTISMO", label: "Ausentismo laboral" },
  { value: "OTRO", label: "Otro" },
];

interface FormData1 {
  numero: string;
  resolucionInstructora: string;
  fechaResolucion: string;
  tematica: TematicaSumario | "";
  tematicaOtro: string;
  tipo: TipoSumario;
  objeto: string;
  archivoNombre: string;
}

interface FormData2 {
  fiscalId: string;
  fiscalNombre: string;
  fechaDesignacion: string;
  plazo: number;
}

function generateCorrelativo(): string {
  const sumarios = getSumarios();
  const year = new Date().getFullYear();
  const next = String(sumarios.length + 1).padStart(4, "0");
  return `SUM-${year}-${next}`;
}

export default function NuevoSumarioPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [fiscales, setFiscales] = useState<User[]>([]);
  const [sujetos, setSujetos] = useState<Sujeto[]>([{ nombre: "", cargo: "" }]);
  const [form1, setForm1] = useState<FormData1>({
    numero: "",
    resolucionInstructora: "",
    fechaResolucion: new Date().toISOString().split("T")[0],
    tematica: "",
    tematicaOtro: "",
    tipo: "INDIVIDUAL",
    objeto: "",
    archivoNombre: "",
  });
  const [form2, setForm2] = useState<FormData2>({
    fiscalId: "",
    fiscalNombre: "",
    fechaDesignacion: new Date().toISOString().split("T")[0],
    plazo: 20,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFiscales(getFiscales());
    setForm1((f) => ({ ...f, numero: generateCorrelativo() }));
  }, []);

  const sujetosValidos = sujetos.filter((s) => s.nombre.trim() !== "");

  const tematicaLabel = form1.tematica
    ? (form1.tematica === "OTRO" ? form1.tematicaOtro || "Otro" : TEMATICA_OPTIONS.find(t => t.value === form1.tematica)?.label ?? "")
    : "";

  const previewSumario: Sumario = {
    id: "preview",
    numero: form1.numero,
    resolucionInstructora: form1.resolucionInstructora,
    fechaResolucion: form1.fechaResolucion,
    tematica: (form1.tematica || "OTRO") as TematicaSumario,
    tematicaOtro: form1.tematicaOtro || undefined,
    tipo: form1.tipo,
    objeto: form1.objeto,
    sujetos: sujetosValidos,
    fiscalId: form2.fiscalId,
    fiscalNombre: form2.fiscalNombre,
    fechaDesignacion: form2.fechaDesignacion,
    plazo: form2.plazo,
    estado: "INSTRUIDO",
    archivoNombre: form1.archivoNombre,
    createdAt: new Date().toISOString(),
    createdBy: getSession()?.name ?? "",
  };

  async function handleDownloadDocx() {
    const { buildResolucionDoc } = await import("@/lib/docx-generator");
    const { Packer } = await import("docx");
    const { saveAs } = await import("file-saver");

    const doc = buildResolucionDoc(previewSumario);
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Resolucion-Designacion-${form1.numero}.docx`);
  }

  function handleSave() {
    setSaving(true);
    createSumario({
      numero: form1.numero,
      resolucionInstructora: form1.resolucionInstructora,
      fechaResolucion: form1.fechaResolucion,
      tematica: (form1.tematica || "OTRO") as TematicaSumario,
      tematicaOtro: form1.tematicaOtro || undefined,
      tipo: form1.tipo,
      objeto: form1.objeto,
      sujetos: sujetosValidos,
      fiscalId: form2.fiscalId,
      fiscalNombre: form2.fiscalNombre,
      fechaDesignacion: form2.fechaDesignacion,
      plazo: form2.plazo,
      estado: "INSTRUIDO",
      archivoNombre: form1.archivoNombre,
      createdBy: getSession()?.name ?? "",
    });
    router.push("/instruccion");
  }

  function handleSelectFiscal(id: string) {
    const f = fiscales.find((u) => u.id === id);
    setForm2({ ...form2, fiscalId: id, fiscalNombre: f?.name ?? "" });
  }

  const step1Valid =
    !!form1.resolucionInstructora &&
    !!form1.objeto &&
    !!form1.numero &&
    !!form1.tematica &&
    (form1.tematica !== "OTRO" || !!form1.tematicaOtro.trim());

  return (
    <div className="page">
      <div style={{ maxWidth: 760 }}>
        <Link href="/instruccion" className="btn btn-ghost btn-sm" style={{ marginBottom: "var(--space-4)" }}>
          ← Volver
        </Link>
        <h1 className="page-title" style={{ marginBottom: "var(--space-6)" }}>Instruir sumario administrativo</h1>

        {/* Wizard steps */}
        <div className="wizard-steps" style={{ marginBottom: "var(--space-8)" }}>
          {([
            { n: 1, label: "Datos del sumario" },
            { n: 2, label: "Asignación de fiscal" },
            { n: 3, label: "Resolución de designación" },
          ] as const).map((s) => (
            <div
              key={s.n}
              className={`wizard-step ${step === s.n ? "active" : step > s.n ? "done" : ""}`}
            >
              <span className="step-num">{step > s.n ? "✓" : s.n}</span>
              <span className="step-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="card">
            <div className="card-header">
              <h3 style={{ margin: 0 }}>Paso 1 — Datos del sumario</h3>
            </div>
            <div className="card-body">
              <div className="form-grid">
                <div className="form-row">
                  <div className="field">
                    <label>N° de sumario (correlativo)</label>
                    <input className="input" value={form1.numero} onChange={(e) => setForm1({ ...form1, numero: e.target.value })} required />
                  </div>
                  <div className="field">
                    <label>Fecha resolución instructora</label>
                    <input type="date" className="input" value={form1.fechaResolucion} onChange={(e) => setForm1({ ...form1, fechaResolucion: e.target.value })} required />
                  </div>
                </div>

                <div className="field">
                  <label>N° de resolución que instruye el sumario *</label>
                  <input className="input" placeholder="Ej: RES-EX-2026-0123" value={form1.resolucionInstructora} onChange={(e) => setForm1({ ...form1, resolucionInstructora: e.target.value })} required />
                </div>

                <div className="field">
                  <label>Temática del sumario *</label>
                  <select
                    className="input"
                    value={form1.tematica}
                    onChange={(e) => setForm1({ ...form1, tematica: e.target.value as TematicaSumario | "", tematicaOtro: "" })}
                    required
                  >
                    <option value="">Seleccionar temática...</option>
                    {TEMATICA_OPTIONS.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                {form1.tematica === "OTRO" && (
                  <div className="field">
                    <label>Descripción de la temática *</label>
                    <input
                      className="input"
                      placeholder="Describa brevemente la temática del sumario..."
                      value={form1.tematicaOtro}
                      onChange={(e) => setForm1({ ...form1, tematicaOtro: e.target.value })}
                      required
                    />
                  </div>
                )}

                <div className="field">
                  <label>Tipo de sumario *</label>
                  <div style={{ display: "flex", gap: "var(--space-6)", paddingTop: 8 }}>
                    {([
                      { value: "INDIVIDUAL", label: "Individual", desc: "Afecta a un solo funcionario" },
                      { value: "COLECTIVO", label: "Colectivo", desc: "Afecta a más de un funcionario" },
                    ] as const).map(({ value, label, desc }) => (
                      <label
                        key={value}
                        style={{
                          display: "flex", alignItems: "flex-start", gap: "var(--space-3)",
                          cursor: "pointer", padding: "var(--space-3) var(--space-4)",
                          background: form1.tipo === value ? "var(--primary-soft)" : "var(--bg-surface-2)",
                          border: `1.5px solid ${form1.tipo === value ? "var(--primary)" : "var(--border-default)"}`,
                          borderRadius: "var(--radius-md)", flex: 1, transition: "all var(--dur-fast)"
                        }}
                      >
                        <input
                          type="radio"
                          name="tipo"
                          value={value}
                          checked={form1.tipo === value}
                          onChange={() => setForm1({ ...form1, tipo: value })}
                          style={{ accentColor: "var(--primary)", marginTop: 2 }}
                        />
                        <div>
                          <p style={{ margin: 0, fontWeight: "var(--fw-semibold)", fontSize: "var(--fs-body-sm)" }}>{label}</p>
                          <p style={{ margin: 0, fontSize: "var(--fs-caption)", color: "var(--fg-tertiary)" }}>{desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="field">
                  <label>Objeto / Descripción del sumario *</label>
                  <textarea
                    className="input"
                    rows={4}
                    placeholder="Describa el objeto e hechos que motivaron la instrucción del sumario..."
                    value={form1.objeto}
                    onChange={(e) => setForm1({ ...form1, objeto: e.target.value })}
                    required
                  />
                </div>

                <div className="field">
                  <label>Sujetos investigados <span style={{ color: "var(--fg-tertiary)", fontWeight: "var(--fw-normal)" }}>(opcional)</span></label>
                  <p className="field-hint">Agregue las personas a investigar. Puede agregar más de una.</p>
                  <div style={{ display: "grid", gap: "var(--space-3)", marginTop: "var(--space-2)" }}>
                    {sujetos.map((s, i) => (
                      <div key={i} className="repeatable-item">
                        <input
                          className="input"
                          placeholder="Nombre completo"
                          value={s.nombre}
                          onChange={(e) => {
                            const upd = [...sujetos];
                            upd[i] = { ...upd[i], nombre: e.target.value };
                            setSujetos(upd);
                          }}
                        />
                        <input
                          className="input"
                          placeholder="Cargo / función"
                          value={s.cargo ?? ""}
                          onChange={(e) => {
                            const upd = [...sujetos];
                            upd[i] = { ...upd[i], cargo: e.target.value };
                            setSujetos(upd);
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => setSujetos(sujetos.filter((_, j) => j !== i))}
                          title="Eliminar"
                          style={{ padding: "0 var(--space-3)" }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setSujetos([...sujetos, { nombre: "", cargo: "" }])}
                    style={{ marginTop: "var(--space-3)" }}
                  >
                    + Agregar sujeto investigado
                  </button>
                </div>

                <div className="field">
                  <label>Archivo adjunto <span style={{ color: "var(--fg-tertiary)", fontWeight: "var(--fw-normal)" }}>(opcional)</span></label>
                  <input
                    type="file"
                    className="input"
                    style={{ padding: "10px 12px", cursor: "pointer" }}
                    accept=".pdf,.docx,.doc"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setForm1({ ...form1, archivoNombre: f.name });
                    }}
                  />
                  <p className="field-hint">Resolución instructora en PDF o DOCX. Solo se registra el nombre del archivo.</p>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <div className="form-actions" style={{ borderTop: "none", paddingTop: 0, marginTop: 0 }}>
                <Link href="/instruccion" className="btn btn-secondary">Cancelar</Link>
                <button
                  className="btn btn-primary"
                  onClick={() => setStep(2)}
                  disabled={!step1Valid}
                >
                  Continuar →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="card">
            <div className="card-header">
              <h3 style={{ margin: 0 }}>Paso 2 — Asignación de fiscal</h3>
            </div>
            <div className="card-body">
              <div className="form-grid">
                {fiscales.length === 0 ? (
                  <div style={{ padding: "var(--space-6)", background: "var(--warning-bg)", border: "1px solid var(--warning-border)", borderRadius: "var(--radius-md)", color: "var(--warning-fg)" }}>
                    <p style={{ fontWeight: "var(--fw-semibold)", margin: "0 0 4px" }}>No hay fiscales disponibles</p>
                    <p style={{ fontSize: "var(--fs-body-sm)", margin: 0 }}>
                      Debe crear al menos un usuario con rol "Fiscal" antes de instruir un sumario.{" "}
                      <Link href="/admin/usuarios">Crear usuario fiscal →</Link>
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="field">
                      <label>Fiscal designado *</label>
                      <select
                        className="input"
                        value={form2.fiscalId}
                        onChange={(e) => handleSelectFiscal(e.target.value)}
                        required
                      >
                        <option value="">Seleccionar fiscal...</option>
                        {fiscales.map((f) => (
                          <option key={f.id} value={f.id}>{f.name}{f.unit ? ` — ${f.unit}` : ""}</option>
                        ))}
                      </select>
                    </div>

                    {form2.fiscalId && (
                      <div style={{ padding: "var(--space-3) var(--space-4)", background: "var(--info-bg)", border: "1px solid var(--info-border)", borderRadius: "var(--radius-sm)" }}>
                        <p style={{ fontSize: "var(--fs-caption)", fontWeight: "var(--fw-semibold)", color: "var(--info-fg)", margin: "0 0 2px" }}>
                          {fiscales.find(f => f.id === form2.fiscalId)?.name}
                        </p>
                        <p style={{ fontSize: "var(--fs-caption)", color: "var(--fg-secondary)", margin: 0 }}>
                          {fiscales.find(f => f.id === form2.fiscalId)?.cargo || "Sin cargo registrado"} · {fiscales.find(f => f.id === form2.fiscalId)?.unit || "Sin unidad"}
                        </p>
                      </div>
                    )}
                  </>
                )}

                <div className="form-row">
                  <div className="field">
                    <label>Fecha de designación *</label>
                    <input
                      type="date"
                      className="input"
                      value={form2.fechaDesignacion}
                      onChange={(e) => setForm2({ ...form2, fechaDesignacion: e.target.value })}
                      required
                    />
                  </div>
                  <div className="field">
                    <label>Plazo de instrucción (días hábiles) *</label>
                    <input
                      type="number"
                      className="input"
                      min={1}
                      max={365}
                      value={form2.plazo}
                      onChange={(e) => setForm2({ ...form2, plazo: Number(e.target.value) })}
                      required
                    />
                    <p className="field-hint">Desde la notificación al fiscal designado.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <div className="form-actions" style={{ borderTop: "none", paddingTop: 0, marginTop: 0 }}>
                <button className="btn btn-secondary" onClick={() => setStep(1)}>← Anterior</button>
                <button
                  className="btn btn-primary"
                  onClick={() => setStep(3)}
                  disabled={!form2.fiscalId || !form2.fechaDesignacion || !form2.plazo}
                >
                  Continuar →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div style={{ display: "grid", gap: "var(--space-6)" }}>
            <div className="card">
              <div className="card-header">
                <h3 style={{ margin: 0 }}>Paso 3 — Resolución de designación de fiscal</h3>
                <button className="btn btn-accent btn-sm" onClick={handleDownloadDocx}>
                  <DownloadIcon /> Descargar .docx
                </button>
              </div>
              <div className="card-body">
                <p style={{ fontSize: "var(--fs-body-sm)", color: "var(--fg-secondary)", marginBottom: "var(--space-5)" }}>
                  Vista previa de la resolución generada. Puede descargarla como Word para revisar y firmar.
                </p>

                <div className="resolucion-preview">
                  <div className="resolucion-header">
                    <h1>[NOMBRE INSTITUCIÓN]</h1>
                    <h2>RESOLUCIÓN N° {form1.numero}</h2>
                    <p style={{ margin: "8px 0 0", fontSize: 13 }}>
                      {new Date().toLocaleDateString("es-CL", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>

                  <div className="resolucion-section">
                    <strong>VISTOS:</strong>
                    <p>
                      Lo establecido en el Estatuto Administrativo, en la normativa sobre sumarios administrativos,
                      y la Resolución N° <b>{form1.resolucionInstructora}</b> de fecha {new Date(form1.fechaResolucion).toLocaleDateString("es-CL")},
                      que instruye el presente sumario administrativo; y,
                    </p>
                  </div>

                  <div className="resolucion-section">
                    <strong>CONSIDERANDO:</strong>
                    <p style={{ marginBottom: 8 }}>
                      1°. Que en virtud de la resolución señalada en el Visto, se instruyó sumario administrativo
                      tendiente a investigar y establecer responsabilidades respecto de los siguientes hechos: <b>{form1.objeto}</b>.
                    </p>
                    <p style={{ marginBottom: 8 }}>
                      2°. Que para el adecuado cumplimiento del procedimiento sumarial se hace necesario designar
                      un Fiscal que dirija la investigación con las facultades y obligaciones que le confiere la normativa vigente.
                    </p>
                    <p>
                      3°. Que el funcionario que se designa reúne los requisitos y la idoneidad para llevar a cabo
                      la investigación, contando con un plazo de <b>{form2.plazo}</b> días hábiles para su sustanciación.
                    </p>
                  </div>

                  <div className="resolucion-section">
                    <strong>RESUELVO:</strong>
                    <p style={{ marginBottom: 8 }}>
                      1°. DESÍGNASE como Fiscal del sumario administrativo a que se refiere la presente resolución, al/la
                      funcionario/a <b>{form2.fiscalNombre.toUpperCase()}</b>, quien deberá iniciar la investigación a partir del{" "}
                      {new Date(form2.fechaDesignacion).toLocaleDateString("es-CL", { year: "numeric", month: "long", day: "numeric" })}.
                    </p>
                    <p style={{ marginBottom: 8 }}>
                      2°. El fiscal designado dispondrá de un plazo de <b>{form2.plazo}</b> días hábiles,
                      contados desde la notificación de la presente resolución, para concluir la investigación.
                    </p>
                    {sujetosValidos.length > 0 && (
                      <p style={{ marginBottom: 8 }}>
                        3°. Las personas que revestirán la calidad de investigados son:{" "}
                        <b>{sujetosValidos.map((s) => `${s.nombre}${s.cargo ? `, ${s.cargo}` : ""}`).join("; ")}</b>.
                      </p>
                    )}
                    <p>{sujetosValidos.length > 0 ? "4°" : "3°"}. Anótese, comuníquese y archívese.</p>
                  </div>

                  <div className="resolucion-firma">
                    <div className="firma-block">
                      <div className="firma-line">
                        <p><b>[NOMBRE FIRMANTE]</b></p>
                        <p>[CARGO FIRMANTE]</p>
                        <p>[NOMBRE INSTITUCIÓN]</p>
                      </div>
                    </div>
                    <div className="firma-block">
                      <div className="firma-line">
                        <p><b>{form2.fiscalNombre.toUpperCase()}</b></p>
                        <p>Fiscal designado/a</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 style={{ margin: 0 }}>Resumen del sumario a crear</h3>
              </div>
              <div className="card-body">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)", fontSize: "var(--fs-body-sm)" }}>
                  <Info label="N° Sumario" value={form1.numero} />
                  <Info label="Resolución instructora" value={form1.resolucionInstructora} />
                  <Info label="Fecha resolución" value={new Date(form1.fechaResolucion).toLocaleDateString("es-CL")} />
                  <Info label="Temática" value={tematicaLabel} />
                  <Info label="Tipo" value={form1.tipo === "INDIVIDUAL" ? "Individual" : "Colectivo"} />
                  <Info label="Fiscal designado" value={form2.fiscalNombre} />
                  <Info label="Fecha designación" value={new Date(form2.fechaDesignacion).toLocaleDateString("es-CL")} />
                  <Info label="Plazo" value={`${form2.plazo} días hábiles`} />
                  {form1.archivoNombre && <Info label="Archivo adjunto" value={form1.archivoNombre} />}
                  {sujetosValidos.length > 0 && (
                    <div style={{ gridColumn: "1 / -1" }}>
                      <p style={{ fontWeight: "var(--fw-semibold)", color: "var(--fg-secondary)", marginBottom: 4, fontSize: "var(--fs-caption)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Sujetos investigados</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                        {sujetosValidos.map((s, i) => (
                          <span key={i} className="badge badge-neutral">{s.nombre}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="card-footer">
                <div className="form-actions" style={{ borderTop: "none", paddingTop: 0, marginTop: 0 }}>
                  <button className="btn btn-secondary" onClick={() => setStep(2)}>← Anterior</button>
                  <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                    {saving ? "Guardando..." : "Confirmar y guardar sumario"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontWeight: "var(--fw-semibold)", color: "var(--fg-secondary)", margin: "0 0 2px", fontSize: "var(--fs-caption)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
      <p style={{ margin: 0, fontWeight: "var(--fw-medium)" }}>{value || "—"}</p>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
