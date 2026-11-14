"use server";

import { nextFetch, type FetchResponse } from "../core/NextFetch";
import { revalidateTags } from "../core/revalidateTags";
import { revalidatePath } from "next/cache";

export type PayoutMethod = "BANK" | "MOMO";
export type MomoNetwork = "MTN" | "VODAFONE" | "AIRTELTIGO";

export interface IPayoutDestination {
  method: PayoutMethod;
  accountName: string;
  bankName?: string;
  accountNumber?: string;
  momoNetwork?: MomoNetwork;
  momoNumber?: string;
}

export interface IWalletLedgerEntry {
  _id: string;
  entryType: "CREDIT_RELEASE" | "DEBIT_WITHDRAW" | "CREDIT_REVERSAL";
  amount: number;
  balanceAfter: number;
  note?: string;
  createdAt: string;
}

export interface IWithdrawalItem {
  _id: string;
  amount: number;
  status: "REQUESTED" | "PROCESSING" | "PAID" | "FAILED";
  method: "BANK" | "MOMO" | "STRIPE";
  reference?: string;
  failureReason?: string;
  createdAt: string;
}

export interface IArtisanWallet {
  available: number;
  inEscrow: number;
  awaitingRelease: number;
  lifetimeCredited: number;
  lifetimeWithdrawn: number;
  currency: string;
  minimumWithdrawal: number;
  completedJobs: number;
  stripeConnected: boolean;
  destination: IPayoutDestination | null;
  ledger: IWalletLedgerEntry[];
  withdrawals: IWithdrawalItem[];
}

export async function getArtisanWalletAction(): Promise<
  FetchResponse<IArtisanWallet>
> {
  return nextFetch<IArtisanWallet>("/wallet", {
    method: "GET",
    cache: "no-store",
    tags: ["artisan-wallet"],
  });
}

export async function connectStripeAccountAction() {
  const result = await nextFetch<{ url: string; connected: boolean }>(
    "/wallet/stripe/connect",
    { method: "POST", cache: "no-store" },
  );
  if (result.success) {
    await revalidateTags(["user-profile"]);
    revalidatePath("/pro/profile");
    revalidatePath("/pro");
  }
  return result;
}

export async function syncStripeAccountAction() {
  const result = await nextFetch("/wallet/stripe/sync", {
    method: "POST",
    cache: "no-store",
  });
  if (result.success) {
    await revalidateTags(["user-profile"]);
    revalidatePath("/pro/profile");
    revalidatePath("/pro");
  }
  return result;
}

export async function savePayoutDestinationAction(payload: IPayoutDestination) {
  const result = await nextFetch("/wallet/destination", {
    method: "PUT",
    body: payload,
    cache: "no-store",
  });
  if (result.success) revalidatePath("/pro");
  return result;
}

export async function withdrawWalletAction(amount: number) {
  const result = await nextFetch("/wallet/withdraw", {
    method: "POST",
    body: { amount },
    cache: "no-store",
  });
  if (result.success) revalidatePath("/pro");
  return result;
}
