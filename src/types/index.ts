export type UserRole = "homeowner" | "pro" | "admin";

/** Job lifecycle — separate from per-offer status */
export type JobStatus =
  | "draft"
  | "active"
  | "getting_quotes"
  | "quotes_in"
  | "hired"
  | "scheduled"
  | "en_route"
  | "in_progress"
  | "awaiting_confirm"
  | "completed"
  | "cancelled"
  | "disputed";

/** Per-offer status — a job can have many offers */
export type OfferStatus =
  | "pending"
  | "countered"
  | "accepted"
  | "rejected"
  | "withdrawn"
  | "expired";

export type QuotePriceType = "fixed" | "estimate" | "hourly" | "time_and_materials";

export type Urgency = "asap" | "this_week" | "two_weeks" | "flexible";

export type PropertyType =
  | "single_family"
  | "condo"
  | "townhome"
  | "apartment"
  | "commercial"
  | "other";

export type ClearanceStatus = "cleared" | "pending" | "rejected" | "suspended";

export type ChangeRequestStatus = "pending" | "approved" | "rejected";

export type BookingStatus = "pending_schedule" | "confirmed" | "reschedule_requested";

/** How the homeowner will pay the pro — never collected by HomeFix */
export type DirectPaymentMethod =
  | "cash"
  | "bank_transfer"
  | "mobile_banking"
  | "zelle"
  | "card"
  | "check"
  | "other";

export type JobVisibility = "open" | "direct";

export interface PriceChangeRecord {
  id: string;
  previousAmount: number;
  newAmount: number;
  reason: string;
  changedAt: string;
  homeownerAcknowledgedAt?: string;
  proAcknowledgedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  summary: string;
  typicalRange: string;
  unit: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  avatar?: string;
}

export interface Professional {
  id: string;
  name: string;
  businessName: string;
  trade: string;
  categorySlug: string;
  city: string;
  state: string;
  zip: string;
  radiusMiles: number;
  yearsInBusiness: string;
  rating: number;
  reviewCount: number;
  jobsCompleted: number;
  responseTime: string;
  bio: string;
  clearance: ClearanceStatus;
  licensed: boolean;
  insured: boolean;
  emergency: boolean;
  /** Profile starting price — final job price comes from the offer */
  startingPrice: number;
  /** Short availability note shown on profile */
  availabilityNote: string;
  /** True if they can take work this week */
  availableThisWeek: boolean;
}

export interface IntakeAnswer {
  id: string;
  label: string;
  value: string;
}

export interface Job {
  id: string;
  title: string;
  categorySlug: string;
  description: string;
  zip: string;
  city: string;
  state: string;
  urgency: Urgency;
  budget?: string;
  propertyType?: PropertyType;
  status: JobStatus;
  postedAt: string;
  homeownerName: string;
  intakeAnswers?: IntakeAnswer[];
  /** Direct request to one professional. Open jobs omit this. */
  requestedProId?: string;
  visibility?: JobVisibility;
  photos?: string[];
  matchedProIds?: string[];
}

export interface Quote {
  id: string;
  jobId: string;
  proId: string;
  priceType: QuotePriceType;
  amount: number;
  priceMax?: number;
  scope: string;
  /** What’s not included */
  exclusions?: string;
  availability: string;
  warranty?: string;
  materialsIncluded?: boolean;
  estimatedDuration?: string;
  proposedSchedule?: string;
  expiresAt?: string;
  paymentTerms?: string;
  /** Additional contractor notes or jobsite access instructions */
  notes?: string;
  status: OfferStatus;
  createdAt?: string;
  /** Homeowner counter-proposal */
  counterAmount?: number;
  counterNote?: string;
}

export interface Booking {
  jobId: string;
  quoteId: string;
  proId: string;
  homeownerName?: string;
  agreedPrice: number;
  scheduledDate: string;
  scheduledTime: string;
  arrivalWindow?: string;
  scopeSnapshot: string;
  status: BookingStatus;
  notes?: string;
  acceptedAt?: string;
  /** Agreed off-platform method — not proof of payment */
  paymentArrangement?: DirectPaymentMethod;
  paymentTerms?: string;
  paymentMethod?: DirectPaymentMethod;
  paymentReceiptNumber?: string;
  paidAt?: string;
  paymentConfirmedByHomeowner?: boolean;
  paymentConfirmedByPro?: boolean;
  priceHistory?: PriceChangeRecord[];
}

export interface ChangeRequest {
  id: string;
  jobId: string;
  amount: number;
  previousAmount?: number;
  newAmount?: number;
  reason: string;
  status: ChangeRequestStatus;
  createdAt: string;
  proposedBy?: "homeowner" | "pro";
  homeownerAcknowledged?: boolean;
  proAcknowledged?: boolean;
}

export interface JobCompletion {
  jobId: string;
  proMarkedAt?: string;
  homeownerConfirmedAt?: string;
  completionNotes?: string;
  paymentMethod?: DirectPaymentMethod;
  receiptNumber?: string;
}

export interface ChatMessage {
  id: string;
  sender: "homeowner" | "pro";
  senderName: string;
  body: string;
  sentAt: string;
  read?: boolean;
  attachment?: {
    name: string;
    size: string;
    type: string;
    url?: string;
  };
}

export interface MessageThread {
  id: string;
  /** Omit or use dm:proId for direct chats without a job */
  jobId: string;
  jobTitle: string;
  otherParty: string;
  proId?: string;
  unread: number;
  lastMessage: string;
  lastSender: "homeowner" | "pro";
  updatedAt: string;
  messages: ChatMessage[];
  /** True when started from a pro profile, not a job */
  isDirect?: boolean;
}

export interface IntakeDraft {
  problem: string;
  categorySlug: string;
  zip: string;
  title: string;
  summary: string;
  followUps: string[];
  answers?: Record<string, string>;
}
