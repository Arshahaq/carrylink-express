import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, BarChart3, Map, Package, ShieldCheck, Users } from "lucide-react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { RiskBadge, StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/services/store";
import { adminStats, riskProfile } from "@/services/adminService";

export const Route = createFileRoute("/admin/")({ component: AdminDashboard });

function AdminDashboard() {
  const state = useAppState();
  const stats = adminStats();
  const active = state.shipments.filter((s) => ["matched", "handover-pending", "in-transit", "arrived"].includes(s.status)).length;
  const inTransit = state.shipments.filter((s) => ["in-transit", "arrived"].includes(s.status)).length;
  return (
    <RequireAuth requireMode="admin">
      <div className="space-y-6">
        <header><p className="text-sm font-medium text-muted-foreground">AIRBRIDGE Operations · Prototype</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Operations Center</h1><p className="mt-2 text-muted-foreground">Monitor shared sender, traveler, shipment, and flight activity.</p></header>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">{[["Active Shipments", active], ["Awaiting Traveler", state.shipments.filter((s) => s.status === "awaiting-match").length], ["In Transit", inTransit], ["Delivered", stats.completedDeliveries], ["Verification Required", stats.pendingVerification], ["Risk Alerts", state.shipments.filter((s) => riskProfile(s).risk === "high").length]].map(([label, value]) => <div key={label as string} className="card-soft p-4"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label as string}</p><p className="mt-3 text-2xl font-bold">{value as number}</p></div>)}</div>
        <section className="card-soft p-6"><div className="flex items-center justify-between"><h2 className="text-xl font-bold">Recent Shipments</h2><Link to="/admin/shipments" className="text-sm font-semibold text-accent">View all</Link></div><div className="mt-5 space-y-3">{state.shipments.slice(0, 6).map((s) => <Link key={s.id} to="/shipments/$shipmentId" params={{ shipmentId: s.id }} className="block rounded-xl border border-border bg-surface p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-semibold text-accent">{s.code}</p><p className="mt-1 font-semibold">{s.item.name}</p><p className="text-sm text-muted-foreground">{s.senderName} · {s.travelerName ?? "No traveler"} · {s.route.fromCity.split(",")[0]} → {s.route.toCity.split(",")[0]}</p></div><div className="flex gap-2"><StatusBadge status={s.status} /><RiskBadge risk={riskProfile(s).risk} /></div></div></Link>)}</div></section>
        <section className="card-soft p-6"><h2 className="text-xl font-bold">Quick Actions</h2><div className="mt-4 grid gap-2 sm:grid-cols-2">{[["/admin/shipments", "View Shipments", Package], ["/admin/verification", "Verification Center", ShieldCheck], ["/admin/risk", "Risk Center", AlertTriangle], ["/admin/users", "Users", Users], ["/admin/analytics", "Analytics", BarChart3], ["/admin/map", "Operations Map", Map]].map(([to, label, Icon]) => <Button key={label as string} asChild variant="outline" className="justify-between"><Link to={to as never}>{label as string}<Icon className="size-4" aria-hidden /></Link></Button>)}</div></section>
      </div>
    </RequireAuth>
  );
}
