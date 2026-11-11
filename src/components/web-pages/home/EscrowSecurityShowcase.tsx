import {
  Lock,
  ShieldCheck,
  Check,
  X,
  AlertTriangle,
  Receipt,
  Scale,
  Sparkles,
} from "lucide-react";

export function EscrowSecurityShowcase() {
  const comparison = [
    {
      feature: "Payment Timing",
      traditional:
        "Pay cash upfront before work begins; risk contractor ghosting",
      nutsumo:
        "Deposit held in secure Stripe Escrow; released only upon completion",
    },
    {
      feature: "Workmanship Guarantee",
      traditional: "No recourse if work is substandard or incomplete",
      nutsumo:
        "Inspect first; request free revisions or escalate to dispute desk",
    },
    {
      feature: "Pricing Transparency",
      traditional: "Hidden surprise markups and arbitrary middleman fees",
      nutsumo:
        "20% statutory deductions (VAT 15%, NHIL 2.5%, GETFund 2.5%) itemized",
    },
    {
      feature: "Identity & Trust",
      traditional: "Unverified numbers from classified ads with fake reviews",
      nutsumo:
        "Identity-verified craftsmen with authentic client job histories",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-primary block font-display">
            The Escrow Difference
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-title tracking-tight">
            Why Hiring with Nutsumo is Safer
          </h2>
          <p className="text-sm sm:text-base text-copy font-sans">
            Compare the risks of informal classifieds against Nutsumo&apos;s
            guaranteed milestone protection.
          </p>
        </div>

        {/* Comparison Table / Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
          {/* Traditional Hiring Card (Red/Gray Alert) */}
          <div className="rounded-3xl border border-rose-200/80 bg-rose-50/30 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-rose-200/60">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-100 text-rose-600">
                <AlertTriangle className="h-6 w-6 stroke-[2]" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-title">
                  Informal Hiring / Classifieds
                </h3>
                <p className="text-xs text-rose-700 font-medium">
                  High Risk &amp; Zero Protection
                </p>
              </div>
            </div>

            <ul className="space-y-4 text-xs sm:text-sm text-copy">
              {comparison.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="grid h-5 w-5 place-items-center rounded-full bg-rose-200/70 text-rose-700 shrink-0 mt-0.5">
                    <X className="h-3 w-3 stroke-[3]" />
                  </div>
                  <div>
                    <strong className="block font-semibold text-title">
                      {item.feature}:
                    </strong>
                    <span className="text-slate-600 leading-relaxed">
                      {item.traditional}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Nutsumo Protected Card (Emerald/Primary) */}
          <div className="rounded-3xl border-2 border-primary/30 bg-primary/5 p-6 sm:p-8 space-y-6 shadow-md relative overflow-hidden">
            {/* Corner Badge */}
            <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
              Recommended
            </div>

            <div className="flex items-center gap-3 pb-4 border-b border-primary/20">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-white shadow-xs">
                <ShieldCheck className="h-6 w-6 stroke-[2]" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-title">
                  Nutsumo Protected Escrow
                </h3>
                <p className="text-xs text-primary font-bold">
                  100% Escrow Backed &amp; Verified
                </p>
              </div>
            </div>

            <ul className="space-y-4 text-xs sm:text-sm text-copy">
              {comparison.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-white shrink-0 mt-0.5">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <div>
                    <strong className="block font-semibold text-title">
                      {item.feature}:
                    </strong>
                    <span className="text-slate-700 leading-relaxed font-medium">
                      {item.nutsumo}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
