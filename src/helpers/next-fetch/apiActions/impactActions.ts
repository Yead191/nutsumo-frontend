"use server";

import { nextFetch } from "../core/NextFetch";

export interface ImpactStatsData {
  applicationReceived: number;
  grantsAwardedCount: number;
  totalFundsAwarded: number;
  projectSupported: number;
  grantCycleCount: number;
}

export interface FundStatsData {
  totalBalance: number;
  totalDonations: number;
  totalGrants: number;
  totalFundRaised: number;
  totalPaidExpenses?: number;
  donationCount: number;
  grantCount: number;
  fundRaisedCount: number;
  paidExpenseCount?: number;
  totalCount: number;
  totalApplication: number;
}

/**
 * Fetch live impact statistics directly from the backend API.
 * Endpoint: GET /dashboard/impact-stats
 */
export async function getImpactStats() {
  try {
    const res = await nextFetch<ImpactStatsData>("/dashboard/impact-stats", {
      cache: "force-cache",
      next: { revalidate: 60 * 60 },
    });
    return res;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch impact stats",
      data: {
        applicationReceived: 0,
        grantsAwardedCount: 0,
        totalFundsAwarded: 0,
        projectSupported: 0,
        grantCycleCount: 0,
      },
    };
  }
}

/**
 * Fetch live fund statistics directly from the backend API.
 * Endpoint: GET /donation/fund-stats
 */
export async function getFundStats() {
  try {
    const res = await nextFetch<FundStatsData>("/donation/fund-stats", {
      cache: "force-cache",
      next: { revalidate: 60 * 30, tags: ["fund-stats"] },
    });
    return res;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch fund stats",
      data: {
        totalBalance: 0,
        totalDonations: 0,
        totalGrants: 0,
        totalFundRaised: 0,
        totalPaidExpenses: 0,
        donationCount: 0,
        grantCount: 0,
        fundRaisedCount: 0,
        paidExpenseCount: 0,
        totalCount: 0,
        totalApplication: 0,
      },
    };
  }
}
