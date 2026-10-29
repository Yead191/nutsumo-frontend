import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortfolioDetailsView } from "@/components/web-pages/artisan-dashboard/artisan-portfolio/components/PortfolioDetailsView";
import {
  getSinglePortfolioItem,
  getServiceCategories,
} from "@/helpers/next-fetch/apiActions/artisanActions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const res = await getSinglePortfolioItem(id);

  if (!res?.data?.title) {
    return {
      title: "Portfolio Project · Nutsumo",
    };
  }

  return {
    title: `${res.data.title} · Portfolio · Nutsumo`,
    description:
      res.data.description?.slice(0, 160) ||
      "View completed artisan project details, craftsmanship statement, and before/after photos.",
  };
}

export default async function PortfolioItemPage({ params }: PageProps) {
  const { id } = await params;

  const [portfolioRes, categoriesRes] = await Promise.allSettled([
    getSinglePortfolioItem(id),
    getServiceCategories(),
  ]);

  if (
    portfolioRes.status !== "fulfilled" ||
    !portfolioRes.value?.success ||
    !portfolioRes.value?.data
  ) {
    notFound();
  }

  const initialItem = portfolioRes.value.data;
  const categories =
    categoriesRes.status === "fulfilled" &&
    Array.isArray(categoriesRes.value?.data)
      ? categoriesRes.value.data
      : [];

  return (
    <PortfolioDetailsView
      initialItem={initialItem}
      categories={categories}
    />
  );
}
