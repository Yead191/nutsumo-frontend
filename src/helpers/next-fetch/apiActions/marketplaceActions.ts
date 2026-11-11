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

export interface IServiceItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  category: {
    _id: string;
    name: string;
    slug: string;
    isActive?: boolean;
  };
  isActive: boolean;
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
  category?: {
    _id: string;
    name: string;
    slug?: string;
  } | string;
  bio?: string;
  location?: string;
  city?: string;
  postCode?: string;
  experienceYears?: number;
  availabilityStatus?: "Available" | "Booked" | "Unavailable" | string;
  availability?: "AVAILABLE" | "BOOKED" | "UNAVAILABLE" | string;
  hourlyRate?: number;
  startingRate?: number;
  completedJobs?: number;
  rating?: number;
  reviewsCount?: number;
  skills?: string[];
  specialties?: string[];
  tools?: string[];
  certifications?: Array<{
    name: string;
    issuer?: string;
    year?: number;
  }>;
  isProfilePublic?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IArtisanServiceItem {
  _id: string;
  artisan: IArtisanUser;
  service: IServiceItem;
  rateAmount: number;
  rateType: "HOURLY" | "FIXED" | "DAILY" | string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface IPortfolioItem {
  _id: string;
  artisan: string;
  title: string;
  description?: string;
  images: string[];
  beforeImage?: string;
  afterImage?: string;
  completedAt?: string;
  isPublished?: boolean;
}

export interface IArtisanReviewData {
  summary: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution?: Record<string, number>;
  };
  reviews: Array<{
    _id: string;
    booking?: {
      _id: string;
      bookingNumber?: string;
      totalAmount?: number;
    };
    job?: {
      _id: string;
      title?: string;
    };
    customer: {
      _id: string;
      name: string;
      image?: string;
      verified?: boolean;
    };
    rating: number;
    comment: string;
    reply?: {
      comment: string;
      repliedAt: string;
    };
    createdAt: string;
  }>;
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
 * GET /category/:id
 */
export async function getCategoryById(id: string): Promise<FetchResponse<ICategoryItem | null>> {
  try {
    return await nextFetch<ICategoryItem>(`/category/${id}`, {
      method: "GET",
      cache: "force-cache",
      next: { revalidate: 3600 },
      tags: [`category-${id}`],
    });
  } catch (error: any) {
    return { success: false, data: null };
  }
}

/**
 * GET /service?category=${categoryId}&isActive=true
 */
export async function getServicesByCategory(categoryId: string): Promise<FetchResponse<IServiceItem[]>> {
  try {
    return await nextFetch<IServiceItem[]>(`/service?category=${categoryId}&isActive=true&limit=100`, {
      method: "GET",
      cache: "force-cache",
      next: { revalidate: 3600 },
      tags: [`category-services-${categoryId}`],
    });
  } catch (error: any) {
    return { success: false, data: [] };
  }
}

/**
 * GET /service?isActive=true
 */
export async function getAllServices(): Promise<FetchResponse<IServiceItem[]>> {
  try {
    return await nextFetch<IServiceItem[]>("/service?isActive=true&limit=100", {
      method: "GET",
      cache: "force-cache",
      next: { revalidate: 3600 },
      tags: ["services"],
    });
  } catch (error: any) {
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
 * GET /artisan-profile (All artisans with search & filters)
 */
export async function searchArtisansAction(params?: {
  searchTerm?: string;
  category?: string;
  trade?: string;
  location?: string;
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<FetchResponse<IArtisanProfileItem[]>> {
  try {
    const q = new URLSearchParams();
    if (params?.searchTerm) q.append("searchTerm", params.searchTerm);
    if (params?.trade) q.append("trade", params.trade);
    if (params?.location) q.append("location", params.location);
    if (params?.sort) q.append("sort", params.sort);
    if (params?.page) q.append("page", String(params.page));
    if (params?.limit) q.append("limit", String(params.limit || 20));

    return await nextFetch<IArtisanProfileItem[]>(`/artisan-profile?${q.toString()}`, {
      method: "GET",
      cache: "no-store",
    });
  } catch (error: any) {
    return { success: false, data: [] };
  }
}

/**
 * GET /artisan-profile/user/:userId or GET /artisan-profile/:id
 */
export async function getArtisanPublicProfile(userIdOrId: string): Promise<FetchResponse<IArtisanProfileItem | null>> {
  try {
    let res = await nextFetch<IArtisanProfileItem>(`/artisan-profile/user/${userIdOrId}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.success || !res.data) {
      res = await nextFetch<IArtisanProfileItem>(`/artisan-profile/${userIdOrId}`, {
        method: "GET",
        cache: "no-store",
      });
    }

    return res;
  } catch (error: any) {
    return { success: false, data: null };
  }
}

/**
 * GET /artisan-service?artisan=:userId&isActive=true
 */
export async function getArtisanServices(artisanUserId: string): Promise<FetchResponse<IArtisanServiceItem[]>> {
  try {
    return await nextFetch<IArtisanServiceItem[]>(`/artisan-service?artisan=${artisanUserId}&isActive=true&limit=50`, {
      method: "GET",
      cache: "no-store",
    });
  } catch (error: any) {
    return { success: false, data: [] };
  }
}

/**
 * GET /portfolio/artisan/:userId
 */
export async function getArtisanPortfolioList(artisanUserId: string): Promise<FetchResponse<IPortfolioItem[]>> {
  try {
    return await nextFetch<IPortfolioItem[]>(`/portfolio/artisan/${artisanUserId}`, {
      method: "GET",
      cache: "no-store",
    });
  } catch (error: any) {
    return { success: false, data: [] };
  }
}

/**
 * GET /review/artisan/:userId
 */
export async function getArtisanReviewsData(artisanUserId: string): Promise<FetchResponse<IArtisanReviewData>> {
  try {
    return await nextFetch<IArtisanReviewData>(`/review/artisan/${artisanUserId}`, {
      method: "GET",
      cache: "no-store",
    });
  } catch (error: any) {
    return {
      success: false,
      data: { summary: { averageRating: 0, totalReviews: 0 }, reviews: [] },
    };
  }
}

/**
 * POST /job (Method 1: "Request Custom Quote" workflow)
 * Pins job inquiry directly to this artisan via selectedArtisan
 */
export async function requestDirectCustomQuoteAction(formData: FormData): Promise<FetchResponse<any>> {
  try {
    return await nextFetch("/job", {
      method: "POST",
      body: formData,
    });
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to submit custom quote request" };
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
