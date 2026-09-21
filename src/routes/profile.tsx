import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, RotateCcw, Save } from "lucide-react";
import { useState } from "react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/useAuth";
import { updateProfile } from "@/services/authService";
import { flightsFor } from "@/services/travelerService";
import { resetState, useAppState } from "@/services/store";

export const Route = createFileRoute("/profile")({
  component: ProfileRoute,
});

function ProfileRoute() {
  const user = useCurrentUser();
  const state = useAppState();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [saved, setSaved] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const shipments = user ? state.shipments.filter((shipment) => shipment.senderId === user.id || shipment.travelerId === user.id) : [];
  const flights = user ? flightsFor(user.id) : [];

  function save() { updateProfile({ name: name.trim() || user?.name, phone }); setSaved(true); window.setTimeout(() => setSaved(false), 1800); }
  function resetDemo() { resetState(); setResetConfirm(false); navigate({ to: "/sender/dashboard" }); }

  return <RequireAuth><div className="space-y-6"><div><p className="text-sm font-medium text-muted-foreground">Demo Profile</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Profile</h1><p className="mt-2 text-muted-foreground">Manage safe local profile fields and review prototype activity.</p></div><div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]"><section className="card-soft p-6"><div className="flex items-center gap-4"><div className="grid size-16 place-items-center rounded-full bg-primary text-lg font-bold text-primary-foreground">{user?.avatarInitials}</div><div><h2 className="text-xl font-bold">{user?.name}</h2><p className="text-sm text-muted-foreground">{user?.email}</p></div></div><div className="mt-6 grid gap-3 text-sm"><Info label="Role" value={user?.role ?? "User"} /><Info label="Account status" value={user?.status ?? "active"} /><Info label="Demo verification" value={user?.identityVerification ?? "unverified"} /><Info label="Completed shipments" value={`${user?.completedShipments ?? 0}`} /><Info label="Completed transfers" value={`${user?.completedTransfers ?? 0}`} /><Info label="Active shipments" value={`${shipments.filter((shipment) => !["delivered", "rejected"].includes(shipment.status)).length}`} />{user?.modes.includes("traveler") ? <Info label="Saved flights" value={`${flights.length}`} /> : null}</div></section><section className="card-soft p-6"><h2 className="text-xl font-bold">Edit safe local fields</h2><p className="mt-1 text-sm text-muted-foreground">This demo does not perform real identity verification.</p><div className="mt-5 space-y-4"><label className="block space-y-2 text-sm font-medium">Display name<Input value={name} onChange={(event) => setName(event.target.value)} /></label><label className="block space-y-2 text-sm font-medium">Phone number<Input value={phone} onChange={(event) => setPhone(event.target.value)} /></label><Button onClick={save}><Save className="size-4" aria-hidden />Save Profile</Button>{saved ? <p className="flex items-center gap-2 text-sm font-medium text-success"><CheckCircle2 className="size-4" aria-hidden />Profile saved locally.</p> : null}</div><div className="mt-8 border-t border-border pt-5"><h3 className="font-semibold">Prototype data controls</h3>{resetConfirm ? <div className="mt-3 rounded-lg border border-warning/30 bg-warning-soft p-4"><p className="text-sm">Restore the original demo users, shipments, flights, messages, and notifications?</p><div className="mt-3 flex gap-2"><Button size="sm" variant="destructive" onClick={resetDemo}>Reset Prototype Demo Data</Button><Button size="sm" variant="ghost" onClick={() => setResetConfirm(false)}>Cancel</Button></div></div> : <Button className="mt-3" variant="outline" onClick={() => setResetConfirm(true)}><RotateCcw className="size-4" aria-hidden />Reset Prototype Demo Data</Button>}</div></section></div></div></RequireAuth>;
}

function Info({ label, value }: { label: string; value: string }) { return <div className="flex items-center justify-between gap-4 rounded-lg bg-surface px-3 py-2"><span className="text-muted-foreground">{label}</span><span className="font-medium capitalize">{value}</span></div>; }
