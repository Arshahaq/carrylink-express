import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FilePlus2, Inbox, Package, Plane } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useAuth";
import { flightsFor } from "@/services/travelerService";
import { requestsForTraveler } from "@/services/travelerService";
import { useAppState } from "@/services/store";

export const Route = createFileRoute("/traveler/dashboard")({
  component: TravelerDashboard,
});

function TravelerDashboard() {
  const user = useCurrentUser();
  const state = useAppState();
  const flights = user ? flightsFor(user.id) : [];
  const requests = user ? requestsForTraveler(user.id) : [];
  const accepted = user
    ? state.shipments.filter(
        (shipment) =>
          shipment.travelerId === user.id &&
          shipment.custody.some((event) => event.label === "Traveler Accepted"),
      )
    : [];
  const completed = accepted.filter((shipment) => shipment.status === "delivered").length;
  const metrics: Array<{ label: string; value: number; icon: LucideIcon }> = [
    { label: "Upcoming Flights", value: flights.filter((flight) => new Date(flight.date) >= new Date()).length, icon: Plane },
    { label: "Pending Requests", value: requests.length, icon: Inbox },
    { label: "Accepted Deliveries", value: accepted.filter((shipment) => shipment.status !== "delivered").length, icon: Package },
    { label: "Completed Deliveries", value: completed, icon: ArrowRight },
  ];

  return (
    <RequireAuth requireMode="traveler">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Travel & Carry</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Welcome, {user?.name.split(" ")[0]}</h1>
            <p className="mt-2 text-muted-foreground">Manage your upcoming flights and delivery requests.</p>
          </div>
          <Button asChild>
            <Link to="/traveler/add-flight">
              <FilePlus2 className="size-4" aria-hidden />
              Add Flight
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map(({ label, value, icon: Icon }) => (
            <div key={label} className="card-soft p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">{label}</p>
                <Icon className="size-4 text-accent" aria-hidden />
              </div>
              <p className="mt-3 text-3xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="card-soft p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold">Upcoming flights</h2>
              <Link to="/traveler/flights" className="text-sm font-semibold text-accent hover:underline">View all</Link>
            </div>
            <div className="mt-5 space-y-3">
              {flights.slice(0, 3).map((flight) => (
                <div key={flight.id} className="rounded-xl border border-border bg-surface p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold">{flight.airline ?? "Verified flight"} {flight.flightNumber}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{flight.fromCity} → {flight.toCity}</p>
                    </div>
                    <span className="rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success">UPCOMING</span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{flight.date} · {flight.capacityKg} kg available</p>
                </div>
              ))}
              {flights.length === 0 ? <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">Add a flight to start carrying eligible shipments.</p> : null}
            </div>
          </section>

          <section className="card-soft p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold">Pending requests</h2>
              <Link to="/traveler/requests" className="text-sm font-semibold text-accent hover:underline">Review</Link>
            </div>
            <div className="mt-5 space-y-3">
              {requests.slice(0, 3).map(({ shipment, flight, score }) => (
                <Link key={shipment.id} to="/shipments/$shipmentId" params={{ shipmentId: shipment.id }} className="block rounded-xl border border-border bg-surface p-4 hover:border-accent/30">
                  <p className="text-sm font-semibold text-accent">{shipment.code}</p>
                  <p className="mt-1 font-semibold">{shipment.item.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{flight.flightNumber} · {score}% compatibility</p>
                </Link>
              ))}
              {requests.length === 0 ? <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">No compatible shipment requests yet.</p> : null}
            </div>
          </section>
        </div>
      </div>
    </RequireAuth>
  );
}
