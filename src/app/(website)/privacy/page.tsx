import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/page-banner";
import { LegalSections, type LegalSection } from "@/components/web-pages/legal-sections";
import { photos } from "@/lib/media";

export const metadata: Metadata = {
  title: "Privacy Policy — LocalHomeFix",
  description: "Learn how LocalHomeFix protects and handles user data, screening records, and marketplace activity.",
};

const sections: LegalSection[] = [
  {
    title: "Information we collect",
    body: "Account details, requests, quotes, messages, reviews, provider credentials, optional location, and device or security data.",
    note: "Data collected is solely utilized to connect you with verified pros, maintain account security, and deliver quotes. We do not engage in ad tracking.",
  },
  {
    title: "How we use it",
    body: "To operate accounts and projects, match homeowners and providers, prevent fraud, and verify eligibility.",
    note: "Zero Spam Policy: Your personal phone number is never sold or distributed to third-party telemarketing call centers.",
  },
  {
    title: "Screening",
    body: "Checkr collects screening identifiers on its own site. LocalHomeFix keeps normalized state and audit records, not report contents.",
    note: "Screening Isolation: Checkr processes sensitive identifiers (SSN, government ID) on their own certified, encrypted infrastructure.",
  },
  {
    title: "Sharing",
    body: "We share information as needed with the other party on a project, payment and identity vendors, and authorities when required. Personal information is not sold.",
    note: "Privacy Guarantee: We never sell or rent homeowner or contractor personal information to data brokers or advertising networks.",
  },
  {
    title: "Your choices",
    body: "Update account information, control optional location access, and request access or deletion where applicable.",
    note: "You have the right to inspect, update, or permanently delete your account data anytime via our support desk.",
  },
  {
    title: "Children",
    body: "The service is not directed to children under 18.",
    note: "LocalHomeFix is restricted to homeowners, property managers, and independent trade contractors age 18 and older.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageBanner
        title="Privacy Policy"
        description="How LocalHomeFix protects and manages your personal data and privacy."
        image={photos.banners.legal}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy" },
        ]}
      />
      <LegalSections
        documentType="privacy"
        effectiveDate="October 20, 2026"
        version="2.1"
        sections={sections}
      />
    </>
  );
}
