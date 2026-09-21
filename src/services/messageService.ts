import { getState, setState, uid } from "./store";
import { detectMessageRisk } from "./verificationService";
import type { Message } from "@/types";

export function threadsFor(userId: string) {
  return getState().threads.filter((t) => t.participantIds.includes(userId));
}

export function messagesFor(threadId: string) {
  return getState()
    .messages.filter((m) => m.threadId === threadId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function sendMessage(threadId: string, authorId: string, body: string) {
  const author = getState().users.find((u) => u.id === authorId);
  const risk = detectMessageRisk(body);
  const message: Message = {
    id: uid("m"),
    threadId,
    authorId,
    authorName: author?.name ?? "You",
    body,
    createdAt: new Date().toISOString(),
    flagged: risk.flagged,
  };
  setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
  return { message, risk };
}

export function reportUser(threadId: string) {
  setState((prev) => ({
    ...prev,
    threads: prev.threads.map((t) => (t.id === threadId ? { ...t, reported: true } : t)),
  }));
}

export function toggleBlock(threadId: string) {
  setState((prev) => ({
    ...prev,
    threads: prev.threads.map((t) => (t.id === threadId ? { ...t, blocked: !t.blocked } : t)),
  }));
}
