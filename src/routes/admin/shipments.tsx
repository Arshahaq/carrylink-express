import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, Lock, Search, ShieldAlert, Unlock } from "lucide-react";
import { useMemo, useState } from "react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { RiskBadge, StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/services/store";
import { freezeShipment, riskProfile, unfreezeShipment } from "@/services/adminService";

export const Route = createFileRoute("/admin/shipments")({
  component: AdminShipments,
});

const filters = ["all", "pending", "awaiting-match", "accepted", "handover-pending", "in-transit", "delivered", "verification-required", "risk"] as const;

function AdminShipments() {
  const state = useAppState();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const visible = useMemo(() => state.shipments.filter((shipment) => {
    const text = [shipment.code, shipment.item.name, shipment.senderName, shipment.travelerName ?? "", shipment.route.toCity].join(" ").toLowerCase();
    const matchesQuery = !query.trim() || text.includes(query.trim().toLowerCase());
    const matchesFilter = filter === "all" || filter === "risk" ? filter === "all" ? true : riskProfile(shipment).risk !== "low" : filter === "accepted" ? ["matched", "handover-pending"].includes(shipment.status) : shipment.status === filter;
    return matchesQuery && matchesFilter;
  }), [filter, query, state.shipments]);

  return <RequireAuth requireMode="admin"><div className="space-y-6"><div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="text-sm font-medium text-muted-foreground">Shipment Console</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Shipment Operations</h1><p className="mt-2 text-muted-foreground">Review the same shipments used by senders and travelers.</p></div><span className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground">{visible.length} visible</span></div>
    <div className="card-soft p-4"><div className="flex flex-col gap-3 lg:flex-row"><div className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search shipment, sender, traveler, destination or item" className="pl-9" /></div><select value={filter} onChange={(event) => setFilter(event.target.value as (typeof filters)[number])} className="h-9 rounded-md border border-input bg-background px-3 text-sm" aria-label="Filter shipments">{filters.map((option) => <option key={option} value={option}>{option === "all" ? "All shipments" : option.replaceAll("-", " ")}</option>)}</select></div></div>
    <div className="card-soft overflow-hidden"><div className="overflow-x-auto"><table className="w-full min-w-[1100px] text-sm"><thead className="border-b border-border bg-muted/40"><tr>{["Shipment", "Item", "Sender", "Traveler", "Route", "Flight", "Status", "Eligibility", "Risk", "Updated", "Actions"].map((heading) => <th key={heading} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{heading}</th>)}</tr></thead><tbody>{visible.map((shipment) => { const risk = riskProfile(shipment); return <tr key={shipment.id} className="border-b border-border last:border-0"><td className="px-4 py-4"><Link to="/shipments/$shipmentId" params={{ shipmentId: shipment.id }} className="font-semibold text-accent hover:underline">{shipment.code}</Link></td><td className="px-4 py-4">{shipment.item.name}<span className="block text-xs capitalize text-muted-foreground">{shipment.item.category}</span></td><td className="px-4 py-4">{shipment.senderName}</td><td className="px-4 py-4">{shipment.travelerName ?? "—"}</td><td className="px-4 py-4">{shipment.route.fromCity.split(",")[0]} → {shipment.route.toCity.split(",")[0]}</td><td className="px-4 py-4">{shipment.flightId ?? "—"}</td><td className="px-4 py-4"><StatusBadge status={shipment.status} /></td><td className="px-4 py-4 capitalize">{shipment.eligibility.status}</td><td className="px-4 py-4"><RiskBadge risk={risk.risk} /></td><td className="px-4 py-4 whitespace-nowrap text-xs text-muted-foreground">{new Date(shipment.updatedAt).toLocaleDateString()}</td><td className="px-4 py-4"><div className="flex gap-1"><Button asChild size="icon" variant="ghost" aria-label="View shipment"><Link to="/shipments/$shipmentId" params={{ shipmentId: shipment.id }}><Eye className="size-4" aria-hidden /></Link></Button>{shipment.status === "frozen" ? <Button size="icon" variant="ghost" aria-label="Unfreeze shipment" onClick={() => unfreezeShipment(shipment.id)}><Unlock className="size-4" aria-hidden /></Button> : shipment.status !== "delivered" ? <Button size="icon" variant="ghost" aria-label="Freeze shipment" onClick={() => freezeShipment(shipment.id)}><Lock className="size-4" aria-hidden /></Button> : null}<Button asChild size="icon" variant="ghost" aria-label="View risk"><Link to="/admin/risk"><ShieldAlert className="size-4" aria-hidden /></Link></Button></div></td></tr>; })}</tbody></table></div>{visible.length === 0 ? <p className="p-8 text-center text-sm text-muted-foreground">No shipments match this filter.</p> : null}</div>
  </div></RequireAuth>;
}
