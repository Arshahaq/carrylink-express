import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, FileQuestion, X } from "lucide-react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useAppState } from "@/services/store";
import { approveShipment, rejectShipment, requestInformation } from "@/services/adminService";

export const Route = createFileRoute("/admin/verification")({
  component: VerificationCenter,
});

function VerificationCenter() {
  const state = useAppState();
  const pending = state.shipments.filter((shipment) => shipment.status === "verification-required" || shipment.eligibility.status === "review");
  const recentlyVerified = state.shipments.filter((shipment) => shipment.custody.some((event) => ["Verification Approved", "Verification Requested", "Verification Rejected", "Verification Cleared"].includes(event.label))).slice(0, 8);

  return <RequireAuth requireMode="admin"><div className="space-y-6"><div><p className="text-sm font-medium text-muted-foreground">Review Center</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Verification Center</h1><p className="mt-2 text-muted-foreground">Demo Verification — Not connected to government, customs or airline systems.</p></div><section className="space-y-3"><div className="flex items-center gap-2"><FileQuestion className="size-5 text-warning" aria-hidden /><h2 className="text-xl font-bold">Pending Verification <span className="text-muted-foreground">({pending.length})</span></h2></div>{pending.length === 0 ? <div className="card-soft p-6 text-sm text-muted-foreground">No shipments are waiting for review.</div> : pending.map((shipment) => <VerificationCard key={shipment.id} shipment={shipment} pending />)}</section><section className="space-y-3"><h2 className="text-xl font-bold">Recently Verified</h2>{recentlyVerified.length === 0 ? <div className="card-soft p-6 text-sm text-muted-foreground">No verification decisions recorded yet.</div> : recentlyVerified.map((shipment) => <VerificationCard key={shipment.id} shipment={shipment} />)}</section></div></RequireAuth>;
}

function VerificationCard({ shipment, pending }: { shipment: ReturnType<typeof useAppState>["shipments"][number]; pending?: boolean }) {
  return <div className="card-soft p-5"><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><Link to="/shipments/$shipmentId" params={{ shipmentId: shipment.id }} className="text-sm font-semibold text-accent hover:underline">{shipment.code}</Link><h3 className="mt-1 text-lg font-bold">{shipment.item.name}</h3><p className="mt-1 text-sm text-muted-foreground">{shipment.item.category} · {shipment.route.fromCity} → {shipment.route.toCity}</p><p className="mt-1 text-sm text-muted-foreground">Sender: {shipment.senderName} · Traveler: {shipment.travelerName ?? "Not assigned"}</p><p className="mt-3 text-sm">Reason: <span className="text-muted-foreground">{shipment.eligibility.reasons.join(" ") || shipment.adminNote || "Manual review required."}</span></p></div><div className="flex flex-wrap items-center gap-2"><StatusBadge status={shipment.status} /><span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold capitalize">{shipment.eligibility.status}</span></div></div>{pending ? <div className="mt-5 flex flex-wrap gap-2"><Button size="sm" onClick={() => approveShipment(shipment.id)}><Check className="size-4" aria-hidden />Approve Demo Verification</Button><Button size="sm" variant="outline" onClick={() => requestInformation(shipment.id)}>Request More Information</Button><Button size="sm" variant="ghost" onClick={() => rejectShipment(shipment.id)}><X className="size-4" aria-hidden />Reject</Button></div> : <p className="mt-4 text-sm font-medium text-success">Decision recorded in shared shipment timeline.</p>}</div>;
}
