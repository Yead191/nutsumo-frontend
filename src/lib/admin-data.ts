export type AdminAppStatus = "submitted" | "needs_info" | "rejected" | "cleared";
export type ListingVisibility = "live" | "hidden" | "suspended";
export type DisputeStatus = "open" | "in_review" | "resolved" | "closed";
export type MembershipState = "trial" | "active" | "paused" | "cancelled" | "none";

export interface AdminDecision {
  id: string;
  at: string;
  action: "submitted" | "approved" | "needs_info" | "rejected" | "resubmitted" | "suspended" | "restored";
  note?: string;
  by: string;
}

export interface AdminApplication {
  id: string;
  proId?: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  trade: string;
  categorySlug: string;
  city: string;
  state: string;
  zip: string;
  radiusMiles: number;
  licenseNumber: string;
  licenseFile: string;
  insuranceCarrier: string;
  insuranceCoverage: string;
  insuranceFile: string;
  identityStatus: "verified" | "pending";
  submittedAt: string;
  status: AdminAppStatus;
  reviewerNote?: string;
  history: AdminDecision[];
}

export interface DisputeNote {
  id: string;
  at: string;
  by: string;
  body: string;
}

export interface AdminDispute {
  id: string;
  jobId: string;
  jobTitle: string;
  homeownerName: string;
  proName: string;
  reason: string;
  status: DisputeStatus;
  openedAt: string;
  resolution?: string;
  agreedPrice?: number;
  quoteId?: string;
  notes?: DisputeNote[];
  history?: AdminDecision[];
}

export interface AdminMembership {
  proId: string;
  businessName: string;
  state: MembershipState;
  trialDaysLeft?: number;
  renewal?: string;
  note?: string;
}

export interface AdminActivity {
  id: string;
  at: string;
  title: string;
  body: string;
  href?: string;
}

export const seedApplications: AdminApplication[] = [
  {
    id: "app-ortega",
    proId: "pro-1",
    businessName: "Ortega Plumbing",
    contactName: "Luis Ortega",
    email: "luis@ortegaplumbing.com",
    phone: "(512) 555-0198",
    trade: "Plumbing",
    categorySlug: "plumbing",
    city: "Austin",
    state: "TX",
    zip: "78704",
    radiusMiles: 25,
    licenseNumber: "TX-M-42981",
    licenseFile: "TX-M-42981-Master-Plumber-Certificate.pdf",
    insuranceCarrier: "Next Insurance",
    insuranceCoverage: "$1,000,000",
    insuranceFile: "Next-General-Liability-COI-2026.pdf",
    identityStatus: "verified",
    submittedAt: "2026-09-28",
    status: "cleared",
    history: [
      { id: "d-o1", at: "2026-09-28", action: "submitted", by: "System" },
      { id: "d-o2", at: "2026-09-29", action: "approved", note: "Master plumber license and COI match.", by: "Avery Cole" },
    ],
  },
  {
    id: "app-ridge",
    businessName: "Ridge Air Systems",
    contactName: "Keisha Ward",
    email: "keisha@ridgeair.example",
    phone: "(512) 555-0288",
    trade: "HVAC",
    categorySlug: "hvac",
    city: "Round Rock",
    state: "TX",
    zip: "78664",
    radiusMiles: 35,
    licenseNumber: "TACL-A-44821",
    licenseFile: "TACL-A-44821-HVAC.pdf",
    insuranceCarrier: "Hiscox",
    insuranceCoverage: "$1,000,000",
    insuranceFile: "Hiscox-COI-2026.pdf",
    identityStatus: "verified",
    submittedAt: "2026-10-16",
    status: "submitted",
    history: [{ id: "d-r1", at: "2026-10-16", action: "submitted", by: "System" }],
  },
  {
    id: "app-eastside",
    businessName: "Eastside Electric",
    contactName: "Marco Diaz",
    email: "marco@eastside-electric.example",
    phone: "(512) 555-0331",
    trade: "Electrical",
    categorySlug: "electrical",
    city: "Austin",
    state: "TX",
    zip: "78702",
    radiusMiles: 20,
    licenseNumber: "TECL-22910",
    licenseFile: "TECL-22910-scan.jpg",
    insuranceCarrier: "Hartford",
    insuranceCoverage: "$500,000",
    insuranceFile: "Hartford-COI-expired-note.pdf",
    identityStatus: "verified",
    submittedAt: "2026-10-12",
    status: "needs_info",
    reviewerNote: "COI coverage is $500k. We need $1M general liability and LocalHomeFix listed as certificate holder.",
    history: [
      { id: "d-e1", at: "2026-10-12", action: "submitted", by: "System" },
      {
        id: "d-e2",
        at: "2026-10-14",
        action: "needs_info",
        note: "COI coverage is $500k. We need $1M general liability and LocalHomeFix listed as certificate holder.",
        by: "Avery Cole",
      },
    ],
  },
  {
    id: "app-oak",
    businessName: "Oak & Trim Painting",
    contactName: "Nora Blake",
    email: "nora@oaktrim.example",
    phone: "(512) 555-0419",
    trade: "Painting",
    categorySlug: "painting",
    city: "Austin",
    state: "TX",
    zip: "78745",
    radiusMiles: 18,
    licenseNumber: "N/A — registration",
    licenseFile: "Austin-contractor-registration.pdf",
    insuranceCarrier: "Simply Business",
    insuranceCoverage: "$1,000,000",
    insuranceFile: "Simply-Business-COI.pdf",
    identityStatus: "pending",
    submittedAt: "2026-10-17",
    status: "submitted",
    history: [{ id: "d-k1", at: "2026-10-17", action: "submitted", by: "System" }],
  },
  {
    id: "app-hill",
    businessName: "Hill Country Handy",
    contactName: "Brett Hale",
    email: "brett@hillhandy.example",
    phone: "(512) 555-0550",
    trade: "Handyman",
    categorySlug: "handyman",
    city: "Cedar Park",
    state: "TX",
    zip: "78613",
    radiusMiles: 30,
    licenseNumber: "—",
    licenseFile: "drivers-license-photo.jpg",
    insuranceCarrier: "—",
    insuranceCoverage: "None on file",
    insuranceFile: "none",
    identityStatus: "pending",
    submittedAt: "2026-10-08",
    status: "rejected",
    reviewerNote: "No liability insurance. Public listing requires an active COI.",
    history: [
      { id: "d-h1", at: "2026-10-08", action: "submitted", by: "System" },
      {
        id: "d-h2",
        at: "2026-10-09",
        action: "rejected",
        note: "No liability insurance. Public listing requires an active COI.",
        by: "Avery Cole",
      },
    ],
  },
];

export const seedDisputes: AdminDispute[] = [
  {
    id: "dsp-1",
    jobId: "job-4",
    jobTitle: "AC not cooling upstairs",
    homeownerName: "Sam Okonkwo",
    proName: "Whitfield HVAC",
    reason: "Pro marked complete but upstairs rooms still 8 degrees warmer. Homeowner wants a return visit before paying.",
    status: "open",
    openedAt: "2026-10-15",
  },
  {
    id: "dsp-2",
    jobId: "job-3",
    jobTitle: "Two dead outlets in hallway",
    homeownerName: "Elena Ruiz",
    proName: "Shah Electric Co.",
    reason: "No-show on the agreed Monday window. Homeowner asked support to flag the booking.",
    status: "resolved",
    openedAt: "2026-10-11",
    resolution: "Pro rescheduled at no extra charge. Dispute closed by ops.",
  },
];

export const seedMemberships: AdminMembership[] = [
  { proId: "pro-1", businessName: "Ortega Plumbing", state: "trial", trialDaysLeft: 67, renewal: "Jan 10, 2027" },
  { proId: "pro-2", businessName: "Shah Electric Co.", state: "active", renewal: "Nov 2, 2026" },
  { proId: "pro-3", businessName: "Whitfield HVAC", state: "paused", note: "Paused after the open AC dispute." },
  { proId: "pro-4", businessName: "Northline Painting", state: "trial", trialDaysLeft: 21, renewal: "Dec 1, 2026" },
];

export const seedActivity: AdminActivity[] = [
  {
    id: "act-1",
    at: "Oct 17 · 4:12 PM",
    title: "New application",
    body: "Oak & Trim Painting submitted for clearance.",
    href: "/admin/applications/app-oak",
  },
  {
    id: "act-2",
    at: "Oct 16 · 9:40 AM",
    title: "New application",
    body: "Ridge Air Systems is waiting in the queue.",
    href: "/admin/applications/app-ridge",
  },
  {
    id: "act-3",
    at: "Oct 15 · 6:02 PM",
    title: "Dispute opened",
    body: "Sam Okonkwo flagged the upstairs AC job.",
    href: "/admin/disputes",
  },
];

export const appStatusLabel: Record<AdminAppStatus, string> = {
  submitted: "In review",
  needs_info: "Needs info",
  rejected: "Rejected",
  cleared: "Cleared",
};

export const disputeStatusLabel: Record<DisputeStatus, string> = {
  open: "Open",
  in_review: "In review",
  resolved: "Resolved",
  closed: "Closed",
};
