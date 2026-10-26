/**
 * Single product model for LocalHomeFix role journeys.
 * Keep UI copy and gates aligned with this file.
 */

export type ProductRole = "guest" | "homeowner" | "pro" | "admin";

export type SignupField = {
  key: string;
  label: string;
  required: boolean;
  why: string;
};

export const homeownerSignupFields: SignupField[] = [
  { key: "name", label: "Full name", required: true, why: "Shown on your requests and messages." },
  { key: "email", label: "Email", required: true, why: "Sign-in and quote alerts." },
  { key: "phone", label: "Mobile phone", required: true, why: "Pros unlock this only after clearance + membership." },
  { key: "zip", label: "Home ZIP", required: true, why: "Matches nearby reviewed professionals." },
  { key: "password", label: "Password", required: true, why: "Protects your free homeowner account." },
];

export const proSignupFields: SignupField[] = [
  { key: "name", label: "Full name", required: true, why: "Account owner on the application." },
  { key: "email", label: "Work email", required: true, why: "Sign-in and lead alerts." },
  { key: "phone", label: "Business phone", required: true, why: "Shared only after you are cleared and membership is active." },
  { key: "password", label: "Password", required: true, why: "Protects the pro account." },
  { key: "businessName", label: "Business name", required: true, why: "Public profile title after clearance." },
  { key: "trade", label: "Primary trade", required: true, why: "Which job board leads you see." },
  { key: "bio", label: "Short bio", required: true, why: "Helps homeowners choose you." },
  { key: "serviceZip", label: "Service ZIP", required: true, why: "Center of your service area." },
  { key: "radius", label: "Travel radius", required: true, why: "How far you will take jobs." },
  { key: "insurance", label: "Liability insurance", required: true, why: "Required before admin review." },
  { key: "license", label: "Trade license (if required)", required: false, why: "Upload evidence in Verification." },
  { key: "checkr", label: "Checkr screening consent", required: true, why: "Screening is separate from marketplace clearance." },
];

export const roleFeatures: Record<
  ProductRole,
  { can: string[]; cannot: string[]; landsOn: string }
> = {
  guest: {
    landsOn: "Public site only (/browse-pros, /pricing, /how-it-works)",
    can: ["Browse reviewed pro profiles", "Draft a request on the homepage (nothing posts yet)"],
    cannot: [
      "Post a live request",
      "Save pros",
      "Message anyone",
      "See the pro job board",
      "See homeowner phone/email",
    ],
  },
  homeowner: {
    landsOn: "/account — Your requests",
    can: [
      "Post a request (free)",
      "See your own jobs, quotes, messages, reviews",
      "Hire a quote and invite a saved pro",
      "Save professionals",
      "Manage profile, addresses, security",
    ],
    cannot: [
      "Pay LocalHomeFix a project fee (there is none)",
      "See the pro job board",
      "Start pro membership",
      "Quote other homeowners' jobs",
    ],
  },
  admin: {
    landsOn: "/admin — Queue, then disputes, then directory",
    can: [
      "Review applications: approve, request info, or reject with a note",
      "Suspend or restore public listings",
      "Resolve job disputes",
      "Oversee requests and membership state",
    ],
    cannot: [
      "Quote, hire, or message as a marketplace user",
      "Collect repair payments (none on-platform)",
      "Appear in Find a Pro",
    ],
  },
  pro: {
    landsOn: "/pro — Overview, then Application → Membership → Jobs",
    can: [
      "Track application / clearance",
      "Start $19.99 membership (3 free months)",
      "See matched open jobs after clearance",
      "Quote and message when membership is active",
      "Unlock homeowner contact when cleared + membership on",
    ],
    cannot: [
      "Post homeowner requests from a pro account",
      "See phone/email before clearance + active membership",
      "Quote while membership is paused or cancelled",
      "Appear in public search before admin clearance",
    ],
  },
};

/**
 * Demo persistence gap (do not pretend this is a backend):
 * Jobs, quotations, bookings, notifications, and admin notes live in Redux + localStorage.
 * There is no server database, email/SMS dispatcher, or payment processor for repair work.
 * Matching, accept/decline, and dispute notes are client-side so the marketplace loop can be exercised.
 */
export const implementationGaps = {
  persistence: "Browser localStorage only — not a multi-user production database.",
  notifications: "In-app notification records only. No real email/SMS/push.",
  payments: "HomeFix never charges homeowners or invoices repair work. Pros pay a subscription in the demo membership UI.",
  identity: "The signed-in demo pro is always pro-1. Other directory pros cannot log in.",
} as const;

/**
 * Marketplace loop:
 * Post job or request a specific pro → matched leads → quotation linked to that job →
 * compare / accept one → booking + agreed price → payment method (off-platform) →
 * work → dual confirm → review / dispute.
 *
 * Job status ≠ quotation status. One job, many quotations; accepting one creates one booking
 * and declines sibling quotations. Viewing a profile or posting a request is not a booking.
 */
export const marketplaceLoop = [
  "Browse or post",
  "Message or collect offers",
  "Compare / counter / accept",
  "Confirm schedule (booking)",
  "Work + optional change requests",
  "Pro marks done → homeowner confirms",
  "Pay the pro directly",
  "Review or dispute",
] as const;

/** What happens when a homeowner posts a request */
export const postJourney = {
  poster: "homeowner" as const,
  destination: {
    homeownerView: "/account/jobs/[id]",
    homeownerList: "/account",
    proBoard: "/pro/jobs",
    proDetail: "/pro/jobs/[id]",
  },
  whoSeesWhat: [
    {
      role: "Homeowner (you)",
      view: "Full request: tracker, photos, offers, compare, counter, booking, change requests, dual completion, review, dispute.",
    },
    {
      role: "Reviewed pro · membership active",
      view: "Job on Available jobs. Quote with full offer fields, message, accept counters, start work, change requests.",
    },
    {
      role: "Pro · not cleared or membership off",
      view: "Board after clearance only. Quote/message/contact locked until membership is active.",
    },
    {
      role: "Guest / other homeowners",
      view: "Private request stays private. Public site never lists homeowner phone or street.",
    },
  ],
  requiredToPost: [
    "Title",
    "Trade / category",
    "Description",
    "ZIP",
    "Timing",
  ],
  optionalToPost: ["Photos (up to 4)", "Saved address", "Budget", "Property type"],
};

export const postRequiredHints = {
  title: "Short label pros scan on the job board.",
  category: "Routes the request to matching trades.",
  description: "What is broken, where it is, and access notes.",
  zip: "Used for nearby matching. Exact street stays private until contact unlock.",
  urgency: "Helps pros prioritize.",
  photos: "Optional but improves quote quality.",
  budget: "Optional range — not a checkout price.",
  propertyType: "Optional context for the pro.",
};
