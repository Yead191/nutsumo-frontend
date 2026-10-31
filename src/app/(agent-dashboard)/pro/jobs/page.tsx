import type { Metadata } from "next";
import { getMyQuotationsAction } from "@/helpers/next-fetch/apiActions/quotationActions";
import { getMyBookingsAction } from "@/helpers/next-fetch/apiActions/bookingActions";
import { getActiveJobsMarketplaceAction } from "@/helpers/next-fetch/apiActions/jobActions";
import { ArtisanJobsManager } from "@/components/web-pages/artisan-dashboard/artisan-jobs";

export const metadata: Metadata = {
  title: "Jobs & Work Opportunities · Job Seeker Dashboard",
  description:
    "Track your active contracts, manage submitted proposals, and discover new client jobs in Ghana.",
};

interface ProJobsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    searchTerm?: string;
    category?: string;
    service?: string;
    tab?: "proposals" | "bookings" | "leads";
  }>;
}

export default async function ProJobsPage({ searchParams }: ProJobsPageProps) {
  const resolvedParams = await searchParams;
  const page = resolvedParams.page ? Number(resolvedParams.page) : 1;
  const limit = resolvedParams.limit ? Number(resolvedParams.limit) : 10;

  const [quotationsRes, bookingsRes, jobsRes] = await Promise.all([
    getMyQuotationsAction(),
    getMyBookingsAction(),
    getActiveJobsMarketplaceAction({
      page,
      limit,
      searchTerm: resolvedParams.searchTerm,
      category: resolvedParams.category,
      service: resolvedParams.service,
    }),
  ]);

  const quotations =
    quotationsRes.success && Array.isArray(quotationsRes.data)
      ? quotationsRes.data
      : [];

  const bookings =
    bookingsRes.success && Array.isArray(bookingsRes.data)
      ? bookingsRes.data
      : [];

  const availableJobs =
    jobsRes.success && Array.isArray(jobsRes.data) ? jobsRes.data : [];

  const pagination = jobsRes.pagination || null;

  return (
    <ArtisanJobsManager
      initialQuotations={quotations}
      initialBookings={bookings}
      availableJobs={availableJobs}
      pagination={pagination}
      initialParams={{
        page,
        searchTerm: resolvedParams.searchTerm,
        category: resolvedParams.category,
        service: resolvedParams.service,
        tab: resolvedParams.tab,
      }}
    />
  );
}
