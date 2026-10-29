import type { Metadata } from "next";
import { ArtisanPortfolioManager } from "@/components/web-pages/artisan-dashboard/artisan-portfolio";
import {
  getMyPortfolio,
  getServiceCategories,
} from "@/helpers/next-fetch/apiActions/artisanActions";

export const metadata: Metadata = {
  title: "Portfolio Showcase · Nutsumo",
  description:
    "Manage and showcase your completed artisan projects, before & after transformations, and verified craftsmanship.",
};

export default async function ProPortfolioPage() {
  // Fetch real authenticated artisan portfolio & categories in parallel
  const [portfolioRes, categoriesRes] = await Promise.allSettled([
    getMyPortfolio(),
    getServiceCategories(),
  ]);

  let initialPortfolio: any[] = [];
  let categories: any[] = [];

  if (
    portfolioRes.status === "fulfilled" &&
    portfolioRes.value?.success &&
    Array.isArray(portfolioRes.value.data)
  ) {
    initialPortfolio = portfolioRes.value.data;
  }

  if (
    categoriesRes.status === "fulfilled" &&
    categoriesRes.value?.success &&
    Array.isArray(categoriesRes.value.data)
  ) {
    categories = categoriesRes.value.data;
  }

  return (
    <ArtisanPortfolioManager
      initialPortfolio={initialPortfolio}
      categories={categories}
    />
  );
}
