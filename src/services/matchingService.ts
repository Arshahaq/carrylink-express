import type { Flight, MatchBreakdown, Shipment, TravelerMatch, User } from "@/types";
import { getState, setState, uid } from "./store";

export const MATCH_WEIGHTS = [
  { key: "Route compatibility", weight: 30 },
  { key: "Schedule compatibility", weight: 20 },
  { key: "Capacity compatibility", weight: 20 },
  { key: "Category eligibility", weight: 10 },
  { key: "Verification", weight: 10 },
  { key: "Urgency fit", weight: 10 },
];

export interface ScoredMatch {
  flight: Flight;
  traveler: User;
  score: number;
  breakdown: MatchBreakdown;
}

export function scoreFlight(shipment: Shipment, flight: Flight, traveler: User): ScoredMatch {
  const routeOk = flight.fromCity === shipment.route.fromCity && flight.toCity === shipment.route.toCity;
  const weightOk = flight.capacityKg >= shipment.item.weightKg;
  const scheduleOk = new Date(flight.date) <= new Date(shipment.route.deadline);
  const categoryOk = flight.categories.includes(shipment.item.category);
  const verificationOk = flight.verified && traveler.identityVerification === "demo-verified";
  const valueOk = flight.maxValueInr >= shipment.item.valueInr;

  let score = 0;
  if (routeOk) score += 30;
  if (scheduleOk) score += 20;
  if (weightOk) score += 20;
  if (categoryOk) score += 10;
  if (verificationOk) score += 10;
  if (shipment.route.urgency === "urgent" ? scheduleOk : true) score += 10;
  if (!valueOk) score -= 6;
  score = Math.max(0, Math.min(99, score - (traveler.rating < 4.6 ? 3 : 0)));

  return {
    flight,
    traveler,
    score,
    breakdown: {
      route: routeOk,
      weight: weightOk,
      schedule: scheduleOk,
      category: categoryOk,
      verification: verificationOk,
    },
  };
}

export function findMatches(shipment: Shipment): ScoredMatch[] {
  const { flights, users } = getState();
  return flights
    .filter((f) => f.travelerId !== shipment.senderId)
    .map((f) => {
      const traveler = users.find((u) => u.id === f.travelerId)!;
      return scoreFlight(shipment, f, traveler);
    })
    .filter((m) => m.traveler && m.traveler.status === "active" && m.breakdown.route && m.score >= 60)
    .sort((a, b) => b.score - a.score);
}

export function saveMatches(shipmentId: string, matches: ScoredMatch[]) {
  setState((prev) => ({
    ...prev,
    matches: [
      ...prev.matches.filter((m) => m.shipmentId !== shipmentId),
      ...matches.map<TravelerMatch>((m) => ({
        id: uid("match"),
        shipmentId,
        travelerId: m.traveler.id,
        travelerName: m.traveler.name,
        flightId: m.flight.id,
        score: m.score,
        breakdown: m.breakdown,
        requested: false,
      })),
    ],
  }));
  return getState().matches.filter((m) => m.shipmentId === shipmentId);
}

export function matchesForShipment(shipmentId: string) {
  return getState().matches.filter((m) => m.shipmentId === shipmentId);
}

/** Compatible open requests for a traveler's flights. */
export function requestsForTraveler(travelerId: string) {
  const { shipments, flights, users } = getState();
  const myFlights = flights.filter((f) => f.travelerId === travelerId);
  const traveler = users.find((u) => u.id === travelerId);
  if (!traveler) return [];
  const open = shipments.filter(
    (s) =>
      s.senderId !== travelerId &&
      !s.travelerId &&
      s.eligibility.status === "eligible" &&
      ["awaiting-match", "matched", "pending"].includes(s.status),
  );
  const results: Array<{ shipment: Shipment; flight: Flight; score: number }> = [];
  for (const shipment of open) {
    for (const flight of myFlights) {
      const scored = scoreFlight(shipment, flight, traveler);
      if (scored.breakdown.route && scored.score >= 60) {
        results.push({ shipment, flight, score: scored.score });
      }
    }
  }
  const seen = new Set<string>();
  return results
    .sort((a, b) => b.score - a.score)
    .filter((r) => (seen.has(r.shipment.id) ? false : seen.add(r.shipment.id)));
}
