"use client";

import { resolveRoleAccess } from "@/lib/role-access";
import { useAppSelector } from "@/redux/hooks";

export function useRoleAccess() {
  const user = useAppSelector((state) => state.auth.user);
  const applicationStatus = useAppSelector((state) => state.features.applicationStatus);
  const membershipActive = useAppSelector((state) => state.marketplace.membershipActive);
  const membershipPaused = useAppSelector((state) => state.features.membershipPaused);
  const membershipCancelled = useAppSelector((state) => state.features.membershipCancelled);
  const subscriptionPlan = useAppSelector((state) => state.features.subscriptionPlan);
  const contactUnlocked = useAppSelector((state) => state.features.contactUnlocked);

  const isEffectivelyActive = membershipActive || (subscriptionPlan === "trial" && !membershipCancelled);

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
