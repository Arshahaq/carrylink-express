import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES, CITIES, DELIVERY_OPTIONS, PICKUP_OPTIONS } from "@/data/categories";
import { addFlight } from "@/services/travelerService";
import type { ItemCategoryId } from "@/types";

export const Route = createFileRoute("/traveler/add-flight")({
  component: AddFlightRoute,
});

function AddFlightRoute() {
  const navigate = useNavigate();
  const [fromCity, setFromCity] = useState("Bengaluru, India");
  const [toCity, setToCity] = useState("Dubai, UAE");
  const [airline, setAirline] = useState("Emirates");
  const [flightNumber, setFlightNumber] = useState("EK565");
  const [date, setDate] = useState("2026-09-25");
  const [departureTime, setDepartureTime] = useState("22:25");
  const [capacityKg, setCapacityKg] = useState("2");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!fromCity) nextErrors["fromCity"] = "Departure city is required.";
    if (!toCity) nextErrors["toCity"] = "Destination city is required.";
    if (!airline.trim()) nextErrors["airline"] = "Airline is required.";
    if (!flightNumber.trim()) nextErrors["flightNumber"] = "Flight number is required.";
    if (!date) nextErrors["date"] = "Departure date is required.";
    if (!departureTime) nextErrors["departureTime"] = "Departure time is required.";
    if (Number(capacityKg) <= 0 || !Number.isFinite(Number(capacityKg))) nextErrors["capacityKg"] = "Capacity must be greater than zero.";
    if (fromCity === toCity) nextErrors["toCity"] = "Destination must differ from departure city.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    addFlight({
      fromCity,
      toCity,
      airline: airline.trim(),
      flightNumber,
      date,
      departureTime,
      arrivalTime: "",
      capacityKg: Number(capacityKg),
      categories: CATEGORIES.map((category) => category.id as ItemCategoryId),
      maxValueInr: 200000,
      pickupPreference: PICKUP_OPTIONS[0] ?? "Designated location",
      deliveryPreference: DELIVERY_OPTIONS[0] ?? "Designated location",
      ...(notes.trim() ? { notes: notes.trim() } : {}),
    });
    setSaved(true);
  }

  return (
    <RequireAuth requireMode="traveler">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Travel & Carry</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Add Flight</h1>
            <p className="mt-2 text-muted-foreground">Tell AIRBRIDGE where you are flying and how much capacity you can carry.</p>
          </div>
          <Button asChild variant="outline"><Link to="/traveler/dashboard"><ArrowLeft className="size-4" aria-hidden />Dashboard</Link></Button>
        </div>

        {saved ? (
          <div className="card-soft p-8 text-center">
            <CheckCircle2 className="mx-auto size-10 text-success" aria-hidden />
            <h2 className="mt-4 text-2xl font-bold">Flight Added</h2>
            <p className="mt-2 text-muted-foreground">{fromCity} → {toCity}</p>
            <p className="mt-1 text-sm text-muted-foreground">{airline} {flightNumber} · {capacityKg} kg available</p>
            <div className="mt-6 flex justify-center gap-3">
              <Button onClick={() => navigate({ to: "/traveler/requests" })}>View Requests</Button>
              <Button variant="outline" onClick={() => navigate({ to: "/traveler/flights" })}>My Flights</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="card-soft space-y-6 p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Departure city" error={errors["fromCity"]}>
                <select value={fromCity} onChange={(event) => setFromCity(event.target.value)} className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm">
                  {CITIES.map((city) => <option key={city.city} value={city.city}>{city.city}</option>)}
                </select>
              </Field>
              <Field label="Destination city" error={errors["toCity"]}>
                <select value={toCity} onChange={(event) => setToCity(event.target.value)} className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm">
                  {CITIES.map((city) => <option key={city.city} value={city.city}>{city.city}</option>)}
                </select>
              </Field>
              <Field label="Airline" error={errors["airline"]}><Input value={airline} onChange={(event) => setAirline(event.target.value)} placeholder="Emirates" /></Field>
              <Field label="Flight number" error={errors["flightNumber"]}><Input value={flightNumber} onChange={(event) => setFlightNumber(event.target.value)} placeholder="EK565" /></Field>
              <Field label="Departure date" error={errors["date"]}><Input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></Field>
              <Field label="Departure time" error={errors["departureTime"]}><Input type="time" value={departureTime} onChange={(event) => setDepartureTime(event.target.value)} /></Field>
              <Field label="Available carrying capacity (kg)" error={errors["capacityKg"]}><Input type="number" min="0.1" step="0.1" value={capacityKg} onChange={(event) => setCapacityKg(event.target.value)} /></Field>
              <label className="space-y-2 text-sm font-medium md:col-span-2">Notes (optional)<Textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} placeholder="Anything the sender should know" /></label>
            </div>
            <div className="flex justify-end"><Button type="submit">Add Flight</Button></div>
          </form>
        )}
      </div>
    </RequireAuth>
  );
}

function Field({ label, error, children }: { label: string; error?: string | undefined; children: React.ReactNode }) {
  return <label className="space-y-2 text-sm font-medium"><span>{label}</span>{children}{error ? <span className="block text-xs font-normal text-destructive">{error}</span> : null}</label>;
}
