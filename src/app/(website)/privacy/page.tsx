import type { Metadata } from "next";
import { LegalSections, type LegalSection } from "@/components/web-pages/legal-sections";

export const metadata: Metadata = {
  title: "Privacy Policy — Nutsumo Marketplace",
  description:
    "Learn how Nutsumo protects and handles your personal data, biometric verification records, and transaction security under Ghanaian privacy regulations.",
};

const sections: LegalSection[] = [
  {
    title: "1. Information We Collect",
    body: "Nutsumo collects information necessary to facilitate safe marketplace transactions, including user names, email addresses, phone numbers, project addresses, job photographs, and Ghana Card verification records submitted during artisan screening.",
    note: "Data Minimization: We collect only the information required to verify identity, match artisans, and secure escrow contracts.",
  },
  {
    title: "2. How We Use and Protect Your Data",
    body: "Your information is used solely to coordinate service requests, audit artisan credentials, process escrow payments, notify you of project updates, and resolve disputes. We implement SSL/TLS encryption and strict database access controls.",
    note: "Zero Spam Commitment: Your personal contact number is never sold or shared with third-party telemarketing networks.",
  },
  {
    title: "3. Identity Verification & Biometric Auditing",
    body: "Artisan Ghana Card numbers and biometric details are processed through encrypted identity verification partners. Nutsumo stores only audit confirmation status and compliance records, not raw sensitive biometric hashes.",
    note: "Screening Security: All identity audit data is strictly restricted to certified compliance officers.",
  },
  {
    title: "4. Escrow & Financial Data Handling",
    body: "Financial transactions, card authorizations, and Mobile Money transfers are securely processed through PCI-DSS compliant payment gateways (Stripe, Paystack / Hubtel). Nutsumo never stores full debit card numbers or bank PINs on our servers.",
    note: "Financial Safeguard: Escrow balances are isolated in segregated bank accounts until milestone release.",
  },
  {
    title: "5. Information Sharing Between Parties",
    body: "When a client requests a quote or accepts an offer, the relevant project address and contact details are shared only with the selected artisan to enable site visits and service delivery. Artisans are prohibited from retaining client data for purposes outside the contracted job.",
    note: "Project Isolation: Your project address is never broadcast publicly across the internet.",
  },
  {
    title: "6. Your Privacy Rights",
    body: "Under the Data Protection Act, 2012 (Act 843) of Ghana, you have the right to request access to your data, demand correction of inaccurate records, or request account and profile deletion at any time by contacting support@nutsumo.com.",
    note: "Full Control: You can request immediate data export or permanent account removal via our support desk.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen pb-24">
      <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50/50 py-16 sm:py-20 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-primary font-display">
            Privacy & Trust
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-title tracking-tight">
            Nutsumo Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-muted max-w-2xl mx-auto">
            How we protect, encrypt, and manage personal data and financial information for clients and artisans across Ghana.
          </p>
        </div>
      </section>

      <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <LegalSections sections={sections} />
      </section>
    </div>
  );
}
