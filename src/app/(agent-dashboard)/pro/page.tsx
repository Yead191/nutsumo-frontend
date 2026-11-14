import { ArtisanOverview } from "@/components/web-pages/artisan-dashboard/overview";
import {
  getArtisanWalletAction,
  type IArtisanWallet,
} from "@/helpers/next-fetch/apiActions/walletActions";

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

export default async function ProOverviewPage() {
  const result = await getArtisanWalletAction();
  const wallet = result.success && result.data ? result.data : emptyWallet;

  return <ArtisanOverview wallet={wallet} />;
}
