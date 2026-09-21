import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, LogOut, Menu, Package, Plane, ShieldCheck, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { GlobalSearch } from "@/components/layout/GlobalSearch";
import { navForMode } from "@/components/layout/navConfig";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logout } from "@/services/authService";
import { unreadCount } from "@/services/notificationService";
import { useAppState } from "@/services/store";
import { useCurrentUser } from "@/hooks/useAuth";
import type { Mode } from "@/types";

function ModeBadge({ mode }: { mode: Mode | null }) {
  const config =
    mode === "admin"
      ? { icon: ShieldCheck, label: "Operations" }
      : mode === "traveler"
        ? { icon: Plane, label: "Traveler" }
        : { icon: Package, label: "Sender" };
  const Icon = config.icon;
  return (
    <span className="inline-flex items-center gap-2 text-sm font-semibold">
      <Icon className="size-4 text-accent" aria-hidden />
      {config.label}
    </span>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const state = useAppState();
  const user = useCurrentUser();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [menuOpen, setMenuOpen] = useState(false);

  const items = navForMode(state.mode);
  const unread = user ? unreadCount(user.id) : 0;
  const isActive = (to: string) => pathname === to || (to !== "/admin" && pathname.startsWith(`${to}/`));

  const sidebar = (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link to="/" className="focus-ring rounded-lg px-1" onClick={() => setMenuOpen(false)}>
        <Logo subtitle={state.mode === "admin" ? "Operations Console" : undefined} />
      </Link>

      <nav aria-label="Primary" className="flex-1">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "focus-ring flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive(item.to)
                    ? "bg-accent-soft text-accent"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
                aria-current={isActive(item.to) ? "page" : undefined}
              >
                <item.icon className="size-4.5 shrink-0" aria-hidden />
                <span className="truncate">{item.label}</span>
                {item.to === "/notifications" && unread > 0 ? (
                  <span className="ml-auto rounded-full bg-accent px-1.5 py-0.5 text-[11px] font-bold text-accent-foreground">
                    {unread}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="rounded-xl border border-border bg-surface p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Mode</p>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <ModeBadge mode={state.mode} />
          {state.mode !== "admin" ? (
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2 text-xs"
              onClick={() => {
                setMenuOpen(false);
                navigate({ to: "/select-mode" });
              }}
            >
              Switch
            </Button>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-border pt-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {user?.avatarInitials ?? "AB"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{user?.name ?? "Guest"}</p>
          <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
        </div>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Log out"
          onClick={() => {
            logout();
            navigate({ to: "/" });
          }}
        >
          <LogOut className="size-4" aria-hidden />
        </Button>
      </div>
    </div>
  );

  const mobileItems = items.filter((i) => i.primary).slice(0, 4);

  return (
    <div className="min-h-screen bg-surface">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border bg-sidebar lg:block">
        {sidebar}
      </aside>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-foreground/30"
            onClick={() => setMenuOpen(false)}
          />
          <div className="animate-fade absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-sidebar shadow-[var(--shadow-lift)]">
            <div className="flex justify-end p-2">
              <Button size="icon" variant="ghost" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
                <X className="size-4" aria-hidden />
              </Button>
            </div>
            {sidebar}
          </div>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
            <Button
              size="icon"
              variant="ghost"
              className="lg:hidden"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="size-5" aria-hidden />
            </Button>
            <div className="lg:hidden">
              <Logo showWord={false} />
            </div>
            <GlobalSearch className="hidden max-w-md flex-1 sm:block" />
            <div className="ml-auto flex items-center gap-1">
              <Link
                to="/notifications"
                className="focus-ring relative grid size-10 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
              >
                <Bell className="size-5" aria-hidden />
                {unread > 0 ? (
                  <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                    {unread}
                  </span>
                ) : null}
              </Link>
              <Link
                to="/profile"
                className="focus-ring grid size-9 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
                aria-label="Profile"
              >
                {user?.avatarInitials ?? "AB"}
              </Link>
            </div>
          </div>
          <div className="px-4 pb-3 sm:hidden">
            <GlobalSearch />
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:pb-12">{children}</main>
      </div>

      <nav
        aria-label="Quick navigation"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur lg:hidden"
      >
        <ul className="grid grid-cols-4">
          {mobileItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                  isActive(item.to) ? "text-accent" : "text-muted-foreground",
                )}
              >
                <item.icon className="size-5" aria-hidden />
                <span className="max-w-full truncate px-1">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
