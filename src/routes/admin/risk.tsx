import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Lock, ShieldAlert } from "lucide-react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { RiskBadge, StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/services/store";
import { freezeShipment, markRiskReviewed, riskProfile, unfreezeShipment } from "@/services/adminService";

export const Route = createFileRoute("/admin/risk")({
  component: RiskCenter,
});

function RiskCenter() {
  const state = useAppState();
  const flagged = state.shipments.filter((shipment) => riskProfile(shipment).risk !== "low");
  const counts = ["low", "medium", "high"].map((risk) => ({ risk, value: state.shipments.filter((shipment) => riskProfile(shipment).risk === risk).length }));
  return <RequireAuth requireMode="admin"><div className="space-y-6"><div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="text-sm font-medium text-muted-foreground">Risk Review</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Risk Center</h1><p className="mt-2 text-muted-foreground">Deterministic demo risk indicators from current shipment data.</p></div><ShieldAlert className="size-8 text-warning" aria-hidden /></div><div className="grid gap-4 sm:grid-cols-3">{counts.map(({ risk, value }) => <div key={risk} className="card-soft p-5"><RiskBadge risk={risk as "low" | "medium" | "high"} /><p className="mt-3 text-3xl font-bold">{value}</p></div>)}</div><div className="space-y-3">{flagged.length === 0 ? <div className="card-soft p-8 text-center text-sm text-muted-foreground">No elevated risk shipments.</div> : flagged.map((shipment) => { const profile = riskProfile(shipment); const lastEvent = shipment.custody.filter((event) => event.status !== "upcoming").at(-1); return <div key={shipment.id} className="card-soft p-5"><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><Link to="/shipments/$shipmentId" params={{ shipmentId: shipment.id }} className="text-sm font-semibold text-accent hover:underline">{shipment.code}</Link><h2 className="mt-1 text-lg font-bold">{shipment.item.name}</h2><p className="mt-1 text-sm text-muted-foreground">{shipment.senderName} · {shipment.travelerName ?? "No traveler"}</p><p className="mt-1 text-sm text-muted-foreground">{shipment.route.fromCity} → {shipment.route.toCity}</p><p className="mt-3 text-sm">Reason: <span className="text-muted-foreground">{profile.reason}</span></p><p className="mt-1 text-xs text-muted-foreground">Last event: {lastEvent?.label ?? "No event"}</p></div><div className="flex flex-wrap gap-2"><RiskBadge risk={profile.risk} /><StatusBadge status={shipment.status} /></div></div><div className="mt-5 flex flex-wrap gap-2"><Button asChild size="sm" variant="outline"><Link to="/shipments/$shipmentId" params={{ shipmentId: shipment.id }}>Review Shipment</Link></Button>{shipment.status === "frozen" ? <Button size="sm" onClick={() => unfreezeShipment(shipment.id)}>Unfreeze Shipment</Button> : <Button size="sm" variant="outline" onClick={() => freezeShipment(shipment.id)}><Lock className="size-4" aria-hidden />Freeze Shipment</Button>}<Button size="sm" variant="ghost" onClick={() => markRiskReviewed(shipment.id)}><Check className="size-4" aria-hidden />Mark Reviewed</Button></div></div>; })}</div></div></RequireAuth>;
}
