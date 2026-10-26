"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useRoleAccess } from "@/hooks/use-role-access";

const appLabels = {
  draft: "Draft",
  submitted: "Under review",
  needs_info: "Needs info",
  rejected: "Rejected",
  cleared: "Cleared",
} as const;

export function ProAccessStrip() {
  const { access, applicationStatus, membershipActive, membershipPaused, membershipCancelled, contactUnlocked } =
    useRoleAccess();

  const membershipLabel = !membershipActive
    ? "Not started"
    : membershipCancelled
      ? "Cancelled"
      : membershipPaused
        ? "Paused"
        : "Active";

  const fixHref = applicationStatus !== "cleared" ? "/pro/application" : "/pro/pricing";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>{appLabels[applicationStatus]}</Badge>
      <Badge>{membershipLabel}</Badge>
      <Badge>{contactUnlocked && access.canSeeContact ? "Contact on" : "Contact locked"}</Badge>
      {access.blockedReason ? (
        <p className="w-full text-sm text-copy">
          {access.blockedReason}{" "}
          <Link href={fixHref} className="font-semibold text-primary hover:underline">
            Fix ↗
          </Link>
        </p>
      ) : null}
    </div>
  );
}
