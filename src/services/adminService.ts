import { getState, setState, uid } from "./store";
import { notify } from "./notificationService";
import { addCustodyEvent, updateShipment } from "./shipmentService";
import type { RiskLevel, Shipment, ShipmentStatus } from "@/types";

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

function notifyAdmin(title: string, body: string, link: string) {
  notify("u-admin", { icon: "warning", title, body, link });
}

function audit(id: string, label: string, method: string) {
  addCustodyEvent(id, label, method);
}

export function riskProfile(shipment: Shipment): { risk: RiskLevel; reason: string } {
  if (shipment.status === "frozen" || shipment.flagged || shipment.risk === "high") {
    return { risk: "high", reason: shipment.riskReason ?? "Shipment is flagged for operations review." };
  }
  if (shipment.eligibility.status === "review" || shipment.descriptionEdits > 0 || shipment.risk === "medium") {
    return { risk: "medium", reason: shipment.riskReason ?? "Manual verification or additional information is required." };
  }
  return { risk: "low", reason: "No elevated risk indicators in the demo state." };
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
  audit(id, "Verification Approved", "Demo operations review");
  record("Approved shipment", shipment.code);
  notify(shipment.senderId, {
    icon: "verified",
    title: "Verification approved",
    body: `${shipment.code} cleared review and is ready for matching.`,
    link: `/shipments/${id}`,
  });
  notifyAdmin("Demo verification approved", `${shipment.code} was approved by operations.`, `/shipments/${id}`);
}

export function rejectShipment(id: string) {
  const shipment = getState().shipments.find((s) => s.id === id);
  if (!shipment) return;
  updateShipment(id, {
    status: "rejected",
    adminNote: "Rejected by operations (demo review).",
    eligibility: { ...shipment.eligibility, status: "rejected" },
  });
  audit(id, "Verification Rejected", "Demo operations review");
  record("Rejected shipment", shipment.code);
  notify(shipment.senderId, {
    icon: "warning",
    title: "Shipment rejected",
    body: `${shipment.code} cannot be accepted under current platform rules.`,
    link: `/shipments/${id}`,
  });
  notifyAdmin("Demo verification rejected", `${shipment.code} was rejected by operations.`, `/shipments/${id}`);
}

export function requestInformation(id: string) {
  const shipment = getState().shipments.find((s) => s.id === id);
  if (!shipment) return;
  updateShipment(id, {
    status: "verification-required",
    adminNote: "Additional information requested from sender.",
  });
  audit(id, "Verification Requested", "Demo operations review");
  record("Requested information", shipment.code);
  notify(shipment.senderId, {
    icon: "warning",
    title: "Additional information requested",
    body: `Operations need more details for ${shipment.code}.`,
    link: `/shipments/${id}`,
  });
  notifyAdmin("Verification information requested", `${shipment.code} needs additional information.`, `/shipments/${id}`);
}

export function freezeShipment(id: string) {
  const shipment = getState().shipments.find((s) => s.id === id);
  if (!shipment || shipment.status === "delivered" || shipment.status === "frozen") return;
  updateShipment(id, {
    status: "frozen",
    flagged: true,
    risk: "high",
    frozenFromStatus: shipment.status,
    frozenPreviousRisk: shipment.risk,
    frozenPreviousFlagged: shipment.flagged,
    adminNote: "Shipment frozen pending review.",
  });
  audit(id, "Shipment Frozen by Operations", "Demo operations risk review");
  record("Froze shipment", shipment.code);
  notify(shipment.senderId, {
    icon: "warning",
    title: "Shipment frozen",
    body: `${shipment.code} is frozen pending an operations review.`,
    link: `/shipments/${id}`,
  });
  if (shipment.travelerId) {
    notify(shipment.travelerId, {
      icon: "warning",
      title: "Shipment frozen by operations",
      body: `${shipment.code} is temporarily paused pending demo review.`,
      link: `/shipments/${id}`,
    });
  }
  notifyAdmin("Shipment frozen", `${shipment.code} was frozen by operations.`, `/shipments/${id}`);
}

export function unfreezeShipment(id: string) {
  const shipment = getState().shipments.find((s) => s.id === id);
  if (!shipment || shipment.status !== "frozen") return;
  const restoredStatus = shipment.frozenFromStatus ?? "awaiting-match";
  const restoredRisk = shipment.frozenPreviousRisk ?? "low";
  const restoredFlagged = shipment.frozenPreviousFlagged ?? false;
  updateShipment(id, {
    status: restoredStatus,
    risk: restoredRisk,
    flagged: restoredFlagged,
    adminNote: "Shipment unfrozen by operations (demo action).",
  });
  audit(id, "Shipment Unfrozen", "Demo operations review");
  record("Unfroze shipment", shipment.code);
  notify(shipment.senderId, { icon: "verified", title: "Shipment unfrozen", body: `${shipment.code} is active again after operations review.`, link: `/shipments/${id}` });
  if (shipment.travelerId) notify(shipment.travelerId, { icon: "verified", title: "Shipment unfrozen", body: `${shipment.code} is active again after operations review.`, link: `/shipments/${id}` });
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

export function markRiskReviewed(id: string) {
  const shipment = getState().shipments.find((s) => s.id === id);
  if (!shipment) return;
  audit(id, "Risk Reviewed", "Demo operations risk review");
  record("Reviewed risk", shipment.code);
}

export function setRisk(id: string, risk: RiskLevel, reason: string) {
  const shipment = getState().shipments.find((candidate) => candidate.id === id);
  if (!shipment) return;
  updateShipment(id, { risk, riskReason: reason, flagged: risk !== "low" });
  if (risk !== "low") {
    notifyAdmin("Risk detected", `${shipment.code}: ${reason}`, `/shipments/${id}`);
  }
}

export function setUserStatus(userId: string, status: "active" | "suspended") {
  const user = getState().users.find((u) => u.id === userId);
  setState((prev) => ({
    ...prev,
    users: prev.users.map((u) => (u.id === userId ? { ...u, status } : u)),
  }));
  record(status === "suspended" ? "Suspended user" : "Reactivated user", user?.name ?? userId);
}

export function toggleUserFlag(userId: string) {
  const user = getState().users.find((candidate) => candidate.id === userId);
  if (!user) return;
  const demoFlagged = !user.demoFlagged;
  setState((prev) => ({
    ...prev,
    users: prev.users.map((candidate) => (candidate.id === userId ? { ...candidate, demoFlagged } : candidate)),
  }));
  record(demoFlagged ? "Flagged demo account" : "Unflagged demo account", user.name);
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

  const monthly = Object.entries(
    shipments.reduce<Record<string, { shipments: number; delivered: number }>>((acc, shipment) => {
      const month = new Date(shipment.createdAt).toLocaleDateString("en-US", { month: "short" });
      acc[month] ??= { shipments: 0, delivered: 0 };
      acc[month].shipments += 1;
      if (shipment.status === "delivered") acc[month].delivered += 1;
      return acc;
    }, {}),
  ).map(([month, values]) => ({ month, ...values }));

  const participation = [
    { month: "Current", travelers: new Set(flights.map((flight) => flight.travelerId)).size },
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
    eligibilitySplit: [
      { name: "Eligible", value: shipments.filter((s) => s.eligibility.status === "eligible").length },
      { name: "Review", value: shipments.filter((s) => s.eligibility.status === "review").length },
      { name: "Rejected", value: shipments.filter((s) => s.eligibility.status === "rejected").length },
      { name: "Unchecked", value: shipments.filter((s) => s.eligibility.status === "unchecked").length },
    ].filter((d) => d.value > 0),
    riskSplit: [
      { name: "Low", value: shipments.filter((s) => riskProfile(s).risk === "low").length },
      { name: "Medium", value: shipments.filter((s) => riskProfile(s).risk === "medium").length },
      { name: "High", value: shipments.filter((s) => riskProfile(s).risk === "high").length },
    ].filter((d) => d.value > 0),
  };
}
