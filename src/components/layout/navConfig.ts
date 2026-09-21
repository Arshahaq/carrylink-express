import {
  Activity,
  BarChart3,
  Bell,
  CheckCircle2,
  FilePlus2,
  Inbox,
  LayoutDashboard,
  Map,
  MessageSquare,
  Package,
  Plane,
  ShieldCheck,
  Truck,
  User,
  Users,
  Users2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Mode } from "@/types";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  primary?: boolean;
}

export const senderNav: NavItem[] = [
  { label: "Overview", to: "/sender/dashboard", icon: LayoutDashboard, primary: true },
  { label: "Create Shipment", to: "/sender/create", icon: FilePlus2, primary: true },
  { label: "My Shipments", to: "/sender/shipments", icon: Package, primary: true },
  { label: "Matches", to: "/sender/matches", icon: Users2 },
  { label: "Messages", to: "/messages", icon: MessageSquare, primary: true },
  { label: "Notifications", to: "/notifications", icon: Bell },
  { label: "Security", to: "/security", icon: ShieldCheck },
  { label: "Profile", to: "/profile", icon: User },
];

export const travelerNav: NavItem[] = [
  { label: "Overview", to: "/traveler/dashboard", icon: LayoutDashboard, primary: true },
  { label: "My Flights", to: "/traveler/flights", icon: Plane, primary: true },
  { label: "Requests", to: "/traveler/requests", icon: Inbox, primary: true },
  { label: "Active Deliveries", to: "/traveler/deliveries", icon: Truck, primary: true },
  { label: "Completed", to: "/traveler/completed", icon: CheckCircle2 },
  { label: "Messages", to: "/messages", icon: MessageSquare },
  { label: "Notifications", to: "/notifications", icon: Bell },
  { label: "Security", to: "/security", icon: ShieldCheck },
  { label: "Profile", to: "/profile", icon: User },
];

export const adminNav: NavItem[] = [
  { label: "Overview", to: "/admin", icon: LayoutDashboard, primary: true },
  { label: "Live Map", to: "/admin/map", icon: Map, primary: true },
  { label: "Shipments", to: "/admin/shipments", icon: Package, primary: true },
  { label: "Verification", to: "/admin/verification", icon: ShieldCheck, primary: true },
  { label: "Risk Center", to: "/admin/risk", icon: Activity },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
];

export function navForMode(mode: Mode | null): NavItem[] {
  if (mode === "admin") return adminNav;
  if (mode === "traveler") return travelerNav;
  return senderNav;
}
