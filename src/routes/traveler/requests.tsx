import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, ChevronRight, Package, Plane, X } from "lucide-react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useAuth";
import { useAppState } from "@/services/store";
import { acceptShipmentRequest, requestsForTraveler } from "@/services/travelerService";
import { declineRequest } from "@/services/shipmentService";

export const Route = createFileRoute("/traveler/requests")({
  component: TravelerRequests,
});

function TravelerRequests() {
  const user = useCurrentUser();
  useAppState();
  const navigate = useNavigate();
  const requests = user ? requestsForTraveler(user.id) : [];

  return (
    <RequireAuth requireMode="traveler">
      <div className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div><p className="text-sm font-medium text-muted-foreground">Travel & Carry</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Shipment Requests</h1><p className="mt-2 text-muted-foreground">Review eligible shipments matched to your verified flights.</p></div>
          <Button asChild variant="outline"><Link to="/traveler/dashboard"><ArrowLeft className="size-4" aria-hidden />Dashboard</Link></Button>
        </div>

        {requests.length === 0 ? (
          <div className="card-soft p-8 text-center"><Package className="mx-auto size-8 text-muted-foreground" /><h2 className="mt-4 text-lg font-semibold">No pending requests</h2><p className="mt-2 text-sm text-muted-foreground">Compatible sender requests will appear here when they match your flights.</p></div>
        ) : (
          <div className="space-y-4">
            {requests.map(({ shipment, flight, score }) => (
              <div key={shipment.id} className="card-soft p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Delivery Request</p>
                    <h2 className="mt-1 text-xl font-bold">{shipment.item.name}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{shipment.route.fromCity} → {shipment.route.toCity} · {shipment.item.weightKg} kg</p>
                  </div>
                  <span className="rounded-full bg-warning-soft px-2.5 py-1 text-xs font-semibold text-warning">PENDING</span>
                </div>
                <div className="mt-5 grid gap-3 text-sm md:grid-cols-4">
                  <p><span className="block text-xs text-muted-foreground">Sender</span><span className="font-medium">{shipment.senderName}</span></p>
                  <p><span className="block text-xs text-muted-foreground">Flight Match</span><span className="flex items-center gap-1 font-medium"><Plane className="size-3.5" aria-hidden />{flight.airline ?? "Flight"} {flight.flightNumber}</span></p>
                  <p><span className="block text-xs text-muted-foreground">Compatibility</span><span className="font-medium text-success">{score}% Demo Compatibility</span></p>
                  <p><span className="block text-xs text-muted-foreground">Eligibility</span><span className="font-medium text-success">GREEN · Eligible</span></p>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button asChild variant="outline" size="sm"><Link to="/shipments/$shipmentId" params={{ shipmentId: shipment.id }}>View Details<ChevronRight className="size-4" aria-hidden /></Link></Button>
                  <Button size="sm" onClick={() => { acceptShipmentRequest(shipment.id, user!.id, flight.id); navigate({ to: "/traveler/deliveries" }); }}><Check className="size-4" aria-hidden />Accept Request</Button>
                  <Button size="sm" variant="ghost" onClick={() => declineRequest(shipment.id, user!.id)}><X className="size-4" aria-hidden />Decline</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RequireAuth>
  );
}
