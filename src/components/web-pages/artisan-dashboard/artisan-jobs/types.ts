import type { IQuotationItem } from "@/helpers/next-fetch/apiActions/quotationActions";
import type { IBookingItem } from "@/helpers/next-fetch/apiActions/bookingActions";
import type { IJobItem } from "@/helpers/next-fetch/apiActions/jobActions";
import type { IPaginationData } from "@/components/shared/Pagination";

export type { IQuotationItem, IBookingItem, IJobItem, IPaginationData };

export type ArtisanJobsTab = "proposals" | "bookings" | "leads";

export interface ArtisanJobsManagerProps {
  initialQuotations: IQuotationItem[];
  initialBookings: IBookingItem[];
  availableJobs: IJobItem[];
  pagination?: IPaginationData | null;
  initialParams?: {
    page?: number;
    searchTerm?: string;
    category?: string;
    service?: string;
    tab?: ArtisanJobsTab;
  };
}
