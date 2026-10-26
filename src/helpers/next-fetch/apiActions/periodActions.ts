"use server";

import { nextFetch } from "../core/NextFetch";

export type PeriodStatus =
  | "Upcoming"
  | "Open"
  | "Review"
  | "WinnerSelection"
  | "Closed";

export interface ApiGrantPeriod {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  maximumGrantAmount: number;
  totalApplicationsSubmitted: number;
  status: PeriodStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetches the most relevant application period to show to users.
 * Priority:
 * 1. "Open" period (so people can apply)
 * 2. "Upcoming" period (so people know what's next)
 * 3. Most recently created period (fallback if none are open/upcoming)
 */
export async function getCurrentApplicationPeriod(): Promise<ApiGrantPeriod | null> {
  // 1. Try to fetch Open period
  let res = await nextFetch<ApiGrantPeriod[]>("/period?status=Open&limit=1", {
    cache: "force-cache",
    next: { revalidate: 60 * 5, tags: ["period"] },
  });
  if (res.success && res.data && res.data.length > 0) {
    return res.data[0];
  }

  // 2. Try to fetch Upcoming period
  res = await nextFetch<ApiGrantPeriod[]>("/period?status=Upcoming&limit=1", {
    cache: "force-cache",
    next: { revalidate: 60 * 5, tags: ["period"] },
  });
  if (res.success && res.data && res.data.length > 0) {
    return res.data[0];
  }

  // 3. Try to fetch latest period (fallback)
  res = await nextFetch<ApiGrantPeriod[]>("/period?limit=1", {
    cache: "force-cache",
    next: { revalidate: 60 * 5, tags: ["period"] },
  });
  if (res.success && res.data && res.data.length > 0) {
    return res.data[0];
  }

  return null;
}

/** GET /period — fetches all application periods for dropdown selection */
export async function getAllApplicationPeriods() {
  const result = await nextFetch<ApiGrantPeriod[]>("/period", {
    method: "GET",
    cache: "force-cache",
    next: {
      revalidate: 60 * 30,
    },
  });
  return result;
}
