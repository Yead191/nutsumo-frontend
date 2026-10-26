import { PageBanner } from "@/components/layout/page-banner";
import { ServicesCatalog } from "@/components/web-pages/services-catalog";
import { photos } from "@/lib/media";

export default function ServicesPage() {
  return (
    <>
      <PageBanner
        eyebrow="Services"
        title="Our Services"
        description="Explore specialized residential trade services available across Austin."
        image={photos.banners.pros}
      />
      <ServicesCatalog />
    </>
  );
}
