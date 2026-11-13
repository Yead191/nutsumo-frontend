import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  Sparkles,
  Users,
  Award,
  ArrowRight,
  Zap,
  TrendingUp,
  HeartHandshake,
  Layers,
  Clock,
} from "lucide-react";

export function AboutContent() {
  const pillars = [
    {
      icon: Lock,
      title: "100% Escrow Protection",
      description:
        "Every pesewa you deposit is securely held in platform escrow. The artisan only receives payout once you personally inspect and approve the completed job.",
      bg: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      icon: ShieldCheck,
      title: "Biometrically Audited Pros",
      description:
        "Every tradesperson on Nutsumo completes Ghana Card biometric verification, criminal background auditing, and practical trade skill assessments.",
      bg: "bg-primary/5 text-primary border-primary/10",
    },
    {
      icon: TrendingUp,
      title: "Statutory Tax Compliance",
      description:
        "We build formal trust in Ghana's skilled trades with transparent 20% statutory deductions (15% VAT, 2.5% NHIL, 2.5% GETFund), protecting both client and artisan.",
      bg: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      icon: HeartHandshake,
      title: "Fair Artisan Economics",
      description:
        "No predatory bidding wars, no charging craftsmen for dead leads. Independent Ghanaian artisans keep 80% net take-home earnings with fast payouts.",
      bg: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
  ];

  const metrics = [
    { value: "500+", label: "Vetted Ghanaian Artisans" },
    { value: "GH₵ 2.4M+", label: "Escrow Protected Payouts" },
    { value: "99.4%", label: "Client Satisfaction Rate" },
    { value: "< 25 Mins", label: "Average Quote Turnaround" },
  ];

  return (
    <div className="bg-white min-h-screen pb-24 ">
      {/* 1. HERO SECTION */}
      <section
        id="hero"
        className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 py-16 sm:py-24 border-b border-slate-200 "
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Transforming Ghana's Home Services</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-title tracking-tight leading-tight">
              Building Absolute Trust in Every Home Repair & Construction
              Project
            </h1>

            <p className="text-base sm:text-lg text-copy leading-relaxed font-sans max-w-2xl mx-auto">
              Nutsumo is Ghana's first escrow-backed digital marketplace
              connecting households and businesses directly with vetted, master
              craftsmen—eliminating contractor ghosting, unsafe cash deals, and
              surprise costs.
            </p>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                href="/browse-pros"
                className="inline-flex items-center gap-2 rounded-2xl bg-primary hover:bg-primary-hover text-white px-7 py-3.5 text-sm font-bold shadow-md hover:shadow-lg transition-all"
              >
                <span>Browse Verified Pros</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/pro-register"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-title px-7 py-3.5 text-sm font-bold shadow-2xs transition-colors"
              >
                <span>Join as an Artisan</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE IMPACT METRICS */}
      <section className="py-12 border-b border-slate-200 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {metrics.map((m, idx) => (
              <div key={idx} className="space-y-1">
                <div className="font-display text-3xl sm:text-4xl font-black text-title">
                  {m.value}
                </div>
                <div className="text-xs sm:text-sm font-medium text-muted">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. THE PROBLEM VS THE NUTSUMO SOLUTION */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary font-display">
              Why We Built Nutsumo
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-title tracking-tight">
              Eliminating the Friction of Informal Service Hiring
            </h2>
            <p className="text-sm sm:text-base text-copy leading-relaxed">
              Finding a reliable electrician, plumber, or mason in Accra has
              historically depended on random word-of-mouth recommendations,
              unverified workers, and risky advance cash payments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* The Old Way */}
            <div className="rounded-3xl border border-rose-200 bg-rose-50/40 p-8 space-y-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1">
                The Informal Roadblock
              </span>
              <h3 className="font-display text-xl font-bold text-slate-900">
                Traditional Unprotected Hiring
              </h3>
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>
                    <strong>Full Advance Cash Required:</strong> You pay cash
                    upfront, but the artisan delays or never shows up.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>
                    <strong>Zero Recourse for Subpar Work:</strong> When pipes
                    burst or wiring fails hours later, phone numbers go
                    unanswered.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>
                    <strong>Unvetted Strangers in Your Home:</strong> No
                    identity checks, no police clearance, and no safety audit.
                  </span>
                </li>
              </ul>
            </div>

            {/* The Nutsumo Way */}
            <div className="rounded-3xl border border-emerald-300 bg-emerald-50/40 p-8 space-y-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1">
                The Nutsumo Standard
              </span>
              <h3 className="font-display text-xl font-bold text-slate-900">
                100% Escrow & Verified Professionals
              </h3>
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>
                    <strong>Escrow Financial Security:</strong> Funds are locked
                    safely in escrow and released only when you click 'Approve'.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>
                    <strong>Biometric Ghana Card Auditing:</strong> Every
                    artisan's identity, national ID, and track record are
                    vetted.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>
                    <strong>Dedicated Dispute Resolution:</strong> If work is
                    incomplete, our Accra customer desk steps in with guaranteed
                    refunds.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOUR CORE PILLARS */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl mx-auto text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary font-display">
              Our Core Principles
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-title">
              Built on Transparency, Safety & Craftsmanship
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={i}
                  className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div
                      className={`grid h-12 w-12 place-items-center rounded-2xl border ${pillar.bg}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-base font-bold text-title">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-copy leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-title text-white p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 h-48 w-48 rounded-full bg-primary/20 blur-2xl" />
            <div className="relative space-y-3 max-w-xl mx-auto">
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                Ready to Experience Stress-Free Home Repairs?
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                Browse verified local craftsmen in Accra, request a custom
                quote, and hire with 100% escrow protection today.
              </p>
            </div>

            <div className="relative flex flex-wrap justify-center gap-4 pt-2">
              <Link
                href="/browse-pros"
                className="inline-flex items-center gap-2 rounded-full bg-primary hover:bg-primary-hover text-white px-8 py-3.5 text-xs sm:text-sm font-bold shadow-md transition-all"
              >
                <span>Find an Artisan Now</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/pro-register"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white px-8 py-3.5 text-xs sm:text-sm font-bold transition-colors"
              >
                <span>Join as an Artisan</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
