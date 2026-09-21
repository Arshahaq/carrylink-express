import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, MessageSquareWarning, QrCode, ShieldCheck } from "lucide-react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { useCurrentUser } from "@/hooks/useAuth";
import { useAppState } from "@/services/store";

export const Route = createFileRoute("/security")({
  component: SecurityRoute,
});

function SecurityRoute() {
  const user = useCurrentUser();
  const state = useAppState();
  const shipments = user ? state.shipments.filter((shipment) => shipment.senderId === user.id || shipment.travelerId === user.id) : [];
  return <RequireAuth><div className="space-y-6"><div><p className="text-sm font-medium text-muted-foreground">Trust & Safety</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Security Center</h1><p className="mt-2 text-muted-foreground">A clear view of the prototype safeguards around your account and shipments.</p></div><div className="grid gap-6 md:grid-cols-2"><section className="card-soft p-6"><h2 className="flex items-center gap-2 text-xl font-bold"><ShieldCheck className="size-5 text-accent" aria-hidden />Account Security</h2><div className="mt-4 space-y-3 text-sm"><SecurityRow label="Email status" value={user?.emailVerified ? "Verified" : "Pending"} /><SecurityRow label="Mobile status" value={user?.phoneVerified ? "Verified" : "Pending"} /><SecurityRow label="Identity" value="Demo verified" /><SecurityRow label="Session" value="Active prototype session" /></div></section><section className="card-soft p-6"><h2 className="flex items-center gap-2 text-xl font-bold"><QrCode className="size-5 text-accent" aria-hidden />Shipment Security</h2><div className="mt-4 space-y-3 text-sm"><p>✓ Eligibility screening</p><p>✓ Traveler verification</p><p>✓ Shipment IDs and audit trail</p><p>✓ Handover OTP and simulated QR</p><p>✓ Delivery confirmation</p><p className="text-muted-foreground">Your visible shipments: {shipments.length}</p></div></section><section className="card-soft p-6"><h2 className="flex items-center gap-2 text-xl font-bold"><MessageSquareWarning className="size-5 text-warning" aria-hidden />Communication Safety</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Automated demo risk detection flags suspicious phrases in shipment conversations for operations review. Messages remain visible and are not deleted automatically.</p></section><section className="card-soft p-6"><h2 className="text-xl font-bold">Prototype Notice</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Security and verification features shown here are simulated prototype functionality and are not connected to government, customs, airline or identity systems.</p></section></div></div></RequireAuth>;
}

function SecurityRow({ label, value }: { label: string; value: string }) { return <div className="flex items-center justify-between gap-3 rounded-lg bg-surface px-3 py-2"><span className="text-muted-foreground">{label}</span><span className="flex items-center gap-1 font-medium text-success"><CheckCircle2 className="size-4" aria-hidden />{value}</span></div>; }
