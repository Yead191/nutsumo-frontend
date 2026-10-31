import type { IQuotationItem } from "@/helpers/next-fetch/apiActions/quotationActions";
import type { IBookingItem } from "@/helpers/next-fetch/apiActions/bookingActions";
import type { IJobItem } from "@/helpers/next-fetch/apiActions/jobActions";

export type { IQuotationItem, IBookingItem, IJobItem };

export type ArtisanJobsTab = "proposals" | "bookings" | "leads";

export interface ArtisanJobsManagerProps {
  initialQuotations: IQuotationItem[];
  initialBookings: IBookingItem[];
  availableJobs: IJobItem[];
}
