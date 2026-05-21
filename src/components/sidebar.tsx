"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import type { Session } from "@/lib/types";
import { getRoleLabel } from "@/lib/roles";

interface Props {
  session: Session;
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Inicio", icon: DashboardIcon },
  { href: "/instruccion", label: "Instrucción de sumario", icon: FileIcon },
];

const ADMIN_ITEMS = [
  { href: "/admin", label: "Panel administrador", icon: ShieldIcon },
  { href: "/admin/usuarios", label: "Usuarios", icon: UsersIcon },
];

export function Sidebar({ session }: Props) {
  const pathname = usePathname();
  const initials = session.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Image src="/logo-lexsum-on-dark.png" alt="LexSum" width={120} height={36} style={{ height: "auto" }} />
      </div>

      <nav style={{ padding: "var(--space-3) 0", flex: 1 }}>
        <p className="sidebar-section">Módulos</p>
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className={`nav-item${isActive(item.href) ? " active" : ""}`}>
            <item.icon />
            <span>{item.label}</span>
          </Link>
        ))}

        {session.role === "ADMIN" && (
          <>
            <p className="sidebar-section">Administración</p>
            {ADMIN_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className={`nav-item${isActive(item.href) ? " active" : ""}`}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            ))}
          </>
        )}
      </nav>

      <div className="sidebar-foot">
        <div className="avatar">{initials}</div>
        <div>
          <p className="avatar-name">{session.name}</p>
          <p className="avatar-role">{getRoleLabel(session.role)}</p>
        </div>
      </div>
    </aside>
  );
}

function DashboardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}
function FileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
