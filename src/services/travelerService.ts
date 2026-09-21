import { cityMeta } from "@/data/categories";
import { getState, setState, uid } from "./store";
import { notify } from "./notificationService";
import type { Flight, ItemCategoryId } from "@/types";

export interface AddFlightInput {
  fromCity: string;
  toCity: string;
  flightNumber: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  capacityKg: number;
  categories: ItemCategoryId[];
  maxValueInr: number;
  pickupPreference: string;
  deliveryPreference: string;
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
    title: "Flight verified",
    body: `${flight.flightNumber} · ${flight.fromAirport} → ${flight.toAirport} passed simulated flight verification.`,
    link: "/traveler/flights",
  });
  return flight;
}

export function removeFlight(flightId: string) {
  setState((prev) => ({ ...prev, flights: prev.flights.filter((f) => f.id !== flightId) }));
}
