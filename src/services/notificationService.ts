import { getState, setState, uid } from "./store";
import type { Notification } from "@/types";

export function notify(
  userId: string,
  data: Pick<Notification, "icon" | "title" | "body"> & { link?: string },
) {
  const notification: Notification = {
    id: uid("n"),
    userId,
    read: false,
    createdAt: new Date().toISOString(),
    ...data,
  };
  setState((prev) => ({ ...prev, notifications: [notification, ...prev.notifications] }));
  return notification;
}

export function notificationsFor(userId: string) {
  return getState().notifications.filter((n) => n.userId === userId);
}

export function unreadCount(userId: string) {
  return notificationsFor(userId).filter((n) => !n.read).length;
}

export function markRead(id: string) {
  setState((prev) => ({
    ...prev,
    notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
  }));
}

export function markAllRead(userId: string) {
  setState((prev) => ({
    ...prev,
    notifications: prev.notifications.map((n) => (n.userId === userId ? { ...n, read: true } : n)),
  }));
}
