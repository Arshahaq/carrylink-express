export type Mode = "sender" | "traveler" | "admin";

export type VerificationLevel = "unverified" | "pending" | "demo-verified";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  avatarInitials: string;
  role: "user" | "admin";
  modes: Mode[];
  emailVerified: boolean;
  phoneVerified: boolean;
  identityVerification: VerificationLevel;
  passportMasked: string;
  completedShipments: number;
  completedTransfers: number;
  rating: number;
  status: "active" | "suspended";
  city: string;
}

export type ItemCategoryId =
  | "documents"
  | "electronics"
  | "personal"
  | "medicines"
  | "food"
  | "business"
  | "other";

export interface ItemCategory {
  id: ItemCategoryId;
  label: string;
  icon: string;
  description: string;
  subtypes: string[];
}

export type ShipmentStatus =
  | "pending"
  | "verification-required"
  | "awaiting-match"
  | "matched"
  | "handover-pending"
  | "in-transit"
  | "arrived"
  | "delivered"
  | "flagged"
  | "frozen"
  | "rejected";

export type EligibilityStatus = "eligible" | "review" | "rejected" | "unchecked";

export type RiskLevel = "low" | "medium" | "high";

export interface CustodyEvent {
  id: string;
  label: string;
  timestamp: string;
  method: string;
  status: "done" | "current" | "upcoming";
}

export interface ShipmentItem {
  category: ItemCategoryId;
  subtype: string;
  name: string;
  quantity: number;
  weightKg: number;
  dimensions: string;
  valueInr: number;
  condition: "new" | "used";
  purpose: string;
  hasBattery?: boolean;
  batteryType?: string;
  prescriptionRequired?: boolean;
  supportingDocument?: string;
  sealed?: boolean;
  documentType?: string;
  sensitive?: boolean;
  commercial?: boolean;
  commercialQuantity?: boolean;
}

export interface ShipmentRoute {
  fromCity: string;
  toCity: string;
  deadline: string;
  urgency: "standard" | "urgent";
  pickupPreference: string;
  deliveryPreference: string;
}

export interface EligibilityResult {
  status: EligibilityStatus;
  reasons: string[];
  requiredDocuments: string[];
  checkedAt: string;
}

export interface Shipment {
  id: string;
  code: string;
  senderId: string;
  senderName: string;
  travelerId?: string;
  travelerName?: string;
  flightId?: string;
  item: ShipmentItem;
  route: ShipmentRoute;
  status: ShipmentStatus;
  eligibility: EligibilityResult;
  rewardInr: number;
  risk: RiskLevel;
  riskReason?: string;
  flagged: boolean;
  recipientName: string;
  deliveryOtp: string;
  custody: CustodyEvent[];
  createdAt: string;
  updatedAt: string;
  adminNote?: string;
  descriptionEdits: number;
}

export interface Flight {
  id: string;
  travelerId: string;
  travelerName: string;
  fromCity: string;
  fromAirport: string;
  toCity: string;
  toAirport: string;
  flightNumber: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  capacityKg: number;
  categories: ItemCategoryId[];
  maxValueInr: number;
  pickupPreference: string;
  deliveryPreference: string;
  verified: boolean;
}

export interface MatchBreakdown {
  route: boolean;
  weight: boolean;
  schedule: boolean;
  category: boolean;
  verification: boolean;
}

export interface TravelerMatch {
  id: string;
  shipmentId: string;
  travelerId: string;
  travelerName: string;
  flightId: string;
  score: number;
  breakdown: MatchBreakdown;
  requested: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  icon: "verified" | "warning" | "package" | "flight" | "location" | "otp" | "message";
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  link?: string;
}

export interface Message {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
  flagged?: boolean;
}

export interface Thread {
  id: string;
  shipmentCode: string;
  participantIds: string[];
  participantNames: string[];
  subject: string;
  blocked?: boolean;
  reported?: boolean;
}

export interface AdminAction {
  id: string;
  actor: string;
  action: string;
  target: string;
  createdAt: string;
}

export interface AppState {
  users: User[];
  currentUserId: string | null;
  mode: Mode | null;
  shipments: Shipment[];
  flights: Flight[];
  matches: TravelerMatch[];
  notifications: Notification[];
  threads: Thread[];
  messages: Message[];
  adminActions: AdminAction[];
}
