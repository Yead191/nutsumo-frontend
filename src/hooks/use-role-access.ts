"use client";
import { UserRole } from "@/types";

import { resolveRoleAccess } from "@/lib/role-access";
export function useRoleAccess() {
  const user = {
    name: "yead",
    id: "1",
    role: "ARTISAN" as UserRole,
    email: "yead191@gmail.com",
  };
  const applicationStatus = "submitted";
  const membershipActive = true;
  const membershipPaused = false;
  const membershipCancelled = false;
  const subscriptionPlan: string = "monthly";
  const contactUnlocked = true;

  const isEffectivelyActive =
    membershipActive || (subscriptionPlan === "trial" && !membershipCancelled);

  const access = resolveRoleAccess(user, {
    applicationStatus,
    membershipActive: isEffectivelyActive,
    membershipPaused,
    membershipCancelled,
    contactUnlocked,
  });

  return {
    user,
    access,
    applicationStatus,
    membershipActive,
    membershipPaused,
    membershipCancelled,
    contactUnlocked,
  };
}
