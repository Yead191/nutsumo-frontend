import {
  Search,
  FileText,
  Lock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export function DiscoveryFunnelSteps() {
  const steps = [
    {
      step: "01",
      icon: Search,
      title: "Discover Verified Pros",
      description:
        "Search through curated categories or compare top-rated craftsmen by customer reviews, trade licenses, and real portfolio photos.",
      highlight: "Pre-screened & Vetted",
    },
    {
      step: "02",
      icon: FileText,
      title: "Request Custom Quotes",
      description:
        "Describe your project and receive proposals with the full fee breakdown: VAT 15%, NHIL 2.5%, GETFund 2.5%, and a 2.5% platform fee.",
      highlight: "0% Hidden Fees",
    },
    {
      step: "03",
      icon: Lock,
      title: "Fund Secure Escrow",
      description:
        "Accept the quotation and fund escrow through Stripe. The artisan begins work immediately, but funds remain locked in neutral platform escrow.",
      highlight: "100% Protected Deposit",
    },
    {
      step: "04",
      icon: CheckCircle2,
      title: "Inspect & Release Payout",
      description:
        "Inspect the completed work. When you confirm, Nutsumo can release the artisan's 77.5% net into their balance.",
      highlight: "Guaranteed Satisfaction",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-50/60 border-b border-slate-200/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-primary block font-display">
            How It Works
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-title tracking-tight">
            The Safe Way to Hire Local Trade Pros
          </h2>
          <p className="text-sm sm:text-base text-copy font-sans">
            Our 4-step escrow-backed workflow protects homeowners from
            unfinished jobs and guarantees fair, timely payouts for hardworking
            craftsmen.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative rounded-3xl bg-white p-6 sm:p-7 border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-display text-3xl font-black text-slate-200 group-hover:text-primary transition-colors">
                      {item.step}
                    </span>
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-6 w-6 stroke-[2]" />
                    </div>
                  </div>

                  <span className="inline-block text-[11px] font-bold text-primary bg-primary/5 px-2.5 py-0.5 rounded-full border border-primary/10 mb-2">
                    {item.highlight}
                  </span>

                  <h3 className="font-display text-lg font-bold text-title">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-copy leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                  <span>Step {idx + 1} of 4</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Action Strip */}
        <div className="mt-12 text-center">
          <Link
            href="/browse-pros"
            className="inline-flex items-center gap-2 rounded-full bg-primary hover:bg-primary-hover text-white px-8 py-3.5 text-sm font-bold shadow-md transition-all active:scale-[0.99]"
          >
            <span>Start Hiring with Escrow Protection</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
