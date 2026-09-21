import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Package } from "lucide-react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useAuth";
import { useAppState } from "@/services/store";

export const Route = createFileRoute("/traveler/deliveries")({
  component: TravelerDeliveries,
});

function TravelerDeliveries() {
  const user = useCurrentUser();
  const state = useAppState();
  const accepted = user
    ? state.shipments.filter((shipment) => shipment.travelerId === user.id && shipment.custody.some((event) => event.label === "Traveler Accepted"))
    : [];
  const active = accepted.filter((shipment) => shipment.status !== "delivered");
  const completed = accepted.filter((shipment) => shipment.status === "delivered");

  return (
    <RequireAuth requireMode="traveler">
      <div className="space-y-6">
        <div className="flex items-end justify-between gap-4"><div><p className="text-sm font-medium text-muted-foreground">Travel & Carry</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Active Deliveries</h1><p className="mt-2 text-muted-foreground">Shipments accepted for your flights. Handover actions arrive in Phase 4.</p></div><Button asChild variant="outline"><Link to="/traveler/dashboard"><ArrowLeft className="size-4" aria-hidden />Dashboard</Link></Button></div>
        <DeliverySection title="Active" shipments={active} />
        <DeliverySection title="Completed" shipments={completed} />
      </div>
    </RequireAuth>
  );
}

function DeliverySection({ title, shipments }: { title: string; shipments: ReturnType<typeof useAppState>["shipments"] }) {
  return <section className="space-y-3"><h2 className="text-xl font-bold">{title}</h2>{shipments.length === 0 ? <div className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">No {title.toLowerCase()} deliveries.</div> : shipments.map((shipment) => <Link key={shipment.id} to="/shipments/$shipmentId" params={{ shipmentId: shipment.id }} className="card-soft block p-5 hover:border-accent/30"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><p className="text-sm font-semibold text-accent">{shipment.code}</p><h3 className="mt-1 font-semibold">{shipment.item.name}</h3><p className="mt-1 text-sm text-muted-foreground">{shipment.route.fromCity} → {shipment.route.toCity} · {shipment.item.weightKg} kg</p><p className="mt-1 text-sm text-muted-foreground">Sender: {shipment.senderName} · Flight: {shipment.flightId}</p></div><div className="flex items-center gap-2 text-sm font-semibold text-success"><CheckCircle2 className="size-4" aria-hidden />{title === "Active" ? "View Shipment" : "Delivered"}</div></div></Link>)}</section>;
}
