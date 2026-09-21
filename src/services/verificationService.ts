import type { EligibilityResult, ShipmentItem, ShipmentRoute } from "@/types";

export const ELIGIBILITY_STEPS = [
  "Checking category",
  "Checking item details",
  "Checking weight",
  "Checking battery information",
  "Checking destination requirements",
  "Checking transport restrictions",
];

export const ELIGIBILITY_COPY = {
  eligible: {
    title: "Eligible for matching",
    body: "This item passes the prototype's initial eligibility checks. Final transport remains subject to applicable airline, airport, customs and legal requirements.",
  },
  review: {
    title: "Additional Verification Required",
    body: "Additional information or documentation is required before this shipment can be matched.",
  },
  rejected: {
    title: "Unable to Proceed",
    body: "The item cannot be accepted under the platform's current rules.",
  },
} as const;

/**
 * Demo eligibility engine. Rule-based stand-in for a real compliance service.
 */
export function checkEligibility(item: ShipmentItem, route: ShipmentRoute): EligibilityResult {
  const reasons: string[] = [];
  const documents: string[] = [];
  let status: EligibilityResult["status"] = "eligible";

  const escalate = (next: EligibilityResult["status"]) => {
    const order = { eligible: 0, review: 1, rejected: 2, unchecked: -1 } as const;
    if (order[next] > order[status]) status = next;
  };

  if (item.weightKg > 10) {
    escalate("rejected");
    reasons.push("Declared weight exceeds the 10 kg platform limit for traveler-carried items.");
  } else if (item.weightKg > 5) {
    escalate("review");
    reasons.push("Weight above 5 kg requires a traveler with extra declared capacity.");
  } else {
    reasons.push("Weight within traveler-carry limits.");
  }

  if (item.valueInr > 200000) {
    escalate("rejected");
    reasons.push("Declared value exceeds the platform's maximum accepted value.");
  } else if (item.valueInr > 50000) {
    escalate("review");
    reasons.push("Declared value above the review threshold.");
    documents.push("Purchase invoice");
  }

  switch (item.category) {
    case "documents":
      reasons.push("Document category permitted.");
      if (item.sensitive) {
        reasons.push("Sensitive documents will use sealed-envelope handover.");
      }
      break;
    case "electronics":
      if (item.hasBattery) {
        if ((item.batteryType ?? "").toLowerCase().includes("loose")) {
          escalate("rejected");
          reasons.push("Loose lithium batteries cannot be carried under transport restrictions.");
        } else {
          escalate("review");
          reasons.push("Battery-powered device requires a battery declaration.");
          documents.push("Battery declaration");
        }
      } else {
        reasons.push("No battery declared for this device.");
      }
      break;
    case "medicines":
      escalate("review");
      reasons.push("Medicines require documentation review before matching.");
      documents.push(item.prescriptionRequired ? "Doctor's prescription" : "Product information sheet");
      documents.push("Recipient declaration");
      break;
    case "food":
      if (item.sealed === false) {
        escalate("rejected");
        reasons.push("Unsealed food items cannot be accepted.");
      } else {
        reasons.push("Sealed packaged food accepted for this destination.");
      }
      break;
    case "business":
      if (item.commercialQuantity) {
        escalate("review");
        reasons.push("Commercial quantities require additional declarations.");
        documents.push("Commercial invoice");
      } else {
        reasons.push("Business item within personal-quantity limits.");
      }
      break;
    case "personal":
      reasons.push("Personal item category permitted.");
      break;
    case "other":
      escalate("review");
      reasons.push("Unlisted items require manual verification by operations.");
      documents.push("Item photographs");
      break;
  }

  if (route.fromCity === route.toCity) {
    escalate("rejected");
    reasons.push("Origin and destination cannot be the same.");
  } else {
    reasons.push(`Destination requirements checked for ${route.toCity}.`);
  }

  return {
    status,
    reasons,
    requiredDocuments: [...new Set(documents)],
    checkedAt: new Date().toISOString(),
  };
}

export const RISK_KEYWORDS = [
  "don't declare",
  "dont declare",
  "do not declare",
  "open the package",
  "carry something else",
  "don't tell customs",
  "dont tell customs",
  "hide",
  "unsealed",
];

export function detectMessageRisk(body: string) {
  const lower = body.toLowerCase();
  const hit = RISK_KEYWORDS.find((k) => lower.includes(k));
  return {
    flagged: Boolean(hit),
    keyword: hit,
    message:
      "Please keep all shipment details accurate and follow applicable transport requirements.",
  };
}
