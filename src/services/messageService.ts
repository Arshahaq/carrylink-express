import { getState, setState, uid } from "./store";
import { notify } from "./notificationService";
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
    ...(risk.keyword ? { riskKeyword: risk.keyword } : {}),
  };
  setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
  if (risk.flagged) {
    const thread = getState().threads.find((candidate) => candidate.id === threadId);
    const shipment = thread ? getState().shipments.find((candidate) => candidate.code === thread.shipmentCode) : undefined;
    if (shipment) {
      setState((prev) => ({
        ...prev,
        shipments: prev.shipments.map((candidate) =>
          candidate.id === shipment.id
            ? { ...candidate, flagged: true, risk: candidate.risk === "high" ? "high" : "medium", riskReason: `Suspicious message phrase: ${risk.keyword}` }
            : candidate,
        ),
      }));
      notify("u-admin", {
        icon: "warning",
        title: "Risk detected in shipment chat",
        body: `${shipment.code} contains a suspicious phrase. Automated demo risk detection flagged the message.`,
        link: `/shipments/${shipment.id}`,
      });
    }
  }
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
