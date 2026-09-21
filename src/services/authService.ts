import { getState, setState } from "./store";
import type { Mode, User } from "@/types";

export interface LoginResult {
  ok: boolean;
  error?: string;
  user?: User;
}

export const DEMO_ACCOUNTS = [
  {
    label: "Sender / Traveler",
    name: "Shahan Haq",
    email: "sender@airbridge.demo",
    password: "Demo@123",
  },
  {
    label: "Traveler / Sender",
    name: "Rahul Sharma",
    email: "traveler@airbridge.demo",
    password: "Demo@123",
  },
];

export function login(email: string, password: string): LoginResult {
  const user = getState().users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
  );
  if (!user) return { ok: false, error: "No account found with that email address." };
  if (user.password !== password) return { ok: false, error: "Incorrect password. Check the demo credentials below." };
  if (user.status === "suspended") return { ok: false, error: "This account is suspended. Contact operations." };

  setState((prev) => ({
    ...prev,
    currentUserId: user.id,
    mode: user.role === "admin" ? "admin" : null,
  }));
  return { ok: true, user };
}

export function logout() {
  setState((prev) => ({ ...prev, currentUserId: null, mode: null }));
}

export function setMode(mode: Mode) {
  setState((prev) => ({ ...prev, mode }));
}

export function currentUser(): User | null {
  const s = getState();
  return s.users.find((u) => u.id === s.currentUserId) ?? null;
}

export function updateProfile(patch: Partial<User>) {
  setState((prev) => ({
    ...prev,
    users: prev.users.map((u) => (u.id === prev.currentUserId ? { ...u, ...patch } : u)),
  }));
}
