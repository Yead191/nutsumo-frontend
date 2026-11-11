import { Suspense } from "react";
import { PageBanner } from "@/components/layout/page-banner";
import { photos } from "@/lib/media";
import { BrowseProsClient } from "./browse-pros-client";
import {
  getMarketplaceCategories,
  getFeaturedArtisans,
} from "@/helpers/next-fetch/apiActions/marketplaceActions";

export const revalidate = 300; // 5 minutes ISR

export default async function BrowseProsPage() {
  const [categoriesRes, artisansRes] = await Promise.all([
    getMarketplaceCategories(),
    getFeaturedArtisans(50),
  ]);

  const categories = categoriesRes?.data || [];
  const artisans = artisansRes?.data || [];

  return (
    <>
      <PageBanner
        eyebrow="Marketplace Directory"
        title="Find &amp; Hire Verified Trade Pros"
        description="Search screened craftsmen, compare custom proposals, and hire with 100% Escrow Milestone Protection."
        image={photos.banners.pros}
      />
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-4 py-16 text-sm text-muted text-center">
            Loading verified professionals…
          </div>
        }
      >
        <BrowseProsClient initialArtisans={artisans} categories={categories} />
      </Suspense>
    </>
  );
}
