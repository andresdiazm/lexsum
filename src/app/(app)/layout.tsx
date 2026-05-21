"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getSession } from "@/lib/store";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { initStore } from "@/lib/store";
import type { Session } from "@/lib/types";

const CRUMB_MAP: Record<string, string[]> = {
  "/dashboard": ["LexSum", "Inicio"],
  "/instruccion": ["LexSum", "Instrucción de sumario"],
  "/instruccion/nuevo": ["LexSum", "Instrucción de sumario", "Nuevo sumario"],
  "/admin": ["LexSum", "Administración"],
  "/admin/usuarios": ["LexSum", "Administración", "Usuarios"],
};

const ACTION_MAP: Record<string, { label: string; href: string }> = {
  "/instruccion": { label: "Instruir sumario", href: "/instruccion/nuevo" },
  "/admin/usuarios": { label: "Crear usuario", href: "/admin/usuarios/nuevo" },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    initStore();
    const s = getSession();
    if (!s) {
      router.replace("/");
      return;
    }
    if (pathname.startsWith("/admin") && s.role !== "ADMIN") {
      router.replace("/dashboard");
      return;
    }
    setSession(s);
    setChecked(true);
  }, [pathname, router]);

  if (!checked || !session) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-app)" }}>
        <div style={{ color: "var(--fg-tertiary)", fontSize: "var(--fs-body-sm)" }}>Verificando acceso...</div>
      </div>
    );
  }

  const crumbs = CRUMB_MAP[pathname] ?? ["LexSum"];
  const action = ACTION_MAP[pathname];

  return (
    <div className="app-shell">
      <Sidebar session={session} />
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", overflow: "auto" }}>
        <Topbar crumbs={crumbs} action={action} session={session} />
        <main style={{ flex: 1 }}>{children}</main>
      </div>
    </div>
  );
}
