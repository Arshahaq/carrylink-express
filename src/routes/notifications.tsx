import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, CheckCheck, Package, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useAuth";
import { markAllRead, markRead } from "@/services/notificationService";
import { useAppState } from "@/services/store";

export const Route = createFileRoute("/notifications")({
  component: NotificationsRoute,
});

function NotificationsRoute() {
  const state = useAppState();
  const user = useCurrentUser();
  const [filter, setFilter] = useState<"all" | "unread" | "shipment" | "security" | "system">("all");
  const notifications = useMemo(() => {
    const own = user ? state.notifications.filter((notification) => notification.userId === user.id) : [];
    return own.filter((notification) => {
      if (filter === "unread") return !notification.read;
      if (filter === "shipment") return ["package", "flight", "location", "otp"].includes(notification.icon);
      if (filter === "security") return ["warning", "verified"].includes(notification.icon);
      if (filter === "system") return notification.icon === "message";
      return true;
    });
  }, [filter, state.notifications, user]);

  return (
    <RequireAuth>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          </div>
          <Button variant="outline" onClick={() => user && markAllRead(user.id)}><CheckCheck className="size-4" aria-hidden />Mark all read</Button>
        </div>

        <div className="card-soft p-6">
          <div className="flex flex-wrap gap-2">{(["all", "unread", "shipment", "security", "system"] as const).map((option) => <Button key={option} size="sm" variant={filter === option ? "secondary" : "ghost"} onClick={() => setFilter(option)}>{option[0].toUpperCase() + option.slice(1)}</Button>)}</div>
          <div className="mt-5 space-y-3">{notifications.length === 0 ? <div className="rounded-xl border border-dashed border-border p-8 text-center"><Bell className="mx-auto size-8 text-muted-foreground" /><p className="mt-3 text-sm text-muted-foreground">No notifications in this view.</p></div> : notifications.map((notification) => <div key={notification.id} className={`flex gap-3 rounded-xl border p-4 ${notification.read ? "border-border bg-surface" : "border-accent/30 bg-accent-soft"}`}><span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-background text-accent">{notification.icon === "warning" ? <ShieldAlert className="size-4" aria-hidden /> : <Package className="size-4" aria-hidden />}</span><div className="min-w-0 flex-1"><div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"><p className="font-semibold">{notification.title}</p><span className="text-xs text-muted-foreground">{new Date(notification.createdAt).toLocaleString()}</span></div><p className="mt-1 text-sm text-muted-foreground">{notification.body}</p><div className="mt-2 flex gap-2">{notification.link ? <Link to={notification.link as never} onClick={() => markRead(notification.id)} className="text-xs font-semibold text-accent hover:underline">Open related view</Link> : null}{!notification.read ? <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => markRead(notification.id)}>Mark read</Button> : null}</div></div></div>)}</div>
        </div>
      </div>
    </RequireAuth>
  );
}
