import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { defaultWeeklyHours, type WeeklyHours } from "@/lib/business-hours";
import {
  defaultInsuranceDoc,
  defaultLicenseDoc,
  type CredentialFile,
} from "@/lib/credential-file";
import type { JobStatus } from "@/types";

export type LeadAction = "saved" | "declined" | "scheduled" | "open" | "accepted";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  href: string;
  createdAt: string;
  read: boolean;
  role: "homeowner" | "pro" | "admin" | "all";
}

export interface SavedAddress {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface ReviewItem {
  id: string;
  jobId: string;
  proId: string;
  author: string;
  rating: number;
  body: string;
  createdAt: string;
  reply?: string;
}

export interface InvoiceItem {
  id: string;
  date: string;
  period?: string;
  description?: string;
  amount: string;
  status: "paid" | "upcoming" | "failed";
}

interface FeaturesState {
  favorites: string[];
  notifications: AppNotification[];
  addresses: SavedAddress[];
  reviews: ReviewItem[];
  leadActions: Record<string, LeadAction>;
  jobPhotos: Record<string, string[]>;
  jobStatusOverride: Record<string, JobStatus>;
  invitedPros: Record<string, string[]>;
  twoFactorOn: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  membershipPaused: boolean;
  membershipCancelled: boolean;
  subscriptionPlan: "trial" | "monthly" | "annual";
  billingCycle: "monthly" | "annual";
  renewalDate: string;
  paymentMethod: {
    brand: string;
    last4: string;
    exp: string;
  } | null;
  trialDaysLeft: number;
  invoices: InvoiceItem[];
  applicationDraft: Record<string, string>;
  applicationStatus: "draft" | "submitted" | "needs_info" | "rejected" | "cleared";
  rejectionReason: string;
  contactUnlocked: boolean;
  proProfile: ProProfileData;
}

export interface ProServiceItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  description: string;
}

export interface ProSpecialOffer {
  active: boolean;
  title: string;
  discount: string;
  terms: string;
}

export interface ProProfileData {
  businessName: string;
  contactName: string;
  trade: string;
  categorySlug: string;
  tagline: string;
  bio: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  radiusMiles: number;
  startingPrice: number;
  yearsInBusiness: string;
  responseTime: string;
  emergency: boolean;
  businessHours: WeeklyHours;
  acceptedPayments: string[];
  services: ProServiceItem[];
  specialOffer: ProSpecialOffer;
  includedPerks: string[];
  licenseNumber: string;
  licenseState: string;
  licenseDoc: CredentialFile | null;
  insuranceCarrier: string;
  insuranceCoverage: string;
  insuranceExpires: string;
  insuranceDoc: CredentialFile | null;
  portfolio: { title: string; image: string }[];
}

const seedNotifications: AppNotification[] = [
  {
    id: "n1",
    title: "New quote",
    body: "Ortega Plumbing sent a quote on your kitchen sink request.",
    href: "/account/jobs/job-1",
    createdAt: "Oct 14 · 2:20 PM",
    read: false,
    role: "homeowner",
  },
  {
    id: "n2",
    title: "Message reply",
    body: "Shah Electric Co. replied on the hallway outlets job.",
    href: "/account/messages",
    createdAt: "Oct 13 · 6:42 PM",
    read: false,
    role: "homeowner",
  },
  {
    id: "n3",
    title: "New open request",
    body: "A plumbing job near 78701 matches your trade.",
    href: "/pro/jobs/job-1",
    createdAt: "Oct 14 · 9:00 AM",
    read: false,
    role: "pro",
  },
  {
    id: "n4",
    title: "Membership reminder",
    body: "Your free trial has days left. Review membership terms anytime.",
    href: "/pro/pricing",
    createdAt: "Oct 12 · 10:00 AM",
    read: true,
    role: "pro",
  },
];

const initialState: FeaturesState = {
  favorites: ["pro-1", "pro-2", "pro-3"],
  notifications: seedNotifications,
  addresses: [
    {
      id: "addr-1",
      label: "Home",
      street: "418 West 5th Street",
      city: "Austin",
      state: "TX",
      zip: "78701",
    },
  ],
  reviews: [
    {
      id: "rev-job-10",
      jobId: "job-10",
      proId: "pro-1",
      author: "Maya Chen",
      rating: 5,
      body: "Marcus replaced our failed pressure regulator within 2 hours. Main pressure dropped back to a safe 55 PSI immediately. Zero water left on floor.",
      createdAt: "Oct 18, 2026",
      reply: "Thank you Maya! Glad we caught that before your water heater expansion tank took damage.",
    },
    {
      id: "rev-1",
      jobId: "job-past-1",
      proId: "pro-1",
      author: "Maya Chen",
      rating: 5,
      body: "Fixed the leak the same afternoon. Clean work and clear price.",
      createdAt: "Sep 2026",
      reply: "Thanks Maya — glad the cabinet dried out cleanly.",
    },
    {
      id: "rev-2",
      jobId: "job-past-2",
      proId: "pro-1",
      author: "Jordan Hale",
      rating: 4,
      body: "Showed up on time and explained the fittings before replacing them.",
      createdAt: "Aug 2026",
    },
    {
      id: "rev-3",
      jobId: "job-past-3",
      proId: "pro-2",
      author: "Elena Ruiz",
      rating: 5,
      body: "Diagnosed the dead outlets quickly and left the hallway tidy.",
      createdAt: "Sep 2026",
    },
  ],
  leadActions: {},
  jobPhotos: {},
  jobStatusOverride: {},
  invitedPros: {},
  twoFactorOn: false,
  emailVerified: false,
  phoneVerified: false,
  membershipPaused: false,
  membershipCancelled: false,
  subscriptionPlan: "trial",
  billingCycle: "monthly",
  renewalDate: "Jan 10, 2027",
  paymentMethod: {
    brand: "Visa",
    last4: "4242",
    exp: "08/29",
  },
  trialDaysLeft: 67,
  invoices: [
    {
      id: "inv-1",
      date: "Sep 10, 2026",
      period: "Sep 10 – Oct 10, 2026",
      description: "Pro 3-Month Free Trial (Month 1)",
      amount: "$0.00",
      status: "paid",
    },
    {
      id: "inv-2",
      date: "Oct 10, 2026",
      period: "Oct 10 – Nov 10, 2026",
      description: "Pro 3-Month Free Trial (Month 2)",
      amount: "$0.00",
      status: "paid",
    },
    {
      id: "inv-3",
      date: "Jan 10, 2027",
      period: "Jan 10 – Feb 10, 2027",
      description: "Pro Monthly Membership (Scheduled Renewal)",
      amount: "$19.99",
      status: "upcoming",
    },
  ],
  applicationDraft: {},
  /** Demo pro starts cleared so job-board gates focus on membership. New applications reset to submitted. */
  applicationStatus: "cleared",
  rejectionReason: "",
  contactUnlocked: true,
  proProfile: {
    businessName: "Ortega Plumbing & Gas",
    contactName: "Luis Ortega",
    trade: "Plumbing",
    categorySlug: "plumbing",
    tagline: "Licensed master plumber serving residential Austin & Central Texas",
    bio: "Over 10 years of trusted plumbing diagnostics, emergency leak remediation, tankless water heater installations, and drain restoration. We provide itemized pricing upfront with zero platform fees.",
    phone: "(512) 555-0198",
    email: "luis@ortegaplumbing.com",
    street: "2201 South Lamar Blvd",
    city: "Austin",
    state: "TX",
    zip: "78704",
    radiusMiles: 25,
    startingPrice: 95,
    yearsInBusiness: "10+ years",
    responseTime: "Usually under 1 hour",
    emergency: true,
    businessHours: defaultWeeklyHours(),
    acceptedPayments: [
      "Apple Pay",
      "Cash",
      "Check",
      "Credit or debit",
      "Google Pay",
      "PayPal",
      "Venmo",
      "Zelle",
    ],
    specialOffer: {
      active: true,
      title: "$25 Off First Diagnostic Call",
      discount: "$25 OFF",
      terms: "Valid for all first-time residential homeowners across Travis & Williamson counties. Mention LocalHomeFix on booking.",
    },
    services: [
      {
        id: "srv-1",
        name: "Leak Detection & Emergency Pipe Repair",
        price: 95,
        unit: "starting rate",
        description: "Electronic water line detection and non-invasive pipe repairs.",
      },
      {
        id: "srv-2",
        name: "Water Heater Flush, Repair & Replacement",
        price: 140,
        unit: "flush & diag",
        description: "Standard tank & tankless servicing, element replacement, and anode rods.",
      },
      {
        id: "srv-3",
        name: "Drain Clearing & Hydro-Jetting",
        price: 89,
        unit: "starting rate",
        description: "Kitchen sinks, bathroom lines, and main sewer branch snake clearing.",
      },
      {
        id: "srv-4",
        name: "Fixture, Toilet & Faucet Installation",
        price: 110,
        unit: "per fixture",
        description: "OEM fixture mounting, supply hookups, and leak-tested seal guarantee.",
      },
      {
        id: "srv-5",
        name: "Garbage Disposal Repair & Replacement",
        price: 85,
        unit: "starting rate",
        description: "Humming or jammed disposals, seal gaskets, and new unit installs.",
      },
    ],
    includedPerks: [
      "Free upfront itemized quote",
      "1-Year workmanship & leak warranty",
      "Floor protection & clean boot covers",
      "OEM certified plumbing parts",
      "Direct payment on 100% completion ($0 platform fee)",
    ],
    licenseNumber: "TX-M-42981",
    licenseState: "TX",
    licenseDoc: defaultLicenseDoc(),
    insuranceCarrier: "Next Insurance",
    insuranceCoverage: "$1,000,000",
    insuranceExpires: "2027-09",
    insuranceDoc: defaultInsuranceDoc(),
    portfolio: [
      {
        title: "Kitchen supply line repair",
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Under-sink drain reseal",
        image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Vanity fixture install",
        image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
};

const featuresSlice = createSlice({
  name: "features",
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.favorites = state.favorites.includes(id)
        ? state.favorites.filter((item) => item !== id)
        : [...state.favorites, id];
    },
    markNotificationRead(state, action: PayloadAction<string>) {
      const note = state.notifications.find((item) => item.id === action.payload);
      if (note) note.read = true;
    },
    markAllNotificationsRead(state, action: PayloadAction<"homeowner" | "pro" | "admin">) {
      state.notifications.forEach((item) => {
        if (item.role === action.payload || item.role === "all") item.read = true;
      });
    },
    addNotification(state, action: PayloadAction<Omit<AppNotification, "id" | "read">>) {
      state.notifications.unshift({
        ...action.payload,
        id: `n-${Date.now()}`,
        read: false,
      });
    },
    addAddress(state, action: PayloadAction<Omit<SavedAddress, "id">>) {
      state.addresses.push({ ...action.payload, id: `addr-${Date.now()}` });
    },
    updateAddress(state, action: PayloadAction<SavedAddress>) {
      const index = state.addresses.findIndex((item) => item.id === action.payload.id);
      if (index >= 0) state.addresses[index] = action.payload;
    },
    removeAddress(state, action: PayloadAction<string>) {
      state.addresses = state.addresses.filter((item) => item.id !== action.payload);
    },
    setLeadAction(state, action: PayloadAction<{ jobId: string; action: LeadAction }>) {
      state.leadActions[action.payload.jobId] = action.payload.action;
    },
    setJobPhotos(state, action: PayloadAction<{ jobId: string; photos: string[] }>) {
      state.jobPhotos[action.payload.jobId] = action.payload.photos;
    },
    setJobStatus(state, action: PayloadAction<{ jobId: string; status: JobStatus }>) {
      state.jobStatusOverride[action.payload.jobId] = action.payload.status;
    },
    invitePro(state, action: PayloadAction<{ jobId: string; proId: string }>) {
      const list = state.invitedPros[action.payload.jobId] ?? [];
      if (!list.includes(action.payload.proId)) {
        state.invitedPros[action.payload.jobId] = [...list, action.payload.proId];
      }
    },
    addReview(state, action: PayloadAction<Omit<ReviewItem, "id">>) {
      state.reviews.unshift({ ...action.payload, id: `rev-${Date.now()}` });
    },
    updateReview(
      state,
      action: PayloadAction<{ id: string; rating: number; body: string }>,
    ) {
      const review = state.reviews.find((item) => item.id === action.payload.id);
      if (review) {
        review.rating = action.payload.rating;
        review.body = action.payload.body;
      }
    },
    replyToReview(state, action: PayloadAction<{ id: string; reply: string }>) {
      const review = state.reviews.find((item) => item.id === action.payload.id);
      if (review) review.reply = action.payload.reply;
    },
    setTwoFactor(state, action: PayloadAction<boolean>) {
      state.twoFactorOn = action.payload;
    },
    setEmailVerified(state, action: PayloadAction<boolean>) {
      state.emailVerified = action.payload;
    },
    setPhoneVerified(state, action: PayloadAction<boolean>) {
      state.phoneVerified = action.payload;
    },
    setMembershipPaused(state, action: PayloadAction<boolean>) {
      state.membershipPaused = action.payload;
      if (action.payload) {
        state.membershipCancelled = false;
        state.contactUnlocked = false;
      }
    },
    setMembershipCancelled(state, action: PayloadAction<boolean>) {
      state.membershipCancelled = action.payload;
      if (action.payload) {
        state.membershipPaused = false;
        state.contactUnlocked = false;
      }
    },
    saveApplicationDraft(state, action: PayloadAction<Record<string, string>>) {
      state.applicationDraft = { ...state.applicationDraft, ...action.payload };
      state.applicationStatus = "draft";
    },
    submitApplication(state) {
      state.applicationStatus = "submitted";
      state.rejectionReason = "";
      state.contactUnlocked = false;
    },
    setApplicationNeedsInfo(state, action: PayloadAction<string>) {
      state.applicationStatus = "needs_info";
      state.rejectionReason = action.payload;
      state.contactUnlocked = false;
    },
    setApplicationCleared(state) {
      state.applicationStatus = "cleared";
      state.rejectionReason = "";
    },
    setApplicationRejected(state, action: PayloadAction<string>) {
      state.applicationStatus = "rejected";
      state.rejectionReason = action.payload;
      state.contactUnlocked = false;
    },
    unlockContact(state) {
      state.contactUnlocked = true;
    },
    lockContact(state) {
      state.contactUnlocked = false;
    },
    setSubscriptionPlan(
      state,
      action: PayloadAction<{
        plan: "trial" | "monthly" | "annual";
        billingCycle?: "monthly" | "annual";
        renewalDate?: string;
      }>,
    ) {
      state.subscriptionPlan = action.payload.plan;
      if (action.payload.billingCycle) state.billingCycle = action.payload.billingCycle;
      if (action.payload.renewalDate) state.renewalDate = action.payload.renewalDate;
      state.membershipPaused = false;
      state.membershipCancelled = false;
      state.contactUnlocked = true;

      const upcoming = state.invoices.find((i) => i.status === "upcoming");
      if (upcoming) {
        if (action.payload.plan === "annual") {
          upcoming.amount = "$179.88";
          upcoming.description = "Pro Annual Membership ($14.99/mo · Billed Yearly)";
        } else if (action.payload.plan === "monthly") {
          upcoming.amount = "$19.99";
          upcoming.description = "Pro Monthly Membership ($19.99/mo)";
        }
      }
    },
    updatePaymentMethod(
      state,
      action: PayloadAction<{
        brand: string;
        last4: string;
        exp: string;
      }>,
    ) {
      state.paymentMethod = action.payload;
    },
    updateProProfile(state, action: PayloadAction<Partial<ProProfileData>>) {
      state.proProfile = {
        ...state.proProfile,
        ...action.payload,
        businessHours: action.payload.businessHours ?? state.proProfile.businessHours,
        specialOffer: {
          ...state.proProfile.specialOffer,
          ...(action.payload.specialOffer ?? {}),
        },
      };
    },
  },
});

export const {
  toggleFavorite,
  markNotificationRead,
  markAllNotificationsRead,
  addNotification,
  addAddress,
  updateAddress,
  removeAddress,
  setLeadAction,
  setJobPhotos,
  setJobStatus,
  invitePro,
  addReview,
  updateReview,
  replyToReview,
  setTwoFactor,
  setEmailVerified,
  setPhoneVerified,
  setMembershipPaused,
  setMembershipCancelled,
  saveApplicationDraft,
  submitApplication,
  setApplicationNeedsInfo,
  setApplicationCleared,
  setApplicationRejected,
  unlockContact,
  lockContact,
  setSubscriptionPlan,
  updatePaymentMethod,
  updateProProfile,
} = featuresSlice.actions;

export default featuresSlice.reducer;
