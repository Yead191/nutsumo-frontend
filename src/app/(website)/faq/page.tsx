import { PageBanner } from "@/components/layout/page-banner";
import { FaqSection } from "@/components/web-pages/faq-section";
import { photos } from "@/lib/media";

export default function FaqPage() {
  return (
    <>
      <PageBanner
        eyebrow="Help & FAQ"
        title="Frequently Asked Questions"
        description="Find clear answers to common questions about booking, quoting, payments, and contractor verification."
        image={photos.banners.how}
      />
      <FaqSection
        title="Common questions"
        description="See how to post a request, compare quotes, and pay your pro. Ask us if something is still unclear."
        className="bg-white"
      />
    </>
  );
}
