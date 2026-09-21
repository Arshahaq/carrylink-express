import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/useAuth";
import { shipmentsForSender } from "@/services/shipmentService";
import { useAppState } from "@/services/store";

export const Route = createFileRoute("/sender/shipments")({
  component: SenderShipments,
});

const filters = ["all", "awaiting-match", "matched", "in-transit", "delivered", "verification-required", "flagged"];

function SenderShipments() {
  const user = useCurrentUser();
  const state = useAppState();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof filters)[number]>("all");

  const shipments = user ? shipmentsForSender(user.id) : [];
  const visibleShipments = useMemo(() => {
    const lowered = query.trim().toLowerCase();
    return shipments.filter((shipment) => {
      const matchesStatus = statusFilter === "all" || shipment.status === statusFilter;
      const haystack = [shipment.code, shipment.item.name, shipment.route.fromCity, shipment.route.toCity, shipment.travelerName ?? ""]
        .join(" ")
        .toLowerCase();
      const matchesQuery = !lowered || haystack.includes(lowered);
      return matchesStatus && matchesQuery;
    });
  }, [query, shipments, statusFilter]);

  return (
    <RequireAuth requireMode="sender">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Shipments</h1>
            <p className="mt-2 text-muted-foreground">Track the current status of your shipments and handover progress.</p>
          </div>
          <Button asChild>
            <Link to="/sender/create">Create Shipment</Link>
          </Button>
        </div>

        <div className="card-soft p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search shipment ID, item, route or traveler"
                className="h-11 pl-9"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as (typeof filters)[number])}
              className="h-11 rounded-lg border border-input bg-background px-3 text-sm"
              aria-label="Filter shipments"
            >
              {filters.map((filter) => (
                <option key={filter} value={filter}>
                  {filter === "all" ? "All" : filter.replace("-", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>

        {visibleShipments.length === 0 ? (
          <div className="card-soft p-8 text-center">
            <p className="text-lg font-semibold">No shipments match your filters.</p>
            <p className="mt-2 text-sm text-muted-foreground">Create a shipment and it will appear here automatically.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleShipments.map((shipment) => (
              <Link
                key={shipment.id}
                to={`/shipments/${shipment.id}`}
                className="card-soft block overflow-hidden p-0 transition-shadow hover:shadow-[var(--shadow-lift)]"
              >
                <div className="grid gap-3 p-4 md:grid-cols-[1.2fr_0.8fr_0.7fr_0.7fr_0.8fr] md:items-center">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Shipment</p>
                    <p className="mt-1 font-semibold text-accent">{shipment.code}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Item</p>
                    <p className="mt-1 font-medium">{shipment.item.name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Route</p>
                    <p className="mt-1 text-sm">
                      {shipment.route.fromCity.split(",")[0]} → {shipment.route.toCity.split(",")[0]}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Traveler</p>
                    <p className="mt-1 text-sm">{shipment.travelerName ?? "Waiting for match"}</p>
                    {shipment.flightId ? <p className="mt-1 text-xs text-muted-foreground">{state.flights.find((flight) => flight.id === shipment.flightId)?.flightNumber ?? shipment.flightId}</p> : null}
                  </div>
                  <div className="md:text-right">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</p>
                    <div className="mt-2 md:flex md:justify-end">
                      <StatusBadge status={shipment.status} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </RequireAuth>
  );
}
