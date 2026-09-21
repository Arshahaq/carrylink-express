import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FilePlus2, Package, Search, Truck } from "lucide-react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { useCurrentUser, greeting } from "@/hooks/useAuth";
import { useAppState } from "@/services/store";
import { shipmentsForSender } from "@/services/shipmentService";

export const Route = createFileRoute("/sender/dashboard")({
  component: SenderDashboard,
});

function SenderDashboard() {
  const user = useCurrentUser();
  const state = useAppState();
  const shipments = user ? shipmentsForSender(user.id) : [];

  const activeShipments = shipments.filter((s) =>
    ["matched", "handover-pending", "in-transit", "arrived", "awaiting-match"].includes(s.status),
  ).length;
  const awaitingTraveler = shipments.filter((s) => s.status === "matched" || s.status === "awaiting-match").length;
  const inTransit = shipments.filter((s) => s.status === "in-transit").length;
  const delivered = shipments.filter((s) => s.status === "delivered").length;
  const recentShipments = shipments.slice(0, 4);

  return (
    <RequireAuth requireMode="sender">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{greeting()}, {user?.name.split(" ")[0]}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Sender Dashboard</h1>
            <p className="mt-2 text-muted-foreground">Manage your shipments and track delivery progress.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/sender/create">
                <FilePlus2 className="size-4" aria-hidden />
                Create Shipment
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/sender/shipments">
                <Package className="size-4" aria-hidden />
                View My Shipments
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="card-soft p-5">
            <p className="text-sm text-muted-foreground">Active Shipments</p>
            <p className="mt-3 text-3xl font-bold">{activeShipments}</p>
          </div>
          <div className="card-soft p-5">
            <p className="text-sm text-muted-foreground">Awaiting Traveler</p>
            <p className="mt-3 text-3xl font-bold">{awaitingTraveler}</p>
          </div>
          <div className="card-soft p-5">
            <p className="text-sm text-muted-foreground">In Transit</p>
            <p className="mt-3 text-3xl font-bold">{inTransit}</p>
          </div>
          <div className="card-soft p-5">
            <p className="text-sm text-muted-foreground">Delivered</p>
            <p className="mt-3 text-3xl font-bold">{delivered}</p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="card-soft p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold">Recent Shipments</h2>
              <Link to="/sender/shipments" className="text-sm font-semibold text-accent hover:underline">
                View all
              </Link>
            </div>

            {recentShipments.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-border bg-surface p-8 text-center">
                <Package className="mx-auto size-8 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No shipments yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Create your first shipment to start matching with verified travelers.
                </p>
                <Button asChild className="mt-5">
                  <Link to="/sender/create">
                    Create a shipment
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {recentShipments.map((shipment) => (
                  <Link
                    key={shipment.id}
                    to={`/shipments/${shipment.id}`}
                    className="block rounded-xl border border-border bg-surface p-4 transition-colors hover:border-accent/30 hover:bg-muted"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-accent">{shipment.code}</p>
                        <p className="mt-1 text-base font-semibold">{shipment.item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {shipment.route.fromCity.split(",")[0]} → {shipment.route.toCity.split(",")[0]}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={shipment.status} />
                      </div>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
                      <span>Category: {shipment.item.category}</span>
                      <span>Weight: {shipment.item.weightKg} kg</span>
                      <span>{new Date(shipment.createdAt).toLocaleDateString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <div className="card-soft p-6">
              <h2 className="text-lg font-bold">Quick Actions</h2>
              <div className="mt-4 space-y-3">
                <Button asChild className="w-full justify-between">
                  <Link to="/sender/create">
                    Create Shipment
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-between">
                  <Link to="/sender/shipments">
                    View My Shipments
                    <Package className="size-4" aria-hidden />
                  </Link>
                </Button>
                <Button asChild variant="secondary" className="w-full justify-between">
                  <Link to="/sender/matches">
                    Find a Traveler
                    <Search className="size-4" aria-hidden />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="card-soft p-6">
              <h2 className="text-lg font-bold">Shipment Health</h2>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-sm">
                  <span>Needs travel match</span>
                  <span className="font-semibold">{shipments.filter((s) => s.status === "awaiting-match").length}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-sm">
                  <span>In progress</span>
                  <span className="font-semibold">{activeShipments}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-sm">
                  <span>Completed</span>
                  <span className="font-semibold">{delivered}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </RequireAuth>
  );
}
