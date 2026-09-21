import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, CircleDashed, ShieldCheck } from "lucide-react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { shipmentById } from "@/services/shipmentService";
import { useAppState } from "@/services/store";

export const Route = createFileRoute("/shipments/$shipmentId")({
  component: ShipmentDetailRoute,
});

function ShipmentDetailRoute() {
  const { shipmentId } = Route.useParams();
  const shipment = shipmentById(shipmentId);
  const state = useAppState();

  if (!shipment) {
    return (
      <RequireAuth>
        <div className="space-y-6">
          <div className="card-soft p-8 md:p-10">
            <h1 className="text-3xl font-bold tracking-tight">Shipment Not Found</h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
              This shipment could not be found in the current AIRBRIDGE demo state.
            </p>
            <Button asChild className="mt-6">
              <Link to="/sender/dashboard">
                <ArrowLeft className="size-4" aria-hidden />
                Back to dashboard
              </Link>
            </Button>
          </div>
        </div>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Shipment Overview</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">{shipment.code}</h1>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/sender/shipments">
                <ArrowLeft className="size-4" aria-hidden />
                My Shipments
              </Link>
            </Button>
            {shipment.status === "matched" || shipment.status === "handover-pending" ? (
              <Button asChild>
                <Link to="/shipments/$shipmentId/handover" params={{ shipmentId: shipment.id }}>Secure Handover</Link>
              </Button>
            ) : null}
            {shipment.status === "in-transit" || shipment.status === "arrived" ? (
              <Button asChild>
                <Link to="/shipments/$shipmentId/delivery" params={{ shipmentId: shipment.id }}>Confirm Delivery</Link>
              </Button>
            ) : null}
            <StatusBadge status={shipment.status} />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <section className="space-y-6">
            <div className="card-soft p-6">
              <h2 className="text-xl font-bold">Shipment details</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Item</p>
                  <p className="mt-1 text-lg font-semibold">{shipment.item.name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</p>
                  <p className="mt-1 text-lg font-semibold capitalize">{shipment.item.category}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Origin</p>
                  <p className="mt-1 text-lg font-semibold">{shipment.route.fromCity}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Destination</p>
                  <p className="mt-1 text-lg font-semibold">{shipment.route.toCity}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Weight</p>
                  <p className="mt-1 text-lg font-semibold">{shipment.item.weightKg} kg</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Declared Value</p>
                  <p className="mt-1 text-lg font-semibold">₹{shipment.item.valueInr.toLocaleString("en-IN")}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Created</p>
                  <p className="mt-1 text-lg font-semibold">{new Date(shipment.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recipient</p>
                  <p className="mt-1 text-lg font-semibold">{shipment.recipientName}</p>
                </div>
              </div>
            </div>

            <div className="card-soft p-6">
              <h2 className="text-xl font-bold">Timeline</h2>
              <div className="mt-5 space-y-4">
                {shipment.custody.map((event) => (
                  <div key={event.id} className="flex gap-3">
                    <div className="mt-1 flex flex-col items-center">
                      <span
                        className={`grid size-6 place-items-center rounded-full border ${
                          event.status === "done"
                            ? "border-success bg-success-soft text-success"
                            : event.status === "current"
                              ? "border-accent bg-accent-soft text-accent"
                              : "border-border bg-muted text-muted-foreground"
                        }`}
                      >
                        {event.status === "done" ? <Check className="size-3.5" aria-hidden /> : <CircleDashed className="size-3.5" aria-hidden />}
                      </span>
                      {event.status !== "upcoming" ? <span className="mt-2 h-8 w-px bg-border" aria-hidden /> : null}
                    </div>
                    <div className="flex-1 rounded-xl border border-border bg-surface p-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="font-semibold">{event.label}</p>
                        <span className="text-xs text-muted-foreground">{event.method}</span>
                      </div>
                      {event.timestamp ? <p className="mt-2 text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</p> : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="card-soft p-6">
              <h2 className="text-xl font-bold">Traveler</h2>
              {shipment.travelerName ? (
                <div className="mt-4 space-y-3 text-sm">
                  <p className="font-semibold">{shipment.travelerName}</p>
                  <div className="flex items-center gap-2 text-success">
                    <ShieldCheck className="size-4" aria-hidden />
                    Demo identity verified
                  </div>
                  <p>Flight: {state.flights.find((flight) => flight.id === shipment.flightId)?.flightNumber ?? shipment.flightId ?? "Scheduled"}</p>
                  <p>Reward: ₹{shipment.rewardInr.toLocaleString("en-IN")}</p>
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-dashed border-border bg-surface p-4 text-sm text-muted-foreground">
                  Waiting for traveler.
                </div>
              )}
            </div>

            <div className="card-soft p-6">
              <h2 className="text-xl font-bold">Security</h2>
              <div className="mt-4 space-y-3 text-sm">
                <SecurityRow label="Sender verification" complete={Boolean(shipment.senderId)} />
                <SecurityRow label="Traveler verification" complete={Boolean(shipment.travelerId)} />
                <SecurityRow label="Eligibility checked" complete={shipment.eligibility.status === "eligible"} />
                <SecurityRow label="Handover OTP confirmed" complete={shipment.custody.some((event) => event.label === "Handover Confirmed")} />
                <SecurityRow label="Delivery OTP confirmed" complete={shipment.custody.some((event) => event.label === "Delivery Confirmed")} />
                <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3 py-2">
                  <span>Route</span>
                  <span className="font-medium">{shipment.route.fromCity.split(",")[0]} → {shipment.route.toCity.split(",")[0]}</span>
                </div>
                <p className="text-xs text-muted-foreground">Demo Verification · OTP credentials are simulated for this prototype.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </RequireAuth>
  );
}

function SecurityRow({ label, complete }: { label: string; complete: boolean }) {
  return <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3 py-2"><span>{label}</span><span className={complete ? "font-medium text-success" : "font-medium text-muted-foreground"}>{complete ? "✓ Confirmed" : "Pending"}</span></div>;
}
