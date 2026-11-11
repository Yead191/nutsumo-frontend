import {
  getMarketplaceCategories,
  getFeaturedArtisans,
  getMarketplaceTestimonials,
  getMarketplaceFaqs,
} from "@/helpers/next-fetch/apiActions/marketplaceActions";
import { HeroMarketplace } from "@/components/web-pages/home/HeroMarketplace";
import { CategoryGrid } from "@/components/web-pages/home/CategoryGrid";
import { TrustGuaranteeStrip } from "@/components/web-pages/home/TrustGuaranteeStrip";
import { FeaturedArtisansGrid } from "@/components/web-pages/home/FeaturedArtisansGrid";
import { DiscoveryFunnelSteps } from "@/components/web-pages/home/DiscoveryFunnelSteps";
import { EscrowSecurityShowcase } from "@/components/web-pages/home/EscrowSecurityShowcase";
import { HomeTestimonialsSection } from "@/components/web-pages/home/HomeTestimonialsSection";
import { HomeFaqSection } from "@/components/web-pages/home/HomeFaqSection";
import { MarketplaceDualCta } from "@/components/web-pages/home/MarketplaceDualCta";

export const revalidate = 300; // 5-minute Incremental Static Regeneration (ISR)

export default async function HomePage() {
  // Parallel Server-Side Fetching with ISR Caching & Tags
  const [categoriesRes, artisansRes, testimonialsRes, faqsRes] =
    await Promise.all([
      getMarketplaceCategories(),
      getFeaturedArtisans(8),
      getMarketplaceTestimonials(6),
      getMarketplaceFaqs(),
    ]);

  const categories = categoriesRes?.data || [];
  const artisans = artisansRes?.data || [];
  const testimonials = testimonialsRes?.data || [];
  const faqs = faqsRes?.data || [];

  const popularChips = categories.map((c) => ({
    name: c.name,
    slug: c.slug || c._id,
  }));

  return (
    <div className="bg-white min-h-screen">
      {/* 1. Hero Marketplace Search & Trust Badges */}
      <HeroMarketplace popularCategories={popularChips} />

      {/* 2. Real Categories Grid (from GET /category?isActive=true) */}
      <CategoryGrid categories={categories} />

      {/* 3. Escrow & Trust Guarantee Strip */}
      <TrustGuaranteeStrip />

      {/* 4. Top Rated Featured Artisans (from GET /artisan-profile?sort=-rating) */}
      <FeaturedArtisansGrid artisans={artisans} />

      {/* 5. 4-Step Discovery & Direct Hiring Funnel */}
      <DiscoveryFunnelSteps />

      {/* 6. Nutsumo Escrow Security Difference */}
      <EscrowSecurityShowcase />

      {/* 7. Verified Client Testimonials */}
      <HomeTestimonialsSection testimonials={testimonials} />

      {/* 8. Frequently Asked Questions */}
      <HomeFaqSection faqs={faqs} />

      {/* 9. Dual-Sided Marketplace Call-to-Action */}
      <MarketplaceDualCta />
    </div>
  );
}
