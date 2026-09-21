import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Package, ShieldCheck, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { CATEGORIES, DELIVERY_OPTIONS, PICKUP_OPTIONS } from "@/data/categories";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createShipment, requestHandover, shipmentById } from "@/services/shipmentService";
import { findMatches } from "@/services/matchingService";
import { checkEligibility, ELIGIBILITY_COPY } from "@/services/verificationService";
import type { EligibilityResult, ShipmentItem, ShipmentRoute } from "@/types";

type DraftState = {
  category: ShipmentItem["category"];
  subtype: string;
  name: string;
  quantity: number;
  weightKg: number;
  valueInr: number;
  purpose: string;
  dimensions: string;
  condition: ShipmentItem["condition"];
  hasBattery: boolean;
  batteryType: string;
  recipientName: string;
  fromCity: string;
  toCity: string;
  deadline: string;
  urgency: ShipmentRoute["urgency"];
  pickupPreference: string;
  deliveryPreference: string;
};

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(0, 0, 0, 0);

const emptyDraft: DraftState = {
  category: "documents",
  subtype: "University documents",
  name: "University Documents",
  quantity: 1,
  weightKg: 0.5,
  valueInr: 2500,
  purpose: "University admission submission",
  dimensions: "30 x 22 x 2 cm",
  condition: "new",
  hasBattery: false,
  batteryType: "",
  recipientName: "Aisha Rahman",
  fromCity: "Bengaluru, India",
  toCity: "Dubai, UAE",
  deadline: tomorrow.toISOString().slice(0, 10),
  urgency: "standard",
  pickupPreference: "Designated location",
  deliveryPreference: "Airport",
};

const steps = ["Item details", "Route & recipient", "Eligibility", "Match & request"] as const;

export const Route = createFileRoute("/sender/create")({
  component: CreateShipmentRoute,
});

function CreateShipmentRoute() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<DraftState>(emptyDraft);
  const [eligibility, setEligibility] = useState<EligibilityResult | null>(null);
  const [createdShipmentId, setCreatedShipmentId] = useState<string | null>(null);
  const [selectedTravelerId, setSelectedTravelerId] = useState<string | null>(null);
  const navigate = useNavigate();

  const category = useMemo(
    () => CATEGORIES.find((c) => c.id === draft.category) ?? CATEGORIES[0],
    [draft.category],
  );

  const currentItem: ShipmentItem = {
    category: draft.category,
    subtype: draft.subtype,
    name: draft.name,
    quantity: draft.quantity,
    weightKg: draft.weightKg,
    dimensions: draft.dimensions,
    valueInr: draft.valueInr,
    condition: draft.condition,
    purpose: draft.purpose,
    hasBattery: draft.hasBattery ? true : undefined,
    batteryType: draft.hasBattery ? draft.batteryType || "Lithium-ion (built-in)" : undefined,
  };

  const currentRoute: ShipmentRoute = {
    fromCity: draft.fromCity,
    toCity: draft.toCity,
    deadline: draft.deadline,
    urgency: draft.urgency,
    pickupPreference: draft.pickupPreference,
    deliveryPreference: draft.deliveryPreference,
  };

  const currentEligibility = eligibility ?? checkEligibility(currentItem, currentRoute);
  const previewMatches = createdShipmentId ? (shipmentById(createdShipmentId) ? findMatches(shipmentById(createdShipmentId)!) : []) : [];

  function updateField<K extends keyof DraftState>(key: K, value: DraftState[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
    if (key === "category") {
      const nextCategory = CATEGORIES.find((item) => item.id === (value as string));
      if (nextCategory) {
        setDraft((prev) => ({ ...prev, subtype: nextCategory.subtypes[0] ?? prev.subtype }));
      }
    }
  }

  function nextStep() {
    if (step === 2) {
      setEligibility(checkEligibility(currentItem, currentRoute));
    }
    if (step < steps.length - 1) {
      setStep((prev) => prev + 1);
    }
  }

  function previousStep() {
    setStep((prev) => Math.max(0, prev - 1));
  }

  function createAndRequest() {
    const evaluated = checkEligibility(currentItem, currentRoute);
    const created = createShipment({
      item: currentItem,
      route: currentRoute,
      eligibility: evaluated,
      recipientName: draft.recipientName,
    });
    setEligibility(evaluated);
    setCreatedShipmentId(created.id);
    const firstMatch = findMatches(created)[0];
    setSelectedTravelerId(firstMatch?.traveler.id ?? null);
    setStep(3);
  }

  function handleRequestTraveler() {
    if (!createdShipmentId || !selectedTravelerId) return;
    const shipment = shipmentById(createdShipmentId);
    const match = previewMatches.find((candidate) => candidate.traveler.id === selectedTravelerId);
    if (!shipment || !match) return;
    requestHandover(shipment.id, match.traveler.id, match.flight.id);
    navigate({ to: `/shipments/${shipment.id}` });
  }

  const renderStep = () => {
    if (step === 0) {
      return (
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium">
              Category
              <select
                value={draft.category}
                onChange={(event) => updateField("category", event.target.value as DraftState["category"])}
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm"
              >
                {CATEGORIES.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm font-medium">
              Subtype
              <select
                value={draft.subtype}
                onChange={(event) => updateField("subtype", event.target.value)}
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm"
              >
                {category.subtypes.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm font-medium md:col-span-2">
              Item name
              <Input value={draft.name} onChange={(event) => updateField("name", event.target.value)} />
            </label>

            <label className="space-y-2 text-sm font-medium">
              Quantity
              <Input type="number" min={1} value={draft.quantity} onChange={(event) => updateField("quantity", Number(event.target.value || 1))} />
            </label>

            <label className="space-y-2 text-sm font-medium">
              Weight (kg)
              <Input type="number" min={0.1} step={0.1} value={draft.weightKg} onChange={(event) => updateField("weightKg", Number(event.target.value || 0.1))} />
            </label>

            <label className="space-y-2 text-sm font-medium">
              Estimated value (₹)
              <Input type="number" min={0} value={draft.valueInr} onChange={(event) => updateField("valueInr", Number(event.target.value || 0))} />
            </label>

            <label className="space-y-2 text-sm font-medium">
              Condition
              <select
                value={draft.condition}
                onChange={(event) => updateField("condition", event.target.value as ShipmentItem["condition"])}
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm"
              >
                <option value="new">New</option>
                <option value="used">Used</option>
              </select>
            </label>

            <label className="space-y-2 text-sm font-medium md:col-span-2">
              Item purpose
              <Textarea value={draft.purpose} onChange={(event) => updateField("purpose", event.target.value)} rows={3} />
            </label>

            <label className="space-y-2 text-sm font-medium md:col-span-2">
              Dimensions
              <Input value={draft.dimensions} onChange={(event) => updateField("dimensions", event.target.value)} />
            </label>
          </div>
        </div>
      );
    }

    if (step === 1) {
      return (
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium">
              From city
              <select value={draft.fromCity} onChange={(event) => updateField("fromCity", event.target.value)} className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm">
                {[
                  "Bengaluru, India",
                  "Mumbai, India",
                  "Delhi, India",
                  "Dubai, UAE",
                  "London, UK",
                  "Singapore",
                  "Toronto, Canada",
                  "New York, USA",
                ].map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm font-medium">
              To city
              <select value={draft.toCity} onChange={(event) => updateField("toCity", event.target.value)} className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm">
                {[
                  "Bengaluru, India",
                  "Mumbai, India",
                  "Delhi, India",
                  "Dubai, UAE",
                  "London, UK",
                  "Singapore",
                  "Toronto, Canada",
                  "New York, USA",
                ].map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm font-medium">
              Deadline
              <Input type="date" value={draft.deadline} onChange={(event) => updateField("deadline", event.target.value)} />
            </label>

            <label className="space-y-2 text-sm font-medium">
              Urgency
              <select value={draft.urgency} onChange={(event) => updateField("urgency", event.target.value as ShipmentRoute["urgency"])} className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm">
                <option value="standard">Standard</option>
                <option value="urgent">Urgent</option>
              </select>
            </label>

            <label className="space-y-2 text-sm font-medium">
              Pickup preference
              <select value={draft.pickupPreference} onChange={(event) => updateField("pickupPreference", event.target.value)} className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm">
                {PICKUP_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm font-medium">
              Delivery preference
              <select value={draft.deliveryPreference} onChange={(event) => updateField("deliveryPreference", event.target.value)} className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm">
                {DELIVERY_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm font-medium md:col-span-2">
              Recipient name
              <Input value={draft.recipientName} onChange={(event) => updateField("recipientName", event.target.value)} />
            </label>
          </div>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-full bg-accent-soft text-accent">
                <ShieldCheck className="size-5" aria-hidden />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Eligibility status</p>
                <h3 className="text-xl font-bold">{ELIGIBILITY_COPY[currentEligibility.status].title}</h3>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {ELIGIBILITY_COPY[currentEligibility.status].body}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface p-4">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Checks</h4>
              <ul className="mt-3 space-y-2 text-sm">
                {currentEligibility.reasons.map((reason) => (
                  <li key={reason} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-surface p-4">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Required documents</h4>
              <ul className="mt-3 space-y-2 text-sm">
                {currentEligibility.requiredDocuments.length === 0 ? (
                  <li className="text-muted-foreground">No additional documents required.</li>
                ) : (
                  currentEligibility.requiredDocuments.map((doc) => (
                    <li key={doc} className="flex gap-2">
                      <Package className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                      <span>{doc}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-5">
        {createdShipmentId ? (
          <>
            <div className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-full bg-success-soft text-success">
                  <Sparkles className="size-5" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Shipment created</p>
                  <h3 className="text-xl font-bold">{shipmentById(createdShipmentId)?.code}</h3>
                </div>
              </div>
            </div>

            {previewMatches.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-surface p-6 text-sm text-muted-foreground">
                No compatible travelers matched this route yet. You can continue refining the item details or revisit the shipment later.
              </div>
            ) : (
              <div className="space-y-3">
                {previewMatches.map((candidate) => (
                  <button
                    key={`${candidate.flight.id}-${candidate.traveler.id}`}
                    type="button"
                    onClick={() => setSelectedTravelerId(candidate.traveler.id)}
                    className={`w-full rounded-xl border p-4 text-left transition-colors ${
                      selectedTravelerId === candidate.traveler.id ? "border-accent bg-accent-soft" : "border-border bg-surface hover:border-accent/30"
                    }`}
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-base font-semibold">{candidate.traveler.name}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {candidate.flight.flightNumber} · {candidate.flight.fromAirport} → {candidate.flight.toAirport}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {candidate.flight.date} · Capacity {candidate.flight.capacityKg} kg
                        </p>
                      </div>
                      <div className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">
                        {candidate.score}% match
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-surface p-6 text-sm text-muted-foreground">
            Complete the previous step to create the shipment and generate a live traveler match list.
          </div>
        )}
      </div>
    );
  };

  return (
    <RequireAuth requireMode="sender">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Shipment intake</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Create Shipment</h1>
          </div>

          <Button asChild variant="outline">
            <Link to="/sender/dashboard">
              <ArrowLeft className="size-4" aria-hidden />
              Dashboard
            </Link>
          </Button>
        </div>

        <div className="card-soft p-4">
          <div className="grid gap-2 sm:grid-cols-4">
            {steps.map((title, index) => (
              <div
                key={title}
                className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                  index === step ? "border-accent bg-accent-soft text-accent" : index < step ? "border-success bg-success-soft text-success" : "border-border bg-surface text-muted-foreground"
                }`}
              >
                {title}
              </div>
            ))}
          </div>
        </div>

        <div className="card-soft p-6">{renderStep()}</div>

        <div className="flex justify-between gap-3">
          <Button variant="outline" onClick={previousStep} disabled={step === 0}>
            Previous
          </Button>

          <div className="flex gap-3">
            {step < steps.length - 1 ? (
              <Button onClick={nextStep}>
                {step === 2 ? "Review eligibility" : "Continue"}
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            ) : null}

            {step === 2 ? <Button onClick={createAndRequest}>Create Shipment</Button> : null}

            {step === 3 && createdShipmentId && previewMatches.length > 0 ? (
              <Button onClick={handleRequestTraveler} disabled={!selectedTravelerId}>Request Traveler</Button>
            ) : null}
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
