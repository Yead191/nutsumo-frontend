import type { Metadata } from "next";
import { getMyQuotationsAction } from "@/helpers/next-fetch/apiActions/quotationActions";
import { getMyBookingsAction } from "@/helpers/next-fetch/apiActions/bookingActions";
import { getActiveJobsMarketplaceAction } from "@/helpers/next-fetch/apiActions/jobActions";
import { ArtisanJobsManager } from "@/components/web-pages/artisan-dashboard/artisan-jobs";

export const metadata: Metadata = {
  title: "Jobs & Work Opportunities · Job Seeker Dashboard",
  description: "Track your active contracts, manage submitted proposals, and discover new client jobs in Ghana.",
};

export default async function ProJobsPage() {
  const [quotationsRes, bookingsRes, jobsRes] = await Promise.all([
    getMyQuotationsAction(),
    getMyBookingsAction(),
    getActiveJobsMarketplaceAction({ limit: 30 }),
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

  return (
    <ArtisanJobsManager
      initialQuotations={quotations}
      initialBookings={bookings}
      availableJobs={availableJobs}
    />
  );
}
