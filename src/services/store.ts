import { useSyncExternalStore } from "react";
import { initialState } from "@/data/seed";
import type { AppState } from "@/types";

const STORAGE_KEY = "airbridge.state.v1";

let state: AppState = initialState;
let hydrated = false;
const listeners = new Set<() => void>();

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable — demo continues in memory */
  }
}

function emit() {
  listeners.forEach((l) => l());
}

export function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppState>;
      state = { ...initialState, ...parsed };
      emit();
    }
  } catch {
    /* ignore corrupt state */
  }
}

export function getState(): AppState {
  return state;
}

export function getServerState(): AppState {
  return initialState;
}

export function setState(updater: (prev: AppState) => AppState) {
  state = updater(state);
  persist();
  emit();
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function resetState() {
  state = initialState;
  persist();
  emit();
}

export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, getState, getServerState);
}

export function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
