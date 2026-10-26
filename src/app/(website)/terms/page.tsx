import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/page-banner";
import { LegalSections, type LegalSection } from "@/components/web-pages/legal-sections";
import { photos } from "@/lib/media";

export const metadata: Metadata = {
  title: "Terms & Conditions — LocalHomeFix",
  description: "Review our Terms of Service governing homeowner requests, contractor agreements, and marketplace policies.",
};

const sections: LegalSection[] = [
  {
    title: "Marketplace role",
    body: "LocalHomeFix provides a marketplace where homeowners describe projects and independent professionals offer services. It is not the employer, contractor, agent, or insurer of either party.",
    note: "LocalHomeFix is an independent marketplace connecting homeowners with local pros. Contracts and warranties are agreed upon directly between homeowner and contractor.",
  },
  {
    title: "Accounts",
    body: "Provide accurate information and use the service only for lawful purposes. Provider claims are not verified until LocalHomeFix confirms them.",
    note: "All users must provide genuine contact details. Misrepresentation or fraudulent claims will result in immediate account suspension.",
  },
  {
    title: "Projects, quotes, and payment",
    body: "Homeowners review terms and select a provider. Professionals own their quotes, permits, taxes, and workmanship. LocalHomeFix does not process project payments.",
    note: "Zero Middleman Markup: Homeowners pay contractors directly via cash, card, or check. LocalHomeFix never holds customer funds or adds payment processing surcharges.",
  },
  {
    title: "Background screening",
    body: "Provider participation may require a Checkr hosted screening. Do not send SSN, date of birth, government ID, or report contents to LocalHomeFix.",
    note: "Screening Security: All identity and background screening records are encrypted and hosted directly by Checkr. Never send sensitive identity numbers via message.",
  },
  {
    title: "Acceptable use",
    body: "Do not misuse personal information, evade marketplace rules, impersonate others, or submit deceptive content.",
    note: "We enforce zero tolerance for harassment, contact scraping, or deceptive bidding practices.",
  },
  {
    title: "Changes",
    body: "Material changes are posted with a new effective date. Questions go through the Contact page.",
    note: "Substantial updates are timestamped and communicated on this page. Direct inquiries to our customer support team.",
  },
];

export default function TermsPage() {
  return (
    <>
      <PageBanner
        title="Terms & Conditions"
        description="Rules and service standards for homeowners and independent trade professionals."
        image={photos.banners.legal}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Terms & Conditions" },
        ]}
      />
      <LegalSections
        documentType="terms"
        effectiveDate="October 20, 2026"
        version="2.1"
        sections={sections}
      />
    </>
  );
}
