import { Suspense } from "react";
import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/page-banner";
import { photos } from "@/lib/media";
import { BrowseProsClient } from "./browse-pros-client";
import {
  getMarketplaceCategories,
  searchArtisansAction,
  type IArtisanProfileItem,
} from "@/helpers/next-fetch/apiActions/marketplaceActions";

export const revalidate = 60; // 1 minute ISR for live search/availability

export const metadata: Metadata = {
  title: "Browse Verified Trade Artisans & Contractors · Nutsumo",
  description:
    "Discover and hire background-screened, verified master artisans across Ghana. Compare transparent rates and request custom quotes with 100% escrow protection.",
};

interface BrowseProsPageProps {
  searchParams: Promise<{
    searchTerm?: string;
    q?: string;
    category?: string;
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
  const availabilityStatus = resolvedParams.availabilityStatus || "";
  const sort = resolvedParams.sort || "-rating";

  // 1. Parallel backend fetch: categories list + server-side filtered artisans
  const [categoriesRes, artisansRes] = await Promise.all([
    getMarketplaceCategories(),
    searchArtisansAction({
      searchTerm: searchTerm || undefined,
      trade: trade || undefined,
      category: category || undefined,
      location: location || undefined,
      availabilityStatus:
        availabilityStatus !== "all" ? availabilityStatus : undefined,
      sort,
      rating: resolvedParams.rating,
      page,
      limit: 12,
    }),
  ]);

  const categories = categoriesRes?.data || [];
  const artisans = (artisansRes?.data || []) as IArtisanProfileItem[];
  const pagination = (artisansRes as any)?.pagination || null;

  return (
    <div className="bg-slate-50/60 min-h-screen pt-18">
      <PageBanner
        eyebrow="Marketplace Directory"
        title="Find &amp; Hire Verified Trade Pros"
        description="Search screened craftsmen in Accra and across Ghana. Compare custom proposals and hire with 100% Escrow Milestone Protection."
        image={photos.banners.pros}
      />
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
          filterParams={{
            searchTerm,
            trade,
            category,
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
