import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Ban, MessageSquare, Send, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/hooks/useAuth";
import { messagesFor, sendMessage, threadsFor, toggleBlock } from "@/services/messageService";
import { useAppState } from "@/services/store";

export const Route = createFileRoute("/messages")({
  component: MessagesRoute,
});

function MessagesRoute() {
  const user = useCurrentUser();
  useAppState();
  const threads = user ? threadsFor(user.id) : [];
  const [activeId, setActiveId] = useState(threads[0]?.id ?? "");
  const [body, setBody] = useState("");
  const activeThread = threads.find((thread) => thread.id === activeId) ?? threads[0];
  const messages = activeThread ? messagesFor(activeThread.id) : [];
  useEffect(() => { if (!activeId && threads[0]) setActiveId(threads[0].id); }, [activeId, threads]);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !activeThread || !body.trim() || activeThread.blocked) return;
    sendMessage(activeThread.id, user.id, body.trim());
    setBody("");
  }

  return <RequireAuth><div className="space-y-6"><div><p className="text-sm font-medium text-muted-foreground">Secure Chat · Prototype</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Messages</h1><p className="mt-2 text-muted-foreground">Sender and traveler conversations associated with shipments.</p></div>{threads.length === 0 ? <div className="card-soft p-8 text-center"><MessageSquare className="mx-auto size-8 text-muted-foreground" /><h2 className="mt-4 text-lg font-semibold">No conversations yet</h2><p className="mt-2 text-sm text-muted-foreground">A conversation appears after a traveler is matched to a shipment.</p></div> : <div className="grid min-h-[560px] gap-4 lg:grid-cols-[280px_1fr]"><aside className="card-soft p-3"><h2 className="px-3 py-2 text-sm font-bold">Conversations</h2><div className="space-y-1">{threads.map((thread) => <button key={thread.id} type="button" onClick={() => setActiveId(thread.id)} className={`w-full rounded-lg p-3 text-left ${activeThread?.id === thread.id ? "bg-accent-soft" : "hover:bg-muted"}`}><p className="truncate text-sm font-semibold">{thread.subject}</p><p className="mt-1 truncate text-xs text-muted-foreground">{thread.participantNames.filter((name) => name !== user?.name).join(", ")}</p></button>)}</div></aside><section className="card-soft flex min-h-[560px] flex-col p-5"><div className="flex items-start justify-between gap-3 border-b border-border pb-4"><div><h2 className="font-bold">{activeThread?.subject}</h2><p className="mt-1 text-xs text-muted-foreground">{activeThread?.participantNames.join(" · ")}</p></div><Button size="sm" variant="ghost" onClick={() => activeThread && toggleBlock(activeThread.id)}><Ban className="size-4" aria-hidden />{activeThread?.blocked ? "Unblock" : "Block"}</Button></div><div className="flex-1 space-y-3 overflow-y-auto py-5">{messages.map((message) => <div key={message.id} className={`max-w-[85%] rounded-xl border p-3 ${message.authorId === user?.id ? "ml-auto border-accent/20 bg-accent-soft" : "border-border bg-surface"}`}>{message.flagged ? <p className="mb-2 flex items-center gap-1 text-xs font-semibold text-warning"><AlertTriangle className="size-3.5" aria-hidden />Risk Detected · Automated demo risk detection</p> : null}<p className="text-sm">{message.body}</p><p className="mt-2 text-[11px] text-muted-foreground">{message.authorName} · {new Date(message.createdAt).toLocaleString()}</p></div>)}</div><form onSubmit={submit} className="border-t border-border pt-4"><Textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder={activeThread?.blocked ? "Conversation blocked" : "Write a message"} disabled={activeThread?.blocked} rows={3} /><div className="mt-3 flex items-center justify-between gap-3"><p className="flex items-center gap-1 text-xs text-muted-foreground"><ShieldCheck className="size-3.5" aria-hidden />Automated demo risk detection</p><Button type="submit" disabled={!body.trim() || activeThread?.blocked}><Send className="size-4" aria-hidden />Send</Button></div></form></section></div>}</div></RequireAuth>;
}
