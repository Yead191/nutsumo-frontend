import { Suspense } from "react";
import type { Metadata } from "next";
import { BrowseProsClient } from "./browse-pros-client";
import {
  getMarketplaceCategories,
  getServiceById,
  searchArtisansAction,
  type IArtisanProfileItem,
} from "@/helpers/next-fetch/apiActions/marketplaceActions";
import getProfile from "@/helpers/next-fetch/core/getProfile";
import { toQuoteViewer } from "@/lib/quoteViewer";

export const revalidate = 60; // 1 minute ISR for live search/availability

export const metadata: Metadata = {
  title: "Browse Verified Workers & Professionals · Nutsumo",
  description:
    "Discover and hire verified skilled workers and professionals across Ghana  from tradespeople, chefs and drivers to nannies, security, office and creative talent. Compare transparent rates and request custom quotes with 100% escrow protection.",
};

interface BrowseProsPageProps {
  searchParams: Promise<{
    searchTerm?: string;
    q?: string;
    category?: string;
    service?: string;
    trade?: string;
    location?: string;
    zip?: string;
    availabilityStatus?: string;
    sort?: string;
    rating?: string;
    page?: string;
  }>;
}

export default async function BrowseProsPage({
  searchParams,
}: BrowseProsPageProps) {
  const resolvedParams = await searchParams;
  const page = resolvedParams.page ? Number(resolvedParams.page) : 1;

  const searchTerm = resolvedParams.searchTerm || resolvedParams.q || "";
  const location = resolvedParams.location || resolvedParams.zip || "";
  const trade = resolvedParams.trade || "";
  const category = resolvedParams.category || "";
  const service = resolvedParams.service || "";
  const availabilityStatus = resolvedParams.availabilityStatus || "";
  const sort = resolvedParams.sort || "-rating";

  // 1. Parallel backend fetch: categories list + server-side filtered artisans
  const [categoriesRes, artisansRes, user, serviceRes] = await Promise.all([
    getMarketplaceCategories(),
    searchArtisansAction({
      searchTerm: searchTerm || undefined,
      trade: trade || undefined,
      category: category || undefined,
      service: service || undefined,
      location: location || undefined,
      availabilityStatus:
        availabilityStatus !== "all" ? availabilityStatus : undefined,
      sort,
      rating: resolvedParams.rating,
      page,
      limit: 12,
    }),
    getProfile(),
    // Name for the active-filter chip (cached per service).
    service ? getServiceById(service) : Promise.resolve(null),
  ]);

  const categories = categoriesRes?.data || [];
  const artisans = (artisansRes?.data || []) as IArtisanProfileItem[];
  const pagination = (artisansRes as any)?.pagination || null;
  const serviceName = serviceRes?.data?.name || "";

  return (
    <div className="bg-white min-h-screen pt-18">
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-4 py-16 text-sm text-muted text-center">
            Loading verified professionals…
          </div>
        }
      >
        <BrowseProsClient
          artisans={artisans}
          categories={categories}
          pagination={pagination}
          viewer={toQuoteViewer(user)}
          filterParams={{
            searchTerm,
            trade,
            category,
            service,
            serviceName,
            location,
            availabilityStatus,
            sort,
            rating: resolvedParams.rating,
            page,
          }}
        />
      </Suspense>
    </div>
  );
}
