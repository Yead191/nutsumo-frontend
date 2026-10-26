"use client";

import { useSearchParams } from "next/navigation";

export function AppliedBanner() {
  const search = useSearchParams();
  if (search.get("applied") !== "1") return null;

  return (
    <p className="rounded-[10px] bg-[#E8F6EE] px-4 py-3 text-sm text-copy">
      <span className="font-semibold text-title">Submitted. </span>
      We will review these items, then you can start membership.
    </p>
  );
}
