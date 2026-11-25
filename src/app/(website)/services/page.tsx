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
        title="Explore Verified Skills & Services"
        description="Discover verified workers and professionals in every category — formal and informal. 100% Escrow Protected."
        image={photos.banners.pros}
      />
      <ServicesCatalog categories={categories} />
    </>
  );
}
