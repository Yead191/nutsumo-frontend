"use client";

import { useSearchParams } from "next/navigation";

export function PostedBanner() {
  const search = useSearchParams();
  if (search.get("posted") !== "1") return null;

  return (
    <p className="rounded-[10px] bg-[#E8F6EE] px-4 py-3 text-sm text-copy">
      <span className="font-semibold text-title">Posted. </span>
      Matching reviewed pros can see this on Available jobs.
    </p>
  );
}
