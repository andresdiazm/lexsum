"use client";

import type { User, Sumario, Session } from "./types";

const USERS_KEY = "lexsum_users";
const SUMARIOS_KEY = "lexsum_sumarios";
const SESSION_KEY = "lexsum_session";

const INITIAL_ADMIN: User = {
  id: "usr_admin_001",
  name: "Administrador LexSum",
  email: "admin@lexsum.cl",
  role: "ADMIN",
  unit: "Administración",
  password: "Admin1234",
  active: true,
  createdAt: new Date().toISOString(),
};

export function initStore(): void {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify([INITIAL_ADMIN]));
  }
  if (!localStorage.getItem(SUMARIOS_KEY)) {
    localStorage.setItem(SUMARIOS_KEY, JSON.stringify([]));
  }
}

// ---- Users ----

export function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? (JSON.parse(raw) as User[]) : [INITIAL_ADMIN];
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getUserById(id: string): User | undefined {
  return getUsers().find((u) => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(data: Omit<User, "id" | "createdAt">): User {
  const users = getUsers();
  const user: User = {
    ...data,
    id: `usr_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  saveUsers([...users, user]);
  return user;
}

export function updateUser(id: string, data: Partial<User>): User | null {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...data };
  saveUsers(users);
  return users[idx];
}

export function deleteUser(id: string): boolean {
  const users = getUsers();
  const filtered = users.filter((u) => u.id !== id);
  if (filtered.length === users.length) return false;
  saveUsers(filtered);
  return true;
}

export function getFiscales(): User[] {
  return getUsers().filter((u) => u.role === "FISCAL" && u.active);
}

// ---- Sumarios ----

export function getSumarios(): Sumario[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(SUMARIOS_KEY);
  return raw ? (JSON.parse(raw) as Sumario[]) : [];
}

export function saveSumarios(sumarios: Sumario[]): void {
  localStorage.setItem(SUMARIOS_KEY, JSON.stringify(sumarios));
}

export function createSumario(data: Omit<Sumario, "id" | "createdAt">): Sumario {
  const sumarios = getSumarios();
  const sumario: Sumario = {
    ...data,
    id: `sum_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  saveSumarios([...sumarios, sumario]);
  return sumario;
}

export function getSumarioById(id: string): Sumario | undefined {
  return getSumarios().find((s) => s.id === id);
}

// ---- Session ----

export function saveSession(session: Session): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? (JSON.parse(raw) as Session) : null;
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
