import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getJobDetailsAction } from "@/helpers/next-fetch/apiActions/jobActions";
import { getMyQuotationsAction } from "@/helpers/next-fetch/apiActions/quotationActions";
import { getMyBookingsAction } from "@/helpers/next-fetch/apiActions/bookingActions";
import { ArtisanJobDetailView } from "@/components/web-pages/artisan-dashboard/artisan-jobs/components/ArtisanJobDetailView";

interface ProJobDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProJobDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const res = await getJobDetailsAction(id);
  const job = res.success ? res.data : null;

  if (!job) {
    return { title: "Job Details · Job Seeker Dashboard" };
  }

  return {
    title: `${job.title} · Job Details`,
    description: job.description.slice(0, 160),
  };
}

export default async function ProJobDetailPage({ params }: ProJobDetailPageProps) {
  const { id } = await params;

  const [jobRes, quotesRes, bookingsRes] = await Promise.all([
    getJobDetailsAction(id),
    getMyQuotationsAction(),
    getMyBookingsAction(),
  ]);

  if (!jobRes.success || !jobRes.data) {
    notFound();
  }

  const job = jobRes.data;

  // Find existing quotation by this artisan for this job
  const quotations =
    quotesRes.success && Array.isArray(quotesRes.data) ? quotesRes.data : [];
  const existingQuotation =
    quotations.find((q) => {
      const qJobId = typeof q.job === "object" && q.job ? q.job._id : q.job;
      return qJobId === id;
    }) || null;

  // Find if there is a confirmed booking for this job
  const bookings =
    bookingsRes.success && Array.isArray(bookingsRes.data) ? bookingsRes.data : [];
  const booking =
    bookings.find((b) => {
      const bJobId = typeof b.job === "object" && b.job ? b.job._id : b.job;
      return bJobId === id;
    }) || null;

  return (
    <ArtisanJobDetailView
      job={job}
      existingQuotation={existingQuotation}
      booking={booking}
    />
  );
}
