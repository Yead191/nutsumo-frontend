import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ArtisanWallet } from "@/components/web-pages/artisan-dashboard/wallet";
import {
  connectStripeAccountAction,
  getArtisanWalletAction,
  syncStripeAccountAction,
  type IArtisanWallet,
} from "@/helpers/next-fetch/apiActions/walletActions";
import getProfile from "@/helpers/next-fetch/core/getProfile";

export const metadata: Metadata = {
  title: "Wallet · Nutsumo",
};

const emptyWallet: IArtisanWallet = {
  available: 0,
  inEscrow: 0,
  awaitingRelease: 0,
  lifetimeCredited: 0,
  lifetimeWithdrawn: 0,
  currency: "GHS",
  minimumWithdrawal: 10,
  completedJobs: 0,
  stripeConnected: false,
  destination: null,
  ledger: [],
  withdrawals: [],
};

const isConnected = (user: {
  stripeAccountInfo?: {
    accountId?: string;
    details_submitted?: boolean;
    payouts_enabled?: boolean;
    loginUrl?: string;
  };
} | null) => {
  const stripe = user?.stripeAccountInfo;
  return Boolean(
    stripe?.accountId &&
      (stripe.details_submitted || stripe.payouts_enabled || stripe.loginUrl),
  );
};

export default async function ProWalletPage({
  searchParams,
}: {
  searchParams: Promise<{ stripe?: string }>;
}) {
  const { stripe } = await searchParams;

  if (stripe === "refresh") {
    const link = await connectStripeAccountAction();
    if (link.success && link.data?.url) redirect(link.data.url);
  }

  if (stripe === "return") {
    await syncStripeAccountAction();
  }

  const [result, user] = await Promise.all([
    getArtisanWalletAction(),
    getProfile(),
  ]);
  const wallet = result.success && result.data ? result.data : emptyWallet;

  return <ArtisanWallet wallet={wallet} stripeConnected={isConnected(user)} />;
}
