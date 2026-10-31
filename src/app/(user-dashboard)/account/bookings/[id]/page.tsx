import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBookingDetailsAction } from "@/helpers/next-fetch/apiActions/bookingActions";
import { BookingDetailsView } from "@/components/web-pages/customer-dashboard/booking-details";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const res = await getBookingDetailsAction(id);
  if (!res.success || !res.data) {
    return { title: "Booking Details · Nutsumo" };
  }
  return {
    title: `Booking #${res.data.bookingNumber} · Nutsumo`,
    description: `Confirmed booking with ${res.data.artisan?.name || "verified artisan"}`,
  };
}

export default async function CustomerBookingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await getBookingDetailsAction(id);

  if (!res.success || !res.data) {
    notFound();
  }

  return <BookingDetailsView booking={res.data} />;
}
