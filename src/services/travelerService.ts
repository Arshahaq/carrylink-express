import { cityMeta } from "@/data/categories";
import { getState, setState, uid } from "./store";
import { notify } from "./notificationService";
import { scoreFlight } from "./matchingService";
import { addCustodyEvent, shipmentById, updateShipment } from "./shipmentService";
import type { Flight, ItemCategoryId, Shipment } from "@/types";

export interface AddFlightInput {
  fromCity: string;
  toCity: string;
  airline: string;
  flightNumber: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  capacityKg: number;
  categories: ItemCategoryId[];
  maxValueInr: number;
  pickupPreference: string;
  deliveryPreference: string;
  notes?: string;
}

export function flightsFor(travelerId: string) {
  return getState().flights.filter((f) => f.travelerId === travelerId);
}

export function nextFlight(travelerId: string) {
  return flightsFor(travelerId)
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))[0];
}

export function addFlight(input: AddFlightInput): Flight {
  const state = getState();
  const traveler = state.users.find((u) => u.id === state.currentUserId)!;
  const flight: Flight = {
    id: uid("f"),
    travelerId: traveler.id,
    travelerName: traveler.name,
    airline: input.airline,
    ...(input.notes ? { notes: input.notes } : {}),
    fromCity: input.fromCity,
    fromAirport: cityMeta(input.fromCity)?.airport ?? "---",
    toCity: input.toCity,
    toAirport: cityMeta(input.toCity)?.airport ?? "---",
    flightNumber: input.flightNumber.toUpperCase(),
    date: input.date,
    departureTime: input.departureTime,
    arrivalTime: input.arrivalTime,
    capacityKg: input.capacityKg,
    categories: input.categories,
    maxValueInr: input.maxValueInr,
    pickupPreference: input.pickupPreference,
    deliveryPreference: input.deliveryPreference,
    verified: true,
  };
  setState((prev) => ({ ...prev, flights: [flight, ...prev.flights] }));
  notify(traveler.id, {
    icon: "verified",
    title: "Flight added successfully",
    body: `${flight.airline ?? "Flight"} ${flight.flightNumber} · ${flight.fromAirport} → ${flight.toAirport} is ready for matching.`,
    link: "/traveler/flights",
  });
  return flight;
}

export interface TravelerRequest {
  shipment: Shipment;
  flight: Flight;
  score: number;
}

export function requestsForTraveler(travelerId: string): TravelerRequest[] {
  const state = getState();
  const flights = state.flights.filter((flight) => flight.travelerId === travelerId);
  const acceptedShipmentIds = new Set(
    state.shipments
      .filter((shipment) => shipment.travelerId === travelerId)
      .filter((shipment) => shipment.custody.some((event) => event.label === "Traveler Accepted"))
      .map((shipment) => shipment.id),
  );

  return state.shipments
    .filter((shipment) => shipment.travelerId === travelerId)
    .filter((shipment) => shipment.status === "matched")
    .filter((shipment) => !acceptedShipmentIds.has(shipment.id))
    .flatMap((shipment) => {
      const flight = flights.find((candidate) => candidate.id === shipment.flightId);
      if (!flight) return [];
      const traveler = state.users.find((user) => user.id === travelerId);
      if (!traveler) return [];
      const scored = scoreFlight(shipment, flight, traveler);
      return [{ shipment, flight, score: scored.score }];
    });
}

export function acceptShipmentRequest(shipmentId: string, travelerId: string, flightId: string) {
  const shipment = shipmentById(shipmentId);
  const traveler = getState().users.find((user) => user.id === travelerId);
  if (!shipment || !traveler || shipment.travelerId !== travelerId || shipment.status !== "matched") return;

  updateShipment(shipmentId, {
    travelerId,
    travelerName: traveler.name,
    flightId,
    status: "matched",
  });
  addCustodyEvent(shipmentId, "Traveler Accepted", "Traveler confirmation");
  notify(shipment.senderId, {
    icon: "verified",
    title: "Traveler accepted your shipment request",
    body: `${traveler.name} accepted ${shipment.code} for ${shipment.flightId ?? flightId}.`,
    link: `/shipments/${shipmentId}`,
  });
  notify("u-admin", {
    icon: "verified",
    title: "Traveler accepted shipment",
    body: `${shipment.code} was accepted by ${traveler.name}.`,
    link: `/shipments/${shipmentId}`,
  });
  notify(travelerId, {
    icon: "package",
    title: "Shipment request accepted",
    body: `${shipment.code} is now matched to your flight.`,
    link: `/traveler/deliveries`,
  });
}

export function removeFlight(flightId: string) {
  setState((prev) => ({ ...prev, flights: prev.flights.filter((f) => f.id !== flightId) }));
}
