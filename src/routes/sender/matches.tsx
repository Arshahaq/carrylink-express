import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Plane, ShieldCheck, Sparkles } from "lucide-react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useAuth";
import { findMatches } from "@/services/matchingService";
import { requestHandover, shipmentsForSender } from "@/services/shipmentService";

export const Route = createFileRoute("/sender/matches")({
  component: SenderMatches,
});

function SenderMatches() {
  const user = useCurrentUser();
  const shipments = user ? shipmentsForSender(user.id) : [];
  const eligibleShipments = shipments.filter((s) => s.eligibility.status === "eligible");
  const navigate = useNavigate();

  return (
    <RequireAuth requireMode="sender">
      <div className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Traveler Matches</h1>
            <p className="mt-2 text-muted-foreground">Compatible verified travelers based on route and capacity.</p>
          </div>
          <Button asChild>
            <Link to="/sender/create">
              Create Shipment
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>

        {eligibleShipments.length === 0 ? (
          <div className="card-soft p-8 text-center">
            <Sparkles className="mx-auto size-8 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-semibold">No matchable shipments yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Create a shipment and complete the eligibility check to view compatible travelers.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {eligibleShipments.map((shipment) => {
              const matches = findMatches(shipment);
              return (
                <div key={shipment.id} className="card-soft p-5">
                  <div className="flex flex-col gap-3 border-b border-border pb-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-accent">{shipment.code}</p>
                      <h2 className="mt-1 text-xl font-bold">{shipment.item.name}</h2>
                    </div>
                    <StatusBadge status={shipment.status} />
                  </div>

                  {matches.length === 0 ? (
                    <div className="mt-4 rounded-xl border border-dashed border-border bg-surface p-4 text-sm text-muted-foreground">
                      No compatible verified travelers found for this route yet.
                    </div>
                  ) : (
                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      {matches.map((match) => (
                        <div key={`${shipment.id}-${match.flight.id}`} className="rounded-xl border border-border bg-surface p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-base font-semibold">{match.traveler.name}</p>
                              <p className="mt-1 inline-flex items-center gap-2 text-xs font-medium text-success">
                                <ShieldCheck className="size-3.5" aria-hidden />
                                Demo verified
                              </p>
                            </div>
                            <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">
                              {match.score}% match
                            </span>
                          </div>

                          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                            <p className="flex items-center gap-2">
                              <Plane className="size-4" aria-hidden />
                              {match.flight.fromAirport} → {match.flight.toAirport}
                            </p>
                            <p>{match.flight.date} · {match.flight.flightNumber}</p>
                            <p>Available capacity: {match.flight.capacityKg} kg</p>
                            <p>Completed transfers: {match.traveler.completedTransfers}</p>
                          </div>

                          <div className="mt-4 flex gap-2">
                            <Button asChild size="sm" variant="outline">
                              <Link to={`/shipments/${shipment.id}`}>View Shipment</Link>
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                requestHandover(shipment.id, match.traveler.id, match.flight.id);
                                navigate({ to: `/shipments/${shipment.id}` });
                              }}
                            >
                              Request Traveler
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </RequireAuth>
  );
}
