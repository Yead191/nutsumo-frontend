import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getServiceById,
  getArtisansByService,
  searchArtisansAction,
  getCategoryById,
  getMarketplaceCategories,
  type IArtisanProfileItem,
} from "@/helpers/next-fetch/apiActions/marketplaceActions";
import { ServiceArtisansContainer } from "@/components/web-pages/service-artisans/ServiceArtisansContainer";

export const revalidate = 60; // 1 minute ISR for live marketplace availability

interface ServiceProsPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    searchTerm?: string;
    location?: string;
    sort?: string;
    availability?: string;
    rating?: string;
    page?: string;
  }>;
}

export async function generateMetadata({
  params,
}: ServiceProsPageProps): Promise<Metadata> {
  const { id } = await params;
  const serviceRes = await getServiceById(id);
  const service = serviceRes?.data;

  if (!service) {
    return {
      title: "Verified Service Specialists · Nutsumo",
    };
  }

  return {
    title: `${service.name} Specialists in Ghana — Verified Artisans | Nutsumo`,
    description:
      service.description?.slice(0, 160) ||
      `Find and hire top-rated ${service.name.toLowerCase()} professionals in Ghana. Escrow protected payments and upfront custom quotes.`,
  };
}

export default async function ServiceArtisansPage({
  params,
  searchParams,
}: ServiceProsPageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;

  // 1. Fetch Service Details
  const serviceRes = await getServiceById(id);
  const service = serviceRes?.data;

  if (!service) {
    notFound();
  }

  const categoryId =
    typeof service.category === "object"
      ? (service.category as any)?._id
      : service.category;

  const categoryName =
    typeof service.category === "object"
      ? (service.category as any)?.name
      : undefined;

  // 2. Fetch Category, Specific Service Artisans & Categories Catalog in parallel
  const [artisanServicesRes, categoryRes, allCategoriesRes, tradeProfilesRes] =
    await Promise.all([
      getArtisansByService(id, {
        location: resolvedSearchParams.location || "",
        sort: resolvedSearchParams.sort || "",
      }),
      categoryId
        ? getCategoryById(categoryId)
        : Promise.resolve({ data: null }),
      getMarketplaceCategories(),
      // Also query general trade artisans if specific service listings are sparse
      categoryName
        ? searchArtisansAction({
            trade: categoryName,
            searchTerm: resolvedSearchParams.searchTerm,
            location: resolvedSearchParams.location,
            availabilityStatus: resolvedSearchParams.availability,
            sort: resolvedSearchParams.sort,
          })
        : Promise.resolve({ data: [] }),
    ]);

  const category = categoryRes?.data || null;
  const categories = allCategoriesRes?.data || [];
  const directArtisanServices = artisanServicesRes?.data || [];
  const generalTradeProfiles = (tradeProfilesRes?.data ||
    []) as IArtisanProfileItem[];

  // 3. Assemble unified artisan list
  const seenArtisanUserIds = new Set<string>();
  const unifiedArtisans: Array<{
    profile: IArtisanProfileItem;
    customRate?: { amount: number; type: string };
  }> = [];

  // Add direct service providers first (highest precision)
  directArtisanServices.forEach((asItem) => {
    console.log(directArtisanServices);
    const artisanUser = asItem.artisan;
    if (!artisanUser || seenArtisanUserIds.has(artisanUser._id)) return;

    seenArtisanUserIds.add(artisanUser._id);
    unifiedArtisans.push({
      profile: {
        _id: asItem._id,
        user: {
          _id: artisanUser._id,
          name: artisanUser.name,
          email: artisanUser.email,
          image:
            (artisanUser as any).profileImage || (artisanUser as any).image,
          verified: artisanUser.verified,
          location: artisanUser.location,
          trade: artisanUser.trade || categoryName || service.name,
        },
        businessName:
          (artisanUser as any).businessName || `${artisanUser.name} Services`,
        trade: artisanUser.trade || categoryName || service.name,
        hourlyRate: asItem.rateAmount,
        startingRate: asItem.rateAmount,
        location: artisanUser.location,
        availabilityStatus:
          (artisanUser as any).availabilityStatus || "Available",
      },
      customRate: {
        amount: asItem.rateAmount,
        type: asItem.rateType,
      },
    });
  });

  // Supplement with verified general trade artisans from backend search
  generalTradeProfiles.forEach((profile) => {
    const userId = profile.user?._id || profile._id;
    if (seenArtisanUserIds.has(userId)) return;

    seenArtisanUserIds.add(userId);
    unifiedArtisans.push({
      profile,
    });
  });

  // Apply server-requested rating filter if selected
  const finalArtisans =
    resolvedSearchParams.rating && resolvedSearchParams.rating !== "all"
      ? unifiedArtisans.filter(
          (a) =>
            (a.profile.rating || 5.0) >= Number(resolvedSearchParams.rating),
        )
      : unifiedArtisans;

  return (
    <ServiceArtisansContainer
      service={service}
      category={category}
      artisans={finalArtisans}
      categories={categories}
      filterParams={resolvedSearchParams}
    />
  );
}
