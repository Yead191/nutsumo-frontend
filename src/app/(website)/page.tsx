import {
  getMarketplaceCategories,
  getFeaturedArtisans,
  getMarketplaceTestimonials,
  getMarketplaceFaqs,
} from "@/helpers/next-fetch/apiActions/marketplaceActions";
import { HeroMarketplace } from "@/components/web-pages/home/HeroMarketplace";
import { CategoryGrid } from "@/components/web-pages/home/CategoryGrid";
import { PopularServices } from "@/components/web-pages/home/PopularServices";
import { MakeItHappenSection } from "@/components/web-pages/home/MakeItHappenSection";
import { FeaturedArtisansGrid } from "@/components/web-pages/home/FeaturedArtisansGrid";
import { SuccessVideoSection } from "@/components/web-pages/home/SuccessVideoSection";
import { EscrowSecurityShowcase } from "@/components/web-pages/home/EscrowSecurityShowcase";
import { HomeTestimonialsSection } from "@/components/web-pages/home/HomeTestimonialsSection";
import { HomeFaqSection } from "@/components/web-pages/home/HomeFaqSection";
import { FingertipsCta } from "@/components/web-pages/home/FingertipsCta";
import { CitiesMarquee } from "@/components/web-pages/home/CitiesMarquee";
import { HowItWorksVisual } from "@/components/web-pages/home/HowItWorksVisual";
import { InspirationGallery } from "@/components/web-pages/home/InspirationGallery";
import { BusinessSection } from "@/components/web-pages/home/BusinessSection";
import { EarnAsProSection } from "@/components/web-pages/home/EarnAsProSection";
import { GuidesSection } from "@/components/web-pages/home/GuidesSection";

export const revalidate = 300; // 5-minute Incremental Static Regeneration (ISR)

export default async function HomePage() {
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
      {/* 1. Full-bleed video hero with search (Fiverr-style) */}
      <HeroMarketplace popularCategories={popularChips} />

      {/* 2. Category icon tiles + cities we serve */}
      <div className="reveal"><CategoryGrid categories={categories} /></div>
      <div className="reveal"><CitiesMarquee /></div>

      {/* 3. Fiverr-style tabbed showcase of popular services */}
      <div className="reveal"><PopularServices categories={categories} /></div>

      {/* 4. Value props with photo collage */}
      <div className="reveal"><MakeItHappenSection /></div>

      {/* 5. How it works (clients / pros toggle) */}
      <div className="reveal"><HowItWorksVisual /></div>

      {/* 6. Top-rated pros */}
      <div className="reveal"><FeaturedArtisansGrid artisans={artisans} /></div>

      {/* 7. Inspiration gallery */}
      <div className="reveal"><InspirationGallery /></div>

      {/* 8. Nutsumo for business */}
      <div className="reveal"><BusinessSection /></div>

      {/* 9. "What success looks like" video */}
      <div className="reveal"><SuccessVideoSection /></div>

      {/* 10. Escrow trust differentiator */}
      <div className="reveal"><EscrowSecurityShowcase /></div>

      {/* 11. Recruit pros */}
      <div className="reveal"><EarnAsProSection /></div>

      {/* 12. Testimonials */}
      <div className="reveal"><HomeTestimonialsSection testimonials={testimonials} /></div>

      {/* 13. Guides */}
      <div className="reveal"><GuidesSection /></div>

      {/* 14. FAQ */}
      <div className="reveal"><HomeFaqSection faqs={faqs} /></div>

      {/* 15. Closing banner CTA */}
      <div className="reveal"><FingertipsCta /></div>
    </div>
  );
}
