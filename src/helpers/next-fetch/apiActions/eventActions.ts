"use server";

import { nextFetch } from "../core/NextFetch";

export type EventCategory = "fundraiser" | "pitch-night" | "workshop" | "gala";
export type EventType = "physical" | "virtual" | "hybrid";
export type EventPricingType = "free" | "paid";
export type EventStatus = "draft" | "published" | "cancelled" | "completed";

export interface IEventSpeaker {
  name: string;
  role: string;
  avatar: string;
}

export interface IEventUser {
  _id: string;
  name: string;
  role?: string;
  email?: string;
  image?: string;
}

export interface IEvent {
  _id: string;
  title: string;
  description: string;
  category: EventCategory;
  type: EventType;
  pricingType: EventPricingType;
  price?: number;
  capacity: number;
  reservedCount: number;
  remainingSeats?: number;
  startDate: string; // ISO string
  endDate: string; // ISO string
  location: string;
  venueAddress?: string;
  virtualLink?: string;
  dressCode?: string;
  featured: boolean;
  image: string;
  status: EventStatus;
  speakers?: IEventSpeaker[];
  createdBy?: IEventUser | string;
  createdAt: string;
  updatedAt: string;
}

export interface EventsResponse {
  success: boolean;
  message?: string;
  data: IEvent[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface SingleEventResponse {
  success: boolean;
  data: IEvent | null;
  message?: string;
}

export interface IBookingPayload {
  event: string;
  customerPhone?: string;
  quantity?: number;
  note?: string;
}

export interface IBookingResult {
  booking?: {
    _id: string;
    event: string | IEvent;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    quantity: number;
    price: number;
    ticketCode?: string;
    checkedIn: boolean;
    status: "pending" | "confirmed" | "attended" | "cancelled";
    paymentStatus: "free" | "pending" | "paid" | "failed";
  };
  isPaid: boolean;
  ticketCode?: string;
  checkoutUrl?: string;
  message?: string;
}

export interface BookingResponse {
  success: boolean;
  statusCode?: number;
  message?: string;
  data?: IBookingResult;
  error?: string | null;
}

/**
 * Fetch all published events from backend with optional filters
 */
export async function getEvents({
  searchTerm = "",
  category = "",
  type = "",
  pricingType = "",
  featured,
  status = "published",
  page = 1,
  limit = 20,
  sort = "startDate",
}: {
  searchTerm?: string;
  category?: string;
  type?: string;
  pricingType?: string;
  featured?: boolean;
  status?: string;
  page?: number;
  limit?: number;
  sort?: string;
} = {}): Promise<EventsResponse> {
  const params = new URLSearchParams();
  if (page) params.set("page", String(page));
  if (limit) params.set("limit", String(limit));
  if (status) params.set("status", status);
  if (searchTerm && searchTerm.trim())
    params.set("searchTerm", searchTerm.trim());
  if (category && category !== "all") params.set("category", category);
  if (type && type !== "all") params.set("type", type);
  if (pricingType && pricingType !== "all")
    params.set("pricingType", pricingType);
  if (typeof featured === "boolean") params.set("featured", String(featured));
  if (sort) params.set("sort", sort);

  try {
    const tags = ["events"];
    if (category) tags.push(`events-${category}`);

    const res = await nextFetch<IEvent[]>(`/event?${params.toString()}`, {
      cache: "force-cache",
      next: {
        revalidate: 60,
        tags,
      },
    });

    if (res.success && Array.isArray(res.data)) {
      return {
        success: true,
        data: res.data,
        pagination: res.pagination,
      };
    }

    return {
      success: false,
      message: res.message || "Failed to fetch events",
      data: [],
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
      data: [],
    };
  }
}

/**
 * Fetch a single event by ID
 */
export async function getSingleEvent(id: string): Promise<SingleEventResponse> {
  try {
    const res = await nextFetch<IEvent>(`/event/${id}`, {
      cache: "force-cache",
      next: {
        revalidate: 60,
        tags: ["events", `event-${id}`],
      },
    });

    if (res.success && res.data) {
      return { success: true, data: res.data };
    }

    return { success: false, data: null, message: res.message };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}

/**
 * Fetch the nearest upcoming event (today or closest upcoming nearby event)
 */
export async function getUpcomingEvent(): Promise<SingleEventResponse> {
  try {
    const res = await nextFetch<IEvent>("/event/upcoming", {
      cache: "force-cache",
      next: {
        revalidate: 60,
        tags: ["events", "upcoming-event"],
      },
    });

    if (res.success && res.data) {
      return { success: true, data: res.data };
    }

    return { success: false, data: null, message: res.message };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}

/**
 * Reserve or purchase an event ticket
 * NOTE: User must be authenticated (JWT automatically attached by nextFetch).
 * Customer Name & Email are extracted securely from req.user by backend.
 */
export async function bookEventTicket(
  payload: IBookingPayload,
): Promise<BookingResponse> {
  try {
    const res = await nextFetch<IBookingResult>("/booking", {
      method: "POST",
      body: {
        event: payload.event,
        customerPhone: payload.customerPhone || undefined,
        quantity: Math.max(1, payload.quantity || 1),
        note: payload.note || undefined,
      },
    });

    return {
      success: res.success,
      statusCode: res.statusCode,
      message: res.message,
      data: res.data,
      error: res.error,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Network error during booking",
    };
  }
}

/**
 * Fetch pre-rendered Luxury Gold & Black Ticket HTML from backend
 */
export async function getTicketHtml(idOrCode: string): Promise<{
  success: boolean;
  html?: string;
  error?: string;
}> {
  try {
    const baseUrl = process.env.BASE_URL || "http://10.10.26.173:5004/api/v1";
    const res = await fetch(`${baseUrl}/booking/ticket/${idOrCode}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        success: false,
        error: `Ticket not found (${res.status})`,
      };
    }

    const html = await res.text();
    return { success: true, html };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to load ticket",
    };
  }
}
