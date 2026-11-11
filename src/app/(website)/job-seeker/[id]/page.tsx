import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getArtisanPublicProfile,
  getArtisanServices,
  getArtisanPortfolioList,
  getArtisanReviewsData,
  getMarketplaceCategories,
} from "@/helpers/next-fetch/apiActions/marketplaceActions";
import { Artisan360PublicProfile } from "@/components/web-pages/artisan-profile/Artisan360PublicProfile";

export const revalidate = 120; // 2 minutes ISR for live artisan profiles

interface JobSeekerProfilePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: JobSeekerProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  const profileRes = await getArtisanPublicProfile(id);
  const profile = profileRes?.data;

  if (!profile) {
    return {
      title: "Artisan Profile · Nutsumo",
    };
  }

  const name =
    profile.businessName || profile.user?.name || "Verified Professional";
  const categoryName =
    typeof profile.category === "object"
      ? profile.category?.name
      : profile.category;
  const trade = profile.trade || categoryName || "Artisan";
  const location = profile.location || profile.city || "Ghana";

  return {
    title: `${name} — Verified ${trade} in ${location} · Nutsumo`,
    description:
      profile.bio?.slice(0, 160) ||
      `Hire ${name} for verified ${trade.toLowerCase()} services in ${location}. 100% Escrow protected quotes.`,
  };
}

export default async function JobSeekerPublicProfilePage({
  params,
}: JobSeekerProfilePageProps) {
  const { id } = await params;

  // 1. Fetch public artisan/job-seeker profile
  const profileRes = await getArtisanPublicProfile(id);
  const profile = profileRes?.data;

  if (!profile) {
    notFound();
  }

  // Determine user ID for sub-resources
  const artisanUserId = profile.user?._id || profile._id;

  // 2. Parallel fetch of sub-resources (Services, Portfolio, Reviews, Categories)
  const [servicesRes, portfolioRes, reviewsRes, categoriesRes] =
    await Promise.all([
      getArtisanServices(artisanUserId),
      getArtisanPortfolioList(artisanUserId),
      getArtisanReviewsData(artisanUserId),
      getMarketplaceCategories(),
    ]);

  const services = servicesRes?.data || [];
  const portfolio = portfolioRes?.data || [];
  const reviewData = reviewsRes?.data;
  const categories = categoriesRes?.data || [];

  return (
    <Artisan360PublicProfile
      profile={profile}
      services={services}
      portfolio={portfolio}
      reviewData={reviewData}
      categories={categories}
    />
  );
}
