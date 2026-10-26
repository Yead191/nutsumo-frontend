import type { User, UserRole } from "@/types";

/** Public audience plus signed-in roles. */
export type AccessAudience = "guest" | "homeowner" | "pro" | "admin";

export type ProGate = {
  applicationStatus: "draft" | "submitted" | "needs_info" | "rejected" | "cleared";
  membershipActive: boolean;
  membershipPaused: boolean;
  membershipCancelled: boolean;
  contactUnlocked: boolean;
};

export type RoleAccess = {
  audience: AccessAudience;
  /** Browse public cleared listings */
  canBrowse: boolean;
  /** Save / favorite a pro */
  canSavePro: boolean;
  /** Post a homeowner request */
  canPostJob: boolean;
  /** Hire, review, dispute on own jobs */
  canManageQuotes: boolean;
  /** Open homeowner messages */
  canHomeownerMessage: boolean;
  /** See pro job board leads */
  canSeeJobBoard: boolean;
  /** Submit a quote on a lead */
  canSubmitQuote: boolean;
  /** See homeowner phone/email on a lead */
  canSeeContact: boolean;
  /** Message as pro on leads */
  canProMessage: boolean;
  /** Start / manage $19.99 membership */
  canManageMembership: boolean;
  notice: string | null;
  blockedReason: string | null;
};

export function audienceFromUser(user: User | null): AccessAudience {
  if (!user) return "guest";
  if (user.role === "pro") return "pro";
  return "homeowner";
}

export function loginHref(opts?: { role?: UserRole; next?: string }) {
  const params = new URLSearchParams();
  if (opts?.role) params.set("role", opts.role);
  if (opts?.next) params.set("next", opts.next);
  const q = params.toString();
  return q ? `/login?${q}` : "/login";
}

export function signupHref(next?: string) {
  if (!next) return "/signup";
  return `/signup?next=${encodeURIComponent(next)}`;
}

export function postJobHref(user: User | null) {
  if (!user) return loginHref({ next: "/account/post-job" });
  if (user.role === "pro") return "/pro/jobs";
  return "/account/post-job";
}

export function resolveRoleAccess(user: User | null, pro?: Partial<ProGate>): RoleAccess {
  const audience = audienceFromUser(user);

  if (audience === "guest") {
    return {
      audience,
      canBrowse: true,
      canSavePro: false,
      canPostJob: false,
      canManageQuotes: false,
      canHomeownerMessage: false,
      canSeeJobBoard: false,
      canSubmitQuote: false,
      canSeeContact: false,
      canProMessage: false,
      canManageMembership: false,
      notice: "Browsing is open. Sign in to post, save, message, or quote.",
      blockedReason: "Sign in required",
    };
  }

  if (audience === "homeowner") {
    return {
      audience,
      canBrowse: true,
      canSavePro: true,
      canPostJob: true,
      canManageQuotes: true,
      canHomeownerMessage: true,
      canSeeJobBoard: false,
      canSubmitQuote: false,
      canSeeContact: false,
      canProMessage: false,
      canManageMembership: false,
      notice: "Homeowner plan is free. No LocalHomeFix project fee or membership.",
      blockedReason: null,
    };
  }

  const status = pro?.applicationStatus ?? "submitted";
  const cleared = status === "cleared";
  const membershipOk =
    Boolean(pro?.membershipActive) && !pro?.membershipPaused && !pro?.membershipCancelled;
  const contactOk = cleared && membershipOk && Boolean(pro?.contactUnlocked);

  let blockedReason: string | null = null;
  let notice: string | null = "One pro membership: $19.99/mo after 3 free months. No repair packages.";

  if (!cleared) {
    blockedReason =
      status === "rejected"
        ? "Application rejected — fix docs and resubmit."
        : status === "needs_info"
          ? "Admin needs more info before clearance."
          : status === "draft"
            ? "Finish and submit your application."
            : "Waiting on administrator clearance.";
    notice = blockedReason;
  } else if (!pro?.membershipActive) {
    blockedReason = "Start the free trial to quote and unlock contact.";
    notice = blockedReason;
  } else if (pro.membershipPaused) {
    blockedReason = "Membership paused — resume to quote and unlock contact.";
    notice = blockedReason;
  } else if (pro.membershipCancelled) {
    blockedReason = "Membership cancelled — restart to quote and unlock contact.";
    notice = blockedReason;
  } else if (!contactOk) {
    notice = "Membership active. Contact unlocks after clearance (demo may still gate).";
  }

  return {
    audience,
    canBrowse: true,
    canSavePro: false,
    canPostJob: false,
    canManageQuotes: false,
    canHomeownerMessage: false,
    canSeeJobBoard: cleared,
    canSubmitQuote: cleared && membershipOk,
    canSeeContact: contactOk,
    canProMessage: cleared && membershipOk,
    canManageMembership: true,
    notice,
    blockedReason: cleared && membershipOk ? null : blockedReason,
  };
}
