"use server";

import { nextFetch, type FetchResponse } from "../core/NextFetch";

export interface ICategoryItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IArtisanUser {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  image?: string;
  verified?: boolean;
  trade?: string;
  location?: string;
  status?: string;
  identityStatus?: string;
}

export interface IArtisanProfileItem {
  _id: string;
  user: IArtisanUser;
  businessName?: string;
  trade?: string;
  bio?: string;
  location?: string;
  postCode?: string;
  experienceYears?: number;
  availabilityStatus: "Available" | "Booked" | "Unavailable" | string;
  hourlyRate?: number;
  startingRate?: number;
  completedJobs?: number;
  rating?: number;
  reviewsCount?: number;
  isProfilePublic?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ITestimonialItem {
  _id: string;
  name: string;
  role?: string;
  comment: string;
  rating?: number;
  image?: string;
  company?: string;
  createdAt?: string;
}

export interface IFaqItem {
  _id: string;
  question: string;
  answer: string;
  category?: string;
}

/**
 * GET /category?isActive=true&limit=50
 * Cached with ISR (revalidated every 1 hour) with instant on-demand tag revalidation
 */
export async function getMarketplaceCategories(): Promise<
  FetchResponse<ICategoryItem[]>
> {
  try {
    return await nextFetch<ICategoryItem[]>(
      "/category?isActive=true&limit=50",
      {
        method: "GET",
        cache: "force-cache",
        next: {
          revalidate: 3600, // 1 hour ISR
        },
        tags: ["categories"],
      },
    );
  } catch (error: any) {
    console.error("Failed to fetch marketplace categories:", error?.message);
    return { success: false, data: [] };
  }
}

/**
 * GET /artisan-profile?sort=-rating&limit=8
 * Fetches top-rated verified artisans for the marketplace homepage
 * Cached with ISR (revalidated every 5 minutes)
 */
export async function getFeaturedArtisans(
  limit: number = 8,
): Promise<FetchResponse<IArtisanProfileItem[]>> {
  try {
    return await nextFetch<IArtisanProfileItem[]>(
      `/artisan-profile?sort=-rating&limit=${limit}`,
      {
        method: "GET",
        cache: "force-cache",
        next: {
          revalidate: 300, // 5 minutes ISR
        },
        tags: ["artisan-profiles", "featured-artisans"],
      },
    );
  } catch (error: any) {
    console.error("Failed to fetch featured artisans:", error?.message);
    return { success: false, data: [] };
  }
}

/**
 * GET /testimonial?limit=6
 * Fetches verified client testimonials
 */
export async function getMarketplaceTestimonials(
  limit: number = 6,
): Promise<FetchResponse<ITestimonialItem[]>> {
  try {
    return await nextFetch<ITestimonialItem[]>(`/testimonial?limit=${limit}`, {
      method: "GET",
      cache: "force-cache",
      next: {
        revalidate: 3600,
      },
      tags: ["testimonials"],
    });
  } catch (error: any) {
    console.error("Failed to fetch testimonials:", error?.message);
    return { success: false, data: [] };
  }
}

/**
 * GET /faq
 * Fetches FAQ items
 */
export async function getMarketplaceFaqs(): Promise<FetchResponse<IFaqItem[]>> {
  try {
    return await nextFetch<IFaqItem[]>("/faq", {
      method: "GET",
      cache: "force-cache",
      next: {
        revalidate: 3600,
      },
      tags: ["faqs"],
    });
  } catch (error: any) {
    console.error("Failed to fetch FAQs:", error?.message);
    return { success: false, data: [] };
  }
}
