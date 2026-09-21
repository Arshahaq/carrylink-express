import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, Plane, Plus } from "lucide-react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useAuth";
import { flightsFor } from "@/services/travelerService";
import { useAppState } from "@/services/store";

export const Route = createFileRoute("/traveler/flights")({
  component: TravelerFlights,
});

function TravelerFlights() {
  const user = useCurrentUser();
  useAppState();
  const flights = user ? flightsFor(user.id) : [];

  return (
    <RequireAuth requireMode="traveler">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Travel & Carry</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">My Flights</h1>
            <p className="mt-2 text-muted-foreground">Your saved travel plans and available carrying capacity.</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline"><Link to="/traveler/dashboard"><ArrowLeft className="size-4" aria-hidden />Dashboard</Link></Button>
            <Button asChild><Link to="/traveler/add-flight"><Plus className="size-4" aria-hidden />Add Flight</Link></Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {flights.map((flight) => {
            const status = new Date(`${flight.date}T${flight.departureTime || "00:00"}`) < new Date() ? "COMPLETED" : "UPCOMING";
            return (
              <div key={flight.id} className="card-soft p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent"><Plane className="size-5" aria-hidden /></div>
                    <div>
                      <h2 className="text-lg font-bold">{flight.airline ?? "Verified flight"} {flight.flightNumber}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">{flight.fromCity} → {flight.toCity}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status === "UPCOMING" ? "bg-success-soft text-success" : "bg-muted text-muted-foreground"}`}>{status}</span>
                </div>
                <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                  <p className="flex items-center gap-2 text-muted-foreground"><CalendarDays className="size-4" aria-hidden />{flight.date}</p>
                  <p className="text-muted-foreground">Departure: {flight.departureTime || "Not specified"}</p>
                  <p className="font-semibold">{flight.capacityKg} kg capacity</p>
                  <p className="text-muted-foreground">Demo Flight Status</p>
                </div>
                {flight.notes ? <p className="mt-4 rounded-lg bg-surface p-3 text-sm text-muted-foreground">{flight.notes}</p> : null}
              </div>
            );
          })}
        </div>
        {flights.length === 0 ? <div className="card-soft p-8 text-center"><Plane className="mx-auto size-8 text-muted-foreground" /><h2 className="mt-4 text-lg font-semibold">No flights added</h2><p className="mt-2 text-sm text-muted-foreground">Add your next flight to find eligible shipment requests.</p></div> : null}
      </div>
    </RequireAuth>
  );
}
