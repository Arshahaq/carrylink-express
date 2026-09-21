import { getState, setState, uid } from "./store";
import { notify } from "./notificationService";
import { cityMeta } from "@/data/categories";
import { DEMO_OTP } from "@/data/seed";
import type {
  CustodyEvent,
  EligibilityResult,
  Shipment,
  ShipmentItem,
  ShipmentRoute,
  ShipmentStatus,
} from "@/types";

export const STATUS_LABELS: Record<ShipmentStatus, string> = {
  pending: "Pending",
  "verification-required": "Verification Required",
  "awaiting-match": "Awaiting Match",
  matched: "Traveler Matched",
  "handover-pending": "Handover Pending",
  "in-transit": "In Transit",
  arrived: "Arrived",
  delivered: "Delivered",
  flagged: "Flagged",
  frozen: "Frozen",
  rejected: "Rejected",
};

export type StatusTone = "neutral" | "info" | "success" | "warning" | "danger";

export const STATUS_TONES: Record<ShipmentStatus, StatusTone> = {
  pending: "neutral",
  "verification-required": "warning",
  "awaiting-match": "neutral",
  matched: "info",
  "handover-pending": "warning",
  "in-transit": "info",
  arrived: "info",
  delivered: "success",
  flagged: "danger",
  frozen: "danger",
  rejected: "danger",
};

export const TIMELINE_STEPS = [
  "Shipment Created",
  "Eligibility Checked",
  "Traveler Matched",
  "Handover Completed",
  "In Transit",
  "Destination Arrival",
  "Recipient Verification",
  "Delivered",
];

function makeCode(from: string, to: string) {
  const a = cityMeta(from)?.airport ?? "IND";
  const b = cityMeta(to)?.airport ?? "INT";
  const suffix = Math.random().toString(16).slice(2, 6).toUpperCase();
  return `AB-${a}-${b}-${suffix}`;
}

function event(label: string, method: string): CustodyEvent {
  return {
    id: uid("ce"),
    label,
    timestamp: new Date().toISOString(),
    method,
    status: "current",
  };
}

function rebuildTimeline(shipment: Shipment): CustodyEvent[] {
  const done = shipment.custody.filter((e) => e.status !== "upcoming");
  const doneLabels = new Set(done.map((e) => e.label));
  const upcoming = TIMELINE_STEPS.filter((s) => !doneLabels.has(s)).map<CustodyEvent>((label) => ({
    id: uid("ce"),
    label,
    timestamp: "",
    method: "Pending",
    status: "upcoming",
  }));
  return [
    ...done.map((e, i) => ({ ...e, status: i === done.length - 1 ? ("current" as const) : ("done" as const) })),
    ...upcoming,
  ];
}

export function shipmentById(id: string) {
  const s = getState().shipments;
  return s.find((x) => x.id === id) ?? s.find((x) => x.code === id);
}

export function shipmentsForSender(userId: string) {
  return getState().shipments.filter((s) => s.senderId === userId);
}

export function shipmentsForTraveler(userId: string) {
  return getState().shipments.filter((s) => s.travelerId === userId);
}

export function updateShipment(id: string, patch: Partial<Shipment>) {
  setState((prev) => ({
    ...prev,
    shipments: prev.shipments.map((s) =>
      s.id === id ? { ...s, ...patch, updatedAt: new Date().toISOString() } : s,
    ),
  }));
  return shipmentById(id);
}

export function addCustodyEvent(id: string, label: string, method: string) {
  const shipment = shipmentById(id);
  if (!shipment) return;
  const withEvent: Shipment = {
    ...shipment,
    custody: [...shipment.custody.filter((e) => e.status !== "upcoming"), event(label, method)],
  };
  updateShipment(id, { custody: rebuildTimeline(withEvent) });
}

export interface CreateShipmentInput {
  item: ShipmentItem;
  route: ShipmentRoute;
  eligibility: EligibilityResult;
  recipientName: string;
}

export function estimateReward(weightKg: number, urgency: "standard" | "urgent", valueInr: number) {
  const base = 600 + Math.round(weightKg * 420);
  const urgencyFee = urgency === "urgent" ? 250 : 0;
  const careFee = Math.round(Math.min(valueInr * 0.01, 900));
  return base + urgencyFee + careFee;
}

export function createShipment(input: CreateShipmentInput): Shipment {
  const state = getState();
  const sender = state.users.find((u) => u.id === state.currentUserId)!;
  const status: ShipmentStatus =
    input.eligibility.status === "eligible"
      ? "awaiting-match"
      : input.eligibility.status === "review"
        ? "verification-required"
        : "rejected";

  const shipment: Shipment = {
    id: uid("s"),
    code: makeCode(input.route.fromCity, input.route.toCity),
    senderId: sender.id,
    senderName: sender.name,
    item: input.item,
    route: input.route,
    status,
    eligibility: input.eligibility,
    rewardInr: estimateReward(input.item.weightKg, input.route.urgency, input.item.valueInr),
    risk: input.eligibility.status === "eligible" ? "low" : "medium",
    riskReason: input.eligibility.status === "eligible" ? undefined : input.eligibility.reasons[0],
    flagged: input.eligibility.status === "rejected",
    recipientName: input.recipientName,
    deliveryOtp: DEMO_OTP,
    custody: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    descriptionEdits: 0,
  };

  const created: Shipment = {
    ...shipment,
    custody: rebuildTimeline({
      ...shipment,
      custody: [
        { ...event("Shipment Created", "Account session"), status: "done" },
        event("Eligibility Checked", "Demo eligibility engine"),
      ],
    }),
  };

  setState((prev) => ({ ...prev, shipments: [created, ...prev.shipments] }));

  notify(sender.id, {
    icon: status === "verification-required" ? "warning" : "package",
    title: status === "verification-required" ? "Additional verification required" : "Shipment created",
    body: `${created.code} · ${created.item.name} (${created.route.fromCity.split(",")[0]} → ${created.route.toCity.split(",")[0]})`,
    link: `/shipments/${created.id}`,
  });

  return created;
}

export function requestHandover(shipmentId: string, travelerId: string, flightId: string) {
  const state = getState();
  const traveler = state.users.find((u) => u.id === travelerId);
  const shipment = shipmentById(shipmentId);
  if (!traveler || !shipment) return;

  updateShipment(shipmentId, {
    travelerId,
    travelerName: traveler.name,
    flightId,
    status: "matched",
  });
  addCustodyEvent(shipmentId, "Traveler Matched", "Smart matching engine");
  setState((prev) => ({
    ...prev,
    matches: prev.matches.map((m) =>
      m.shipmentId === shipmentId ? { ...m, requested: m.travelerId === travelerId } : m,
    ),
  }));

  notify(travelerId, {
    icon: "package",
    title: "New handover request",
    body: `${shipment.item.name} · ${shipment.route.fromCity.split(",")[0]} → ${shipment.route.toCity.split(",")[0]}`,
    link: `/traveler/requests/${shipmentId}`,
  });
  notify(shipment.senderId, {
    icon: "verified",
    title: "Traveler matched",
    body: `${traveler.name.split(" ")[0]} ${traveler.name.split(" ")[1]?.[0] ?? ""}. was requested for ${shipment.code}.`,
    link: `/shipments/${shipmentId}`,
  });
}

export function acceptRequest(shipmentId: string, travelerId: string, flightId: string) {
  const state = getState();
  const traveler = state.users.find((u) => u.id === travelerId);
  const shipment = shipmentById(shipmentId);
  if (!traveler || !shipment) return;

  updateShipment(shipmentId, {
    travelerId,
    travelerName: traveler.name,
    flightId,
    status: "handover-pending",
  });
  addCustodyEvent(shipmentId, "Traveler Matched", "Traveler acceptance");

  const existingThread = state.threads.find(
    (t) => t.shipmentCode === shipment.code && t.participantIds.includes(travelerId),
  );
  if (!existingThread) {
    setState((prev) => ({
      ...prev,
      threads: [
        ...prev.threads,
        {
          id: uid("t"),
          shipmentCode: shipment.code,
          participantIds: [shipment.senderId, travelerId],
          participantNames: [shipment.senderName, traveler.name],
          subject: `${shipment.item.name} · ${shipment.route.fromCity.split(",")[0]} → ${shipment.route.toCity.split(",")[0]}`,
        },
      ],
    }));
  }

  notify(shipment.senderId, {
    icon: "verified",
    title: "Traveler accepted your shipment",
    body: `${traveler.name} accepted ${shipment.code}. Handover is now pending.`,
    link: `/shipments/${shipmentId}`,
  });
  notify(travelerId, {
    icon: "package",
    title: "Handover scheduled",
    body: `Complete the secure handover for ${shipment.code}.`,
    link: `/shipments/${shipmentId}/handover`,
  });
}

export function declineRequest(shipmentId: string, travelerId: string) {
  const shipment = shipmentById(shipmentId);
  if (!shipment) return;
  setState((prev) => ({
    ...prev,
    matches: prev.matches.filter((m) => !(m.shipmentId === shipmentId && m.travelerId === travelerId)),
  }));
  updateShipment(shipmentId, { status: "awaiting-match", travelerId: undefined, travelerName: undefined, flightId: undefined });
  notify(shipment.senderId, {
    icon: "warning",
    title: "Traveler declined",
    body: `${shipment.code} is back in the matching pool.`,
    link: `/shipments/${shipmentId}`,
  });
}

export function completeHandover(shipmentId: string) {
  const shipment = shipmentById(shipmentId);
  if (!shipment) return;
  addCustodyEvent(shipmentId, "Handover Completed", "QR + OTP + timestamp");
  updateShipment(shipmentId, { status: "in-transit" });
  addCustodyEvent(shipmentId, "In Transit", "Traveler confirmation");
  notify(shipment.senderId, {
    icon: "flight",
    title: "Handover completed",
    body: `${shipment.code} is now in transit (demo flight status).`,
    link: `/shipments/${shipmentId}`,
  });
  notify(shipment.senderId, {
    icon: "otp",
    title: "Delivery OTP generated",
    body: `Share OTP ${DEMO_OTP} with the recipient at delivery.`,
    link: `/shipments/${shipmentId}/delivery`,
  });
}

export function markArrived(shipmentId: string) {
  const shipment = shipmentById(shipmentId);
  if (!shipment) return;
  addCustodyEvent(shipmentId, "Destination Arrival", "Demo flight status");
  updateShipment(shipmentId, { status: "arrived" });
  notify(shipment.senderId, {
    icon: "location",
    title: "Shipment arrived",
    body: `${shipment.code} arrived at ${shipment.route.toCity}.`,
    link: `/shipments/${shipmentId}`,
  });
}

export function confirmDelivery(shipmentId: string, condition: string) {
  const shipment = shipmentById(shipmentId);
  if (!shipment) return;
  addCustodyEvent(shipmentId, "Recipient Verification", "OTP + QR");
  addCustodyEvent(shipmentId, "Delivered", `Recipient confirmation · condition: ${condition}`);
  updateShipment(shipmentId, { status: "delivered" });

  setState((prev) => ({
    ...prev,
    users: prev.users.map((u) => {
      if (u.id === shipment.senderId) return { ...u, completedShipments: u.completedShipments + 1 };
      if (u.id === shipment.travelerId) return { ...u, completedTransfers: u.completedTransfers + 1 };
      return u;
    }),
  }));

  notify(shipment.senderId, {
    icon: "verified",
    title: "Shipment delivered",
    body: `${shipment.code} was delivered to ${shipment.recipientName}.`,
    link: `/shipments/${shipmentId}`,
  });
  if (shipment.travelerId) {
    notify(shipment.travelerId, {
      icon: "verified",
      title: "Transfer completed",
      body: `Reward of ₹${shipment.rewardInr.toLocaleString("en-IN")} recorded (demo payment).`,
      link: `/shipments/${shipmentId}`,
    });
  }
}

export function submitVerificationDocuments(shipmentId: string) {
  const shipment = shipmentById(shipmentId);
  if (!shipment) return;
  addCustodyEvent(shipmentId, "Verification Cleared", "Demo document review");
  updateShipment(shipmentId, {
    status: "awaiting-match",
    flagged: false,
    risk: "low",
    eligibility: { ...shipment.eligibility, status: "eligible", requiredDocuments: [] },
  });
  notify(shipment.senderId, {
    icon: "verified",
    title: "Verification cleared",
    body: `${shipment.code} is now eligible for traveler matching.`,
    link: `/shipments/${shipmentId}`,
  });
}
