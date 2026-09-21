import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/services/store";
import { confirmDelivery, shipmentById } from "@/services/shipmentService";
import { DEMO_OTP } from "@/data/seed";

export const Route = createFileRoute("/shipments/$shipmentId/delivery")({
  component: DeliveryRoute,
});

function DeliveryRoute() {
  const { shipmentId } = Route.useParams();
  const shipment = shipmentById(shipmentId);
  const state = useAppState();
  const [otp, setOtp] = useState("");
  const [condition, setCondition] = useState("Good");
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  if (!shipment) return <RequireAuth><div className="card-soft p-8"><h1 className="text-2xl font-bold">Shipment Not Found</h1></div></RequireAuth>;
  const flight = state.flights.find((candidate) => candidate.id === shipment.flightId);
  const delivered = confirmed || shipment.status === "delivered";
  const canDeliver = shipment.status === "in-transit" || shipment.status === "arrived";

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (otp !== DEMO_OTP) {
      setError("Incorrect OTP. Please verify the recipient delivery code.");
      return;
    }
    if (!confirmDelivery(shipment.id, otp, condition)) {
      setError("Delivery is not available in the current shipment state.");
      return;
    }
    setConfirmed(true);
  }

  return <RequireAuth><div className="space-y-6"><div className="flex items-center justify-between gap-4"><div><p className="text-sm font-medium text-muted-foreground">Recipient verification</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Delivery Confirmation</h1></div><Button asChild variant="outline"><Link to="/shipments/$shipmentId" params={{ shipmentId: shipment.id }}><ArrowLeft className="size-4" aria-hidden />Back to shipment</Link></Button></div><div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"><section className="space-y-6"><div className="card-soft p-6"><h2 className="text-xl font-bold">Shipment summary</h2><div className="mt-5 grid gap-4 text-sm sm:grid-cols-2"><Summary label="Shipment ID" value={shipment.code} /><Summary label="Item" value={shipment.item.name} /><Summary label="Origin" value={shipment.route.fromCity} /><Summary label="Destination" value={shipment.route.toCity} /><Summary label="Traveler" value={shipment.travelerName ?? "Not assigned"} /><Summary label="Flight" value={flight?.flightNumber ?? shipment.flightId ?? "Not assigned"} /><Summary label="Current status" value={shipment.status} /></div></div>{delivered ? <div className="card-soft border-success/30 bg-success-soft p-6"><CheckCircle2 className="size-8 text-success" aria-hidden /><h2 className="mt-4 text-xl font-bold">Delivery confirmed</h2><p className="mt-2 text-sm text-muted-foreground">The shipment is now marked delivered for the sender and traveler.</p><Button asChild className="mt-5"><Link to="/shipments/$shipmentId" params={{ shipmentId: shipment.id }}>View Shipment</Link></Button></div> : canDeliver ? <form onSubmit={submit} className="card-soft space-y-5 p-6"><div><h2 className="text-xl font-bold">Recipient Verification</h2><p className="mt-1 text-sm text-muted-foreground">Enter the deterministic demo OTP to complete delivery.</p></div><label className="block space-y-2 text-sm font-medium">Delivery OTP<Input value={otp} onChange={(event) => setOtp(event.target.value)} inputMode="numeric" maxLength={6} placeholder="Enter 6-digit OTP" /></label><label className="block space-y-2 text-sm font-medium">Package condition<select value={condition} onChange={(event) => setCondition(event.target.value)} className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm"><option>Good</option><option>Minor issue</option><option>Damaged</option></select></label>{error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}<Button type="submit" className="w-full"><ShieldCheck className="size-4" aria-hidden />Confirm Delivery</Button></form> : <div className="card-soft border-warning/30 bg-warning-soft p-6"><h2 className="text-lg font-bold">Delivery is not available yet.</h2><p className="mt-2 text-sm text-muted-foreground">The shipment must be handed over and in transit before recipient verification can begin.</p></div>}</section><aside className="space-y-6"><div className="card-soft p-6"><h2 className="text-lg font-bold">Demo Delivery OTP</h2><p className="mt-2 text-sm text-muted-foreground">Use OTP {DEMO_OTP} for this prototype delivery confirmation.</p><div className="mt-4 rounded-lg border border-border bg-surface px-4 py-3 text-center font-mono text-2xl tracking-[0.3em]">{DEMO_OTP}</div></div><div className="card-soft p-6"><h2 className="text-lg font-bold">Demo Verification</h2><div className="mt-4 space-y-3 text-sm"><p>✓ Sender verified</p><p>✓ Traveler verified</p><p>✓ Eligibility checked</p><p>✓ Handover OTP confirmed</p><p className={delivered ? "text-success" : "text-muted-foreground"}>{delivered ? "✓" : "○"} Delivery OTP confirmed</p></div></div></aside></div></div></RequireAuth>;
}

function Summary({ label, value }: { label: string; value: string }) { return <div><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 font-medium">{value}</p></div>; }
