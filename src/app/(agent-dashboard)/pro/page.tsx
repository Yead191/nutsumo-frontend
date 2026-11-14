import { ArtisanOverview } from "@/components/web-pages/artisan-dashboard/overview";
import {
  getArtisanDashboardAction,
  type IArtisanDashboard,
} from "@/helpers/next-fetch/apiActions/walletActions";
import getProfile from "@/helpers/next-fetch/core/getProfile";

const emptyDashboard: IArtisanDashboard = {
  balance: {
    available: 0,
    inEscrow: 0,
    awaitingRelease: 0,
    lifetimeCredited: 0,
    lifetimeWithdrawn: 0,
  },
  work: {
    pendingQuotes: 0,
    acceptedQuotes: 0,
    quotesRejected: 0,
    quotesWithdrawn: 0,
    quotesSent: 0,
    awaitingPayment: 0,
    activeBookings: 0,
    delivered: 0,
    completed: 0,
    disputed: 0,
  },
  presence: {
    liveServices: 0,
    servicesInReview: 0,
    portfolioItems: 0,
    unreadNotifications: 0,
  },
  reputation: {
    rating: 0,
    reviewsCount: 0,
    acceptRate: 0,
    responseTimeMinutes: 0,
    responseSamples: 0,
    completedJobs: 0,
  },
  monthly: [],
  recentBookings: [],
};

export default async function ProOverviewPage() {
  const [result, user] = await Promise.all([
    getArtisanDashboardAction(),
    getProfile(),
  ]);
  const dashboard = result.success && result.data ? result.data : emptyDashboard;

  return <ArtisanOverview user={user} dashboard={dashboard} />;
}
