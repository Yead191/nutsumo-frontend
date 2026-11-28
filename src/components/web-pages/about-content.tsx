import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Lock,
  TrendingUp,
  HeartHandshake,
  ArrowRight,
  ArrowUpRight,
  Check,
  X,
  BadgeCheck,
} from "lucide-react";
import { stock } from "@/lib/stock-photos";

const PILLARS = [
  {
    icon: Lock,
    title: "100% Escrow Protection",
    description:
      "Every pesewa you deposit is securely held in platform escrow. The worker only receives payout once you personally review and approve the completed job.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Workers & Professionals",
    description:
      "Everyone offering services on Nutsumo  from tradespeople and technicians to chefs, drivers, nannies, security and office staff  completes Ghana Card identity verification before taking bookings.",
  },
  {
    icon: TrendingUp,
    title: "Statutory Tax Compliance",
    description:
      "A transparent 22.5% deduction (15% VAT, 2.5% NHIL, 2.5% GETFund, and a 2.5% Nutsumo platform fee) brings formal trust to every kind of work in Ghana, protecting both client and worker.",
  },
  {
    icon: HeartHandshake,
    title: "Fair Pay for Every Worker",
    description:
      "No predatory bidding wars, no charging workers for dead leads. Formal and informal professionals keep 77.5% net take-home earnings, then withdraw from their Nutsumo balance.",
  },
];

const METRICS = [
  { value: "500+", label: "Verified workers & professionals" },
  { value: "GH₵ 2.4M+", label: "Escrow-protected payouts" },
  { value: "99.4%", label: "Client satisfaction rate" },
  { value: "< 25 mins", label: "Average quote turnaround" },
];

const OLD_WAY = [
  { title: "Full advance cash required", text: "You pay cash upfront, but the worker delays or never shows up." },
  { title: "Zero recourse for subpar work", text: "When the job is left unfinished or done poorly, phone numbers go unanswered." },
  { title: "Unvetted strangers", text: "No identity checks, no reviews and no track record to rely on." },
];

const NUTSUMO_WAY = [
  { title: "Escrow financial security", text: "Funds are locked safely in escrow and released only when you click ‘Approve’." },
  { title: "Ghana Card identity checks", text: "Every worker's identity, national ID and track record are vetted." },
  { title: "Dedicated dispute resolution", text: "If work is incomplete, our Accra customer desk steps in with guaranteed refunds." },
];

const TALENT = [
  { label: "Tradespeople & technicians", q: "Technician", image: stock.electrician },
  { label: "Chefs & cooks", q: "Chef", image: stock.chef },
  { label: "Drivers", q: "Driver", image: stock.rideDriver },
  { label: "Nannies & caregivers", q: "Nanny", image: stock.family },
  { label: "Cleaning & domestic", q: "Cleaning", image: stock.cleaner },
  { label: "Office & admin", q: "Office", image: stock.womenMeeting },
  { label: "Creative & design", q: "Design", image: stock.designTools },
  { label: "Tech & software", q: "Software", image: stock.techTeam },
];

export function AboutContent() {
  return (
    <div className="bg-white min-h-screen">
      {/* 1. Hero: copy + photo collage */}
      <section className="relative overflow-hidden pt-28 pb-20 sm:pt-32 sm:pb-28 lg:pb-32">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
              About Nutsumo
            </p>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-[58px] lg:leading-[1.05] font-semibold text-title">
              A marketplace for every skill, every worker and{" "}
              <span className="text-primary">every job</span>
            </h1>
            <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-copy">
              Nutsumo is an escrow-backed marketplace connecting clients with all
              types of skilled workers and professionals  tradespeople, chefs,
              drivers, nannies, security personnel, office, creative and
              domestic workers. Formal or informal, every worker gets a place to
              showcase their skills and get hired.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/browse-pros"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white hover:bg-primary-hover transition-colors"
              >
                Browse verified pros
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/pro-register"
                className="inline-flex items-center rounded-lg border border-title px-6 py-3 text-base font-semibold text-title hover:bg-title hover:text-white transition-colors"
              >
                Join as a professional
              </Link>
            </div>
          </div>

          <div className="relative grid grid-cols-2 gap-4 sm:gap-5">
            <div className="relative row-span-2 aspect-[3/4] overflow-hidden rounded-3xl self-center">
              <Image src={stock.carpenter} alt="A carpenter measuring timber" fill priority sizes="(min-width: 1024px) 24vw, 45vw" className="object-cover" />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-3xl">
              <Image src={stock.chef} alt="A chef plating food" fill sizes="(min-width: 1024px) 22vw, 45vw" className="object-cover" />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-3xl">
              <Image src={stock.cleaner} alt="A cleaner wiping a window" fill sizes="(min-width: 1024px) 22vw, 45vw" className="object-cover" />
            </div>
            <div className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap rounded-2xl bg-white px-4 py-3 shadow-[0_12px_30px_-10px_rgba(15,23,42,0.35)]">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                <BadgeCheck className="h-5 w-5" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-title">Ghana Card verified</p>
                <p className="text-xs text-copy">Before they take bookings</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Impact metrics */}
      <section className="pb-20 sm:pb-28 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[28px] bg-[#2A0A12] px-6 py-10 sm:px-12 sm:py-12">
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/25 blur-3xl" />
            <dl className="relative grid grid-cols-2 gap-8 lg:grid-cols-4">
              {METRICS.map((metric) => (
                <div key={metric.label} className="flex flex-col-reverse lg:border-l lg:border-white/10 lg:pl-8 first:lg:border-0 first:lg:pl-0">
                  <dt className="mt-1 text-sm text-white/65">{metric.label}</dt>
                  <dd className="whitespace-nowrap font-display text-2xl sm:text-4xl font-semibold text-white">{metric.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* 3. Why we built Nutsumo */}
      <section className="bg-slate-50 py-20 sm:py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
              <Image src={stock.handshake} alt="Two people shaking hands on a deal" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-2 w-[55%] overflow-hidden rounded-2xl border-[6px] border-slate-50 shadow-xl sm:-right-6">
              <div className="relative aspect-[4/3]">
                <Image src={stock.constructionTeam} alt="A team on a construction site" fill sizes="300px" className="object-cover" />
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Why we built Nutsumo</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-[44px] lg:leading-[1.1] font-semibold text-title">
              Taking the risk out of hiring
            </h2>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-copy">
              Finding a reliable driver, nanny, chef, technician or office
              assistant has historically depended on word-of-mouth, unverified
              strangers and risky advance cash payments  while talented
              workers, especially in informal jobs, had no place to showcase
              their skills.
            </p>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-copy">The old way</p>
                <ul className="mt-4 space-y-4">
                  {OLD_WAY.map((item) => (
                    <li key={item.title} className="flex gap-3">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500">
                        <X className="h-3 w-3" strokeWidth={3} />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-title">{item.title}</p>
                        <p className="mt-0.5 text-sm text-copy">{item.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-white p-6 ring-2 ring-primary/30 shadow-[0_12px_30px_-18px_rgba(254,55,93,0.6)]">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">The Nutsumo way</p>
                <ul className="mt-4 space-y-4">
                  {NUTSUMO_WAY.map((item) => (
                    <li key={item.title} className="flex gap-3">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-white">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-title">{item.title}</p>
                        <p className="mt-0.5 text-sm text-copy">{item.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core principles */}
      <section className="py-20 sm:py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Our core principles</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold text-title">
              Built on transparency, safety and opportunity
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map(({ icon: Icon, title, description }) => (
              <div key={title} className="group rounded-3xl bg-white p-7 ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(15,23,42,0.35)]">
                <span className="grid h-12 w-12 place-items-center rounded-xl border-2 border-title text-title transition-colors group-hover:border-primary group-hover:text-primary">
                  <Icon className="h-6 w-6" strokeWidth={1.8} />
                </span>
                <h3 className="mt-6 font-display text-lg font-semibold text-title">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-copy">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Every kind of work */}
      <section className="pb-20 sm:pb-28 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="max-w-2xl font-display text-3xl sm:text-4xl font-semibold text-title">
              Every kind of work has a place here
            </h2>
            <Link href="/browse-pros" className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-title underline-offset-4 hover:underline">
              Explore all pros <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {TALENT.map((item) => (
              <Link key={item.label} href={`/browse-pros?q=${encodeURIComponent(item.q)}`} className="group relative block overflow-hidden rounded-2xl">
                <div className="relative aspect-[4/5]">
                  <Image src={item.image} alt={item.label} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/0 to-black/0" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
                    <span className="text-sm font-semibold text-white sm:text-base">{item.label}</span>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-title opacity-0 transition-opacity group-hover:opacity-100">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA band */}
      <section className="pb-20 sm:pb-28 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-[#4A0D1E] px-6 py-12 sm:px-14 sm:py-16 lg:py-20">
            <div className="absolute inset-y-0 right-0 hidden w-1/2 md:block">
              <Image src={stock.officeHighFive} alt="" fill sizes="50vw" className="object-cover" />
              <div className="absolute inset-0 bg-linear-to-r from-[#4A0D1E] via-[#4A0D1E]/40 to-transparent" />
            </div>
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
            <div className="relative max-w-lg">
              <h2 className="font-display text-4xl sm:text-5xl font-semibold leading-tight text-white!">
                Ready to hire  or <span className="text-primary">get hired?</span>
              </h2>
              <p className="mt-4 text-base sm:text-lg text-white/75">
                Browse verified workers and professionals for any job, request a
                custom quote, and hire with 100% escrow protection today.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/browse-pros" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white hover:bg-primary-hover transition-colors">
                  Find a professional
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/pro-register" className="inline-flex items-center rounded-lg border border-white/50 px-6 py-3 text-base font-semibold text-white! hover:bg-white/10 transition-colors">
                  Join as a professional
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
