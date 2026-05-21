"use client";

import { initStore, getUserByEmail, saveSession, clearSession, getSession } from "./store";
import type { Session } from "./types";

export { initStore, getSession };

export function login(email: string, password: string): { ok: boolean; message?: string; session?: Session } {
  initStore();
  const user = getUserByEmail(email);

  if (!user) {
    return { ok: false, message: "Credenciales incorrectas. Verifique su correo y contraseña." };
  }
  if (!user.active) {
    return { ok: false, message: "Su cuenta está desactivada. Contacte al administrador del sistema." };
  }
  if (user.password !== password) {
    return { ok: false, message: "Credenciales incorrectas. Verifique su correo y contraseña." };
  }

  const session: Session = { userId: user.id, email: user.email, name: user.name, role: user.role };
  saveSession(session);
  return { ok: true, session };
}

export function logout(): void {
  clearSession();
}
