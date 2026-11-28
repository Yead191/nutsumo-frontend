import { PageBanner } from "@/components/layout/page-banner";
import { ServicesCatalog } from "@/components/web-pages/services-catalog";
import { stock } from "@/lib/stock-photos";
import { getMarketplaceCategories } from "@/helpers/next-fetch/apiActions/marketplaceActions";

export const revalidate = 3600; // 1 hour ISR

export default async function ServicesPage() {
  const categoriesRes = await getMarketplaceCategories();
  const categories = categoriesRes?.data || [];

  return (
    <>
      <PageBanner
        eyebrow="Services catalog"
        title="Explore every skill, from repairs to code"
        description="Discover verified workers and professionals in every category, formal and informal. Every job is 100% escrow protected."
        image={stock.carpenter}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
      />
      <ServicesCatalog categories={categories} />
    </>
  );
}
