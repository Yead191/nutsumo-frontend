import {
  ShieldCheck,
  Lock,
  Scale,
  Sparkles,
  Receipt,
  CheckCircle2,
} from "lucide-react";

export function TrustGuaranteeStrip() {
  const pillars = [
    {
      icon: Lock,
      badge: "Escrow Protection",
      title: "100% Escrow Milestone Safety",
      description:
        "Your deposit is held safely in escrow. The artisan begins work immediately, but funds are released only after you inspect and approve completion.",
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      icon: ShieldCheck,
      badge: "Identity Screening",
      title: "Verified Craftsmen & Trade Credentials",
      description:
        "Every artisan undergoes identity and credential screening. Browse verified customer ratings, completed job histories, and certified portfolios.",
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      icon: Receipt,
      badge: "Ghana Tax Compliant",
      title: "Transparent 20% Statutory Deductions",
      description:
        "Transparent line-item breakdowns on every quote: VAT 15%, NHIL 2.5%, GETFund 2.5%. No hidden surcharges, middleman markups, or surprises.",
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
      icon: Scale,
      badge: "Dispute Assurance",
      title: "Milestone Revisions & Resolution Desk",
      description:
        "Not 100% satisfied with the delivered work? Request revisions directly or escalate to our neutral dispute resolution team before releasing payment.",
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-primary block font-display">
            Why Nutsumo
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-title tracking-tight">
            Built for Trust, Security &amp; Fair Compensation
          </h2>
          <p className="text-sm sm:text-base text-copy font-sans">
            We eliminated predatory middleman fees and shady unverified
            contractors. Experience direct hiring backed by guaranteed escrow
            protection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl bg-white p-6 sm:p-7 border border-slate-200 shadow-2xs hover:shadow-md transition-shadow duration-200 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`inline-grid h-12 w-12 place-items-center rounded-2xl border mb-3 ${item.color}`}
                  >
                    <Icon className="h-6 w-6 stroke-[2]" />
                  </div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1 font-display">
                    {item.badge}
                  </span>
                  <h3 className="font-display text-lg font-bold text-title">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-copy leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <span>Guaranteed on every booking</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
