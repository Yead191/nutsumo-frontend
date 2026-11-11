import { PageBanner } from "@/components/layout/page-banner";
import { ServicesCatalog } from "@/components/web-pages/services-catalog";
import { photos } from "@/lib/media";
import { getMarketplaceCategories } from "@/helpers/next-fetch/apiActions/marketplaceActions";

export const revalidate = 3600; // 1 hour ISR

export default async function ServicesPage() {
  const categoriesRes = await getMarketplaceCategories();
  const categories = categoriesRes?.data || [];

  return (
    <>
      <PageBanner
        eyebrow="Services Catalog"
        title="Explore Verified Trade Services"
        description="Discover screened craftsmen and specialists in every trade category. 100% Escrow Protected."
        image={photos.banners.pros}
      />
      <ServicesCatalog categories={categories} />
    </>
  );
}
