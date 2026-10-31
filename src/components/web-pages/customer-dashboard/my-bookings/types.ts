import type { IBookingItem, BookingStatus } from "@/helpers/next-fetch/apiActions/bookingActions";

export type BookingFilterTab = "ALL" | BookingStatus;

export interface MyBookingsManagerProps {
  initialBookings: IBookingItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}
