import { getState, setState, uid } from "./store";
import { notify } from "./notificationService";
import { addCustodyEvent, updateShipment } from "./shipmentService";
import type { RiskLevel } from "@/types";

function record(action: string, target: string) {
  setState((prev) => ({
    ...prev,
    adminActions: [
      {
        id: uid("aa"),
        actor: "AIRBRIDGE Operations",
        action,
        target,
        createdAt: new Date().toISOString(),
      },
      ...prev.adminActions,
    ],
  }));
}

export function adminStats() {
  const { users, shipments, flights } = getState();
  return {
    totalUsers: users.filter((u) => u.role === "user").length,
    activeTravelers: new Set(flights.map((f) => f.travelerId)).size,
    activeShipments: shipments.filter((s) =>
      ["matched", "handover-pending", "in-transit", "arrived", "awaiting-match"].includes(s.status),
    ).length,
    completedDeliveries: shipments.filter((s) => s.status === "delivered").length,
    pendingVerification: shipments.filter((s) => s.status === "verification-required").length,
    flaggedShipments: shipments.filter((s) => s.flagged || s.status === "frozen").length,
  };
}

export function approveShipment(id: string) {
  const shipment = getState().shipments.find((s) => s.id === id);
  if (!shipment) return;
  updateShipment(id, {
    status: "awaiting-match",
    flagged: false,
    risk: "low",
    adminNote: "Approved by operations (demo review).",
    eligibility: { ...shipment.eligibility, status: "eligible", requiredDocuments: [] },
  });
  addCustodyEvent(id, "Verification Cleared", "Operations review");
  record("Approved shipment", shipment.code);
  notify(shipment.senderId, {
    icon: "verified",
    title: "Verification approved",
    body: `${shipment.code} cleared review and is ready for matching.`,
    link: `/shipments/${id}`,
  });
}

export function rejectShipment(id: string) {
  const shipment = getState().shipments.find((s) => s.id === id);
  if (!shipment) return;
  updateShipment(id, {
    status: "rejected",
    adminNote: "Rejected by operations (demo review).",
    eligibility: { ...shipment.eligibility, status: "rejected" },
  });
  record("Rejected shipment", shipment.code);
  notify(shipment.senderId, {
    icon: "warning",
    title: "Shipment rejected",
    body: `${shipment.code} cannot be accepted under current platform rules.`,
    link: `/shipments/${id}`,
  });
}

export function requestInformation(id: string) {
  const shipment = getState().shipments.find((s) => s.id === id);
  if (!shipment) return;
  updateShipment(id, {
    status: "verification-required",
    adminNote: "Additional information requested from sender.",
  });
  record("Requested information", shipment.code);
  notify(shipment.senderId, {
    icon: "warning",
    title: "Additional information requested",
    body: `Operations need more details for ${shipment.code}.`,
    link: `/shipments/${id}`,
  });
}

export function freezeShipment(id: string) {
  const shipment = getState().shipments.find((s) => s.id === id);
  if (!shipment) return;
  updateShipment(id, { status: "frozen", flagged: true, risk: "high", adminNote: "Shipment frozen pending review." });
  addCustodyEvent(id, "Shipment Frozen", "Operations risk review");
  record("Froze shipment", shipment.code);
  notify(shipment.senderId, {
    icon: "warning",
    title: "Shipment frozen",
    body: `${shipment.code} is frozen pending an operations review.`,
    link: `/shipments/${id}`,
  });
}

export function clearFlag(id: string) {
  const shipment = getState().shipments.find((s) => s.id === id);
  if (!shipment) return;
  updateShipment(id, {
    flagged: false,
    risk: "low",
    status: shipment.status === "frozen" ? "awaiting-match" : shipment.status,
    adminNote: "Flag cleared by operations.",
  });
  record("Cleared flag", shipment.code);
}

export function setRisk(id: string, risk: RiskLevel, reason: string) {
  updateShipment(id, { risk, riskReason: reason, flagged: risk !== "low" });
}

export function setUserStatus(userId: string, status: "active" | "suspended") {
  const user = getState().users.find((u) => u.id === userId);
  setState((prev) => ({
    ...prev,
    users: prev.users.map((u) => (u.id === userId ? { ...u, status } : u)),
  }));
  record(status === "suspended" ? "Suspended user" : "Reactivated user", user?.name ?? userId);
}

export function analyticsData() {
  const { shipments, flights } = getState();
  const byCategory = Object.entries(
    shipments.reduce<Record<string, number>>((acc, s) => {
      acc[s.item.category] = (acc[s.item.category] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));

  const byRoute = Object.entries(
    shipments.reduce<Record<string, number>>((acc, s) => {
      const key = `${s.route.fromCity.split(",")[0]} → ${s.route.toCity.split(",")[0]}`;
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const monthly = [
    { month: "Apr", shipments: 18, delivered: 15 },
    { month: "May", shipments: 24, delivered: 21 },
    { month: "Jun", shipments: 31, delivered: 27 },
    { month: "Jul", shipments: 29, delivered: 26 },
    { month: "Aug", shipments: 38, delivered: 34 },
    { month: "Sep", shipments: 44, delivered: 36 },
  ];

  const participation = [
    { month: "Apr", travelers: 12 },
    { month: "May", travelers: 15 },
    { month: "Jun", travelers: 19 },
    { month: "Jul", travelers: 22 },
    { month: "Aug", travelers: 26 },
    { month: "Sep", travelers: 20 + flights.length },
  ];

  return {
    byCategory,
    byRoute,
    monthly,
    participation,
    statusSplit: [
      { name: "Delivered", value: shipments.filter((s) => s.status === "delivered").length },
      { name: "In transit", value: shipments.filter((s) => s.status === "in-transit").length },
      { name: "Matched", value: shipments.filter((s) => s.status === "matched").length },
      { name: "Verification", value: shipments.filter((s) => s.status === "verification-required").length },
      { name: "Awaiting match", value: shipments.filter((s) => s.status === "awaiting-match").length },
    ].filter((d) => d.value > 0),
  };
}
