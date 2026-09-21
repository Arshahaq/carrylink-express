import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser, useHydrated } from "@/hooks/useAuth";
import { setMode } from "@/services/authService";
import { useAppState } from "@/services/store";
import type { Mode } from "@/types";

function ShellSkeleton() {
  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="mx-auto max-w-5xl space-y-4">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  );
}

/**
 * Client-side guard. Auth state lives in localStorage for this prototype, so the
 * check runs after hydration and redirects unauthenticated visitors to /login.
 */
export function RequireAuth({
  children,
  requireMode,
}: {
  children: React.ReactNode;
  requireMode?: Mode;
}) {
  const hydrated = useHydrated();
  const user = useCurrentUser();
  const state = useAppState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      navigate({ to: "/login", replace: true });
      return;
    }
    if (requireMode === "admin" && user.role !== "admin") {
      navigate({ to: "/select-mode", replace: true });
      return;
    }
    if (user.role === "admin" && state.mode !== "admin") {
      setMode("admin");
      return;
    }
    if (requireMode && requireMode !== "admin" && state.mode !== requireMode) {
      setMode(requireMode);
    }
  }, [hydrated, user, requireMode, state.mode, navigate]);

  if (!hydrated || !user) return <ShellSkeleton />;
  if (requireMode === "admin" && user.role !== "admin") return <ShellSkeleton />;

  return <AppShell>{children}</AppShell>;
}
