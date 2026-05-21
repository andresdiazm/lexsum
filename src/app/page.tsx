import Image from "next/image";
import { LoginForm } from "@/components/login-form";

export default function LandingPage() {
  return (
    <main className="landing-shell">
      <header className="landing-header">
        <Image src="/logo-lexsum-on-dark.png" alt="LexSum" width={150} height={50} priority style={{ height: "auto" }} />
        <span className="landing-badge">v3.0 — Acceso institucional</span>
      </header>

      <section className="landing-hero">
        <div className="hero-content">
          <span className="overline">Gestión documental inteligente</span>
          <h1 className="hero-title">
            Sumarios administrativos con <span className="accent">precisión y trazabilidad</span>
          </h1>
          <p className="hero-description">
            LexSum centraliza la instrucción, seguimiento y control de sumarios administrativos.
            Roles claros, plazos controlados, documentos trazables y asistencia de IA en cada etapa del proceso.
          </p>

          <div className="hero-features">
            <div className="hero-feature">
              <span className="hero-feature-dot" />
              Instrucción de sumarios con asignación automática de fiscal
            </div>
            <div className="hero-feature">
              <span className="hero-feature-dot" />
              Generación de resoluciones en formato Word institucional
            </div>
            <div className="hero-feature">
              <span className="hero-feature-dot" />
              Panel de control con plazos, alertas y seguimiento
            </div>
            <div className="hero-feature">
              <span className="hero-feature-dot" />
              Gestión documental con foliación y trazabilidad completa
            </div>
            <div className="hero-feature">
              <span className="hero-feature-dot" />
              Acceso por roles con permisos diferenciados por función
            </div>
          </div>

          <div className="roles-strip">
            {["Fiscal", "Actuario", "Jefatura", "Jurídica", "Auditor", "Administrador"].map((r) => (
              <span key={r} className="badge">{r}</span>
            ))}
          </div>
        </div>

        <div>
          <div className="login-card">
            <div className="login-card-top">
              <p className="overline" style={{ marginBottom: 4 }}>Acceso institucional</p>
              <h2>Iniciar sesión en LexSum</h2>
            </div>
            <div className="login-card-body">
              <LoginForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
