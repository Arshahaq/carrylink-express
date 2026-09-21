import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, LockKeyhole, QrCode, ShieldCheck, Truck } from "lucide-react";
import { useState } from "react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/useAuth";
import { useAppState } from "@/services/store";
import { completeHandover, shipmentById } from "@/services/shipmentService";
import { DEMO_OTP } from "@/data/seed";

export const Route = createFileRoute("/shipments/$shipmentId/handover")({
  component: HandoverRoute,
});

function HandoverRoute() {
  const { shipmentId } = Route.useParams();
  const shipment = shipmentById(shipmentId);
  const state = useAppState();
  const user = useCurrentUser();
  const [otp, setOtp] = useState("");
  const [condition, setCondition] = useState("Good");
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  if (!shipment) {
    return <RequireAuth><EmptyState title="Shipment Not Found" body="This shipment is not available in the demo state." /></RequireAuth>;
  }

  const flight = state.flights.find((candidate) => candidate.id === shipment.flightId);
  const isTraveler = user?.id === shipment.travelerId;
  const ready = Boolean(shipment.travelerId && shipment.flightId && ["matched", "handover-pending"].includes(shipment.status));
  const complete = confirmed || shipment.status === "in-transit" || shipment.status === "arrived" || shipment.status === "delivered";

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (otp !== DEMO_OTP) {
      setError("Incorrect OTP. Please verify the sender's handover code.");
      return;
    }
    if (!completeHandover(shipment.id, otp, condition)) {
      setError("Handover is not available in the current shipment state.");
      return;
    }
    setConfirmed(true);
  }

  return (
    <RequireAuth>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div><p className="text-sm font-medium text-muted-foreground">Secure handover</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Handover Confirmation</h1></div>
          <Button asChild variant="outline"><Link to="/shipments/$shipmentId" params={{ shipmentId: shipment.id }}><ArrowLeft className="size-4" aria-hidden />Back to shipment</Link></Button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-6">
            <div className="card-soft p-6">
              <div className="flex items-center gap-3"><div className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent"><LockKeyhole className="size-5" aria-hidden /></div><div><p className="text-sm text-muted-foreground">Shipment ID</p><h2 className="text-xl font-bold">{shipment.code}</h2></div></div>
              <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
                <Summary label="Item" value={shipment.item.name} />
                <Summary label="Category" value={shipment.item.category} />
                <Summary label="Weight" value={`${shipment.item.weightKg} kg`} />
                <Summary label="Sender" value={shipment.senderName} />
                <Summary label="Traveler" value={shipment.travelerName ?? "Not assigned"} />
                <Summary label="Flight" value={flight ? `${flight.airline ?? "Flight"} ${flight.flightNumber}` : "Not assigned"} />
                <Summary label="Route" value={`${shipment.route.fromCity} → ${shipment.route.toCity}`} />
                <Summary label="Current status" value={shipment.status} />
              </div>
            </div>

            {!ready && !complete ? <div className="card-soft border-warning/30 bg-warning-soft p-6"><h2 className="text-lg font-bold">Handover is not available yet.</h2><p className="mt-2 text-sm text-muted-foreground">The shipment needs an accepted traveler and assigned flight before secure handover can begin.</p></div> : null}

            {complete ? (
              <div className="card-soft border-success/30 bg-success-soft p-6"><CheckCircle2 className="size-8 text-success" aria-hidden /><h2 className="mt-4 text-xl font-bold">Handover confirmed</h2><p className="mt-2 text-sm text-muted-foreground">This shipment is now in transit. Delivery confirmation is the next step.</p><Button asChild className="mt-5"><Link to="/shipments/$shipmentId/delivery" params={{ shipmentId: shipment.id }}>Continue to delivery</Link></Button></div>
            ) : isTraveler && ready ? (
              <form onSubmit={submit} className="card-soft space-y-5 p-6">
                <div><h2 className="text-xl font-bold">Confirm Handover</h2><p className="mt-1 text-sm text-muted-foreground">Use the sender's demo OTP to confirm package receipt.</p></div>
                <label className="block space-y-2 text-sm font-medium">Handover OTP<Input value={otp} onChange={(event) => setOtp(event.target.value)} inputMode="numeric" maxLength={6} placeholder="Enter 6-digit OTP" /></label>
                <label className="block space-y-2 text-sm font-medium">Package condition<select value={condition} onChange={(event) => setCondition(event.target.value)} className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm"><option>Good</option><option>Minor issue</option><option>Damaged</option></select></label>
                {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
                <Button type="submit" className="w-full"><ShieldCheck className="size-4" aria-hidden />Confirm Handover</Button>
              </form>
            ) : (
              <div className="card-soft p-6"><h2 className="text-lg font-bold">Ready for Handover</h2><p className="mt-2 text-sm text-muted-foreground">The traveler must confirm receipt with the demo OTP. The sender cannot complete this action.</p></div>
            )}
          </section>

          <aside className="space-y-6">
            <div className="card-soft p-6 text-center"><QrCode className="mx-auto size-7 text-accent" aria-hidden /><h2 className="mt-3 text-lg font-bold">Simulated Handover QR</h2><div className="mt-4 flex justify-center"><DemoQr value={shipment.id} /></div><p className="mt-3 text-xs text-muted-foreground">Demo QR tied to shipment {shipment.code}</p></div>
            <div className="card-soft p-6"><h2 className="text-lg font-bold">Demo Handover OTP</h2><p className="mt-2 text-sm text-muted-foreground">Use OTP {DEMO_OTP} for the prototype demonstration.</p><div className="mt-4 rounded-lg border border-border bg-surface px-4 py-3 text-center font-mono text-2xl tracking-[0.3em]">{DEMO_OTP}</div></div>
            <div className="card-soft p-6"><div className="flex items-center gap-2 text-sm font-semibold"><Truck className="size-4 text-accent" aria-hidden />Handover location</div><p className="mt-2 text-sm text-muted-foreground">{shipment.route.pickupPreference} · Demo location</p></div>
          </aside>
        </div>
      </div>
    </RequireAuth>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 font-medium capitalize">{value}</p></div>;
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return <div className="card-soft p-8"><h1 className="text-2xl font-bold">{title}</h1><p className="mt-2 text-muted-foreground">{body}</p></div>;
}

function DemoQr({ value }: { value: string }) {
  const cells = Array.from({ length: 169 }, (_, index) => {
    const code = value.charCodeAt(index % Math.max(value.length, 1)) || 7;
    return (code + index * 13) % 5 < 2;
  });
  return <div className="grid size-44 grid-cols-13 gap-0.5 rounded-lg border-8 border-white bg-white p-1 shadow" aria-label="Simulated handover QR">{cells.map((filled, index) => <span key={index} className={filled ? "bg-foreground" : "bg-white"} />)}</div>;
}
