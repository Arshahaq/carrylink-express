import { useEffect, useState } from "react";
import { hydrate, useAppState } from "@/services/store";
import type { Mode, User } from "@/types";

export function useHydrated() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    hydrate();
    setReady(true);
  }, []);
  return ready;
}

export function useCurrentUser(): User | null {
  const state = useAppState();
  return state.users.find((u) => u.id === state.currentUserId) ?? null;
}

export function useMode(): Mode | null {
  return useAppState().mode;
}

export function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
