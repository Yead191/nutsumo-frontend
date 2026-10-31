import type { Metadata } from "next";
import { getMyBookingsAction } from "@/helpers/next-fetch/apiActions/bookingActions";
import { MyBookingsManager } from "@/components/web-pages/customer-dashboard/my-bookings";

export const metadata: Metadata = {
  title: "My Bookings · Nutsumo",
  description:
    "View your confirmed service bookings, track work schedules, and contact your hired artisans.",
};

export default async function CustomerBookingsPage() {
  const res = await getMyBookingsAction({ page: 1, limit: 20 });
  const initialBookings = res.success && Array.isArray(res.data) ? res.data : [];

  return (
    <MyBookingsManager
      initialBookings={initialBookings}
      pagination={res.pagination}
    />
  );
}
