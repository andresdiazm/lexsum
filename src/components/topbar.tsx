"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth-client";
import type { Session } from "@/lib/types";

interface Props {
  crumbs: string[];
  action?: { label: string; href: string };
  session: Session;
}

export function Topbar({ crumbs, action, session }: Props) {
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <div className="topbar">
      <nav className="breadcrumb" aria-label="Ubicación">
        {crumbs.map((c, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            {i > 0 && <span className="breadcrumb-sep">/</span>}
            <span className={i === crumbs.length - 1 ? "breadcrumb-current" : ""}>{c}</span>
          </span>
        ))}
      </nav>

      <div className="topbar-actions">
        {action && (
          <Link href={action.href} className="btn btn-accent btn-sm">
            <PlusIcon />
            {action.label}
          </Link>
        )}
        <div className="topbar-user">
          <span>{session.name.split(" ")[0]}</span>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={handleLogout} title="Cerrar sesión">
          <LogoutIcon />
          Salir
        </button>
      </div>
    </div>
  );
}

function PlusIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
}
function LogoutIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;
}
