import { createFileRoute, Link } from "@tanstack/react-router";
import { Flag, Search, ShieldCheck, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/services/store";
import { toggleUserFlag } from "@/services/adminService";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

const filters = ["all", "senders", "travelers", "admins", "verified", "pending", "flagged"] as const;

function AdminUsers() {
  const state = useAppState();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const users = useMemo(() => state.users.filter((user) => {
    const haystack = `${user.name} ${user.email} ${user.role}`.toLowerCase();
    if (query.trim() && !haystack.includes(query.trim().toLowerCase())) return false;
    if (filter === "senders") return user.modes.includes("sender");
    if (filter === "travelers") return user.modes.includes("traveler");
    if (filter === "admins") return user.role === "admin";
    if (filter === "verified") return user.identityVerification === "demo-verified";
    if (filter === "pending") return user.identityVerification === "pending";
    if (filter === "flagged") return Boolean(user.demoFlagged);
    return true;
  }), [filter, query, state.users]);

  return <RequireAuth requireMode="admin"><div className="space-y-6"><div><p className="text-sm font-medium text-muted-foreground">User Console</p><h1 className="mt-2 text-3xl font-bold tracking-tight">User Management</h1><p className="mt-2 text-muted-foreground">Demo account visibility and verification overview.</p></div><div className="card-soft p-4"><div className="flex flex-col gap-3 md:flex-row"><div className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email or role" className="pl-9" /></div><select value={filter} onChange={(event) => setFilter(event.target.value as (typeof filters)[number])} className="h-9 rounded-md border border-input bg-background px-3 text-sm" aria-label="Filter users">{filters.map((option) => <option key={option} value={option}>{option.replace("pending", "pending verification")}</option>)}</select></div></div><div className="grid gap-4 lg:grid-cols-2">{users.map((user) => { const shipments = state.shipments.filter((shipment) => shipment.senderId === user.id || shipment.travelerId === user.id); const flights = state.flights.filter((flight) => flight.travelerId === user.id).length; const riskFlags = shipments.filter((shipment) => shipment.flagged || shipment.risk !== "low").length; return <div key={user.id} className="card-soft p-5"><div className="flex items-start justify-between gap-3"><div className="flex gap-3"><div className="grid size-10 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{user.avatarInitials}</div><div><h2 className="font-bold">{user.name}</h2><p className="text-sm text-muted-foreground">{user.email}</p><p className="mt-1 text-xs capitalize text-muted-foreground">{user.role} · {user.status}</p></div></div><div className="flex gap-2">{user.identityVerification === "demo-verified" ? <ShieldCheck className="size-5 text-success" aria-label="Demo verified" /> : null}{user.demoFlagged ? <Flag className="size-5 text-destructive" aria-label="Flagged demo account" /> : null}</div></div><div className="mt-5 grid grid-cols-3 gap-3 text-sm"><Metric label="Shipments" value={shipments.length} /><Metric label="Flights" value={flights} /><Metric label="Risk flags" value={riskFlags} /></div><div className="mt-5 flex flex-wrap gap-2"><Button asChild size="sm" variant="outline"><Link to="/profile"><UserRound className="size-4" aria-hidden />View Profile</Link></Button><Button asChild size="sm" variant="outline"><Link to="/admin/shipments">View Shipments</Link></Button><Button size="sm" variant={user.demoFlagged ? "secondary" : "ghost"} onClick={() => toggleUserFlag(user.id)}><Flag className="size-4" aria-hidden />{user.demoFlagged ? "Unflag Demo Account" : "Flag Demo Account"}</Button></div></div>; })}</div>{users.length === 0 ? <div className="card-soft p-8 text-center text-sm text-muted-foreground">No users match this filter.</div> : null}</div></RequireAuth>;
}

function Metric({ label, value }: { label: string; value: number }) { return <div className="rounded-lg bg-surface p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-lg font-bold">{value}</p></div>; }
