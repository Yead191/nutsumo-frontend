import type { Metadata } from "next";
import { LegalSections, type LegalSection } from "@/components/web-pages/legal-sections";

export const metadata: Metadata = {
  title: "Terms & Conditions — Nutsumo Marketplace",
  description:
    "Review our Terms of Service governing client quote requests, verified artisan contracts, escrow payment policies, and statutory compliance in Ghana.",
};

const sections: LegalSection[] = [
  {
    title: "1. The Nutsumo Marketplace Role",
    body: "Nutsumo provides a verified online platform connecting clients (homeowners, property developers, and businesses) with independent, vetted skilled artisans and contractors. Nutsumo facilitates discovery, direct custom quote submissions, identity auditing, and secure escrow payment mediation under Ghanaian law.",
    note: "Nutsumo provides the trust and escrow framework. Independent trade artisans perform the work according to agreed-upon scopes and milestones.",
  },
  {
    title: "2. 100% Escrow Financial Protection",
    body: "All project bookings on Nutsumo are mediated through our secure Escrow Payment System. Clients fund escrow upon quotation acceptance. Funds remain locked in escrow until the client reviews the completed work and triggers a milestone release or final sign-off.",
    note: "Escrow Protection Guarantee: Artisans do not receive client payout until work is signed off. Direct off-platform cash transactions void all escrow warranties.",
  },
  {
    title: "3. Direct Custom Quotations & Statutory Deductions",
    body: "Artisans submit transparent quotations specifying proposed labor, materials, and timeframes. In compliance with Ghanaian fiscal statutory regulations, all completed orders incorporate a 20% statutory and platform breakdown (15% Ghana VAT, 2.5% NHIL, and 2.5% GETFund). Artisans receive 80% net take-home earnings.",
    note: "Statutory Transparency: Both client and artisan receive a fully itemized receipt detailing statutory levies upon payment completion.",
  },
  {
    title: "4. Artisan Auditing & Biometric Verification",
    body: "All participating artisans must pass biometric verification against the National Ghana Card registry, criminal background audits, and practical trade skill reviews before earning the 'Verified Pro' badge.",
    note: "Identity Integrity: Nutsumo strictly prohibits account sharing or substituting unvetted personnel on client job sites.",
  },
  {
    title: "5. Dispute Resolution & Customer Protection",
    body: "In the event of incomplete or substandard workmanship, clients or artisans may escalate the matter to the Nutsumo Dispute Desk prior to funds release. Our arbitration officers examine submitted milestones, photos, and project communication to issue binding resolutions, rework orders, or full escrow refunds.",
    note: "Zero Risk Policy: If an artisan abandons a project or fails to meet the agreed scope, client escrow funds are refunded in full.",
  },
  {
    title: "6. Platform Code of Conduct",
    body: "Users agree to maintain professional communication, honor agreed project dates, and provide accurate job specifications. Circumventing escrow to conduct cash deals off-platform results in immediate permanent account termination.",
    note: "Community Safety: Maintaining off-platform deals deprives you of escrow protection and violates our service terms.",
  },
];

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen pb-24">
      <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50/50 py-16 sm:py-20 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-primary font-display">
            Legal & Compliance
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-title tracking-tight">
            Terms & Conditions of Service
          </h1>
          <p className="text-sm sm:text-base text-muted max-w-2xl mx-auto">
            Operating standards, escrow warranties, and responsibilities governing clients and artisans on Nutsumo.
          </p>
        </div>
      </section>

      <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <LegalSections sections={sections} />
      </section>
    </div>
  );
}
