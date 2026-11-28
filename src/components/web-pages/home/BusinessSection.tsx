import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import { stock } from "@/lib/stock-photos";

const BENEFITS = [
  "Hire for offices, estates, shops and rental properties in one place",
  "Compare several quotes side by side before you commit",
  "Every payment protected by escrow, released on your approval",
  "Re-book the pros you trust for repeat and ongoing work",
];

/** Dark brand section aimed at businesses and property managers. */
export function BusinessSection() {
  return (
    <section className="bg-white py-20 sm:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative grid overflow-hidden rounded-[28px] bg-[#2A0A12] lg:grid-cols-2">
          <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary/25 blur-3xl" />

          <div className="relative px-6 py-12 sm:px-12 sm:py-16 lg:py-20">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
              Nutsumo for business
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-[44px] lg:leading-[1.1] font-semibold text-white!">
              Running a business? <br className="hidden sm:block" />
              <span className="text-primary">We&apos;ve got your back.</span>
            </h2>
            <p className="mt-4 max-w-md text-base sm:text-lg text-white/70">
              Keep your premises, people and projects moving with verified
              tradespeople, office support and creative talent.
            </p>
            <ul className="mt-8 space-y-4">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex gap-3 text-[15px] text-white/90">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary">
                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/account/post-job"
                className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white hover:bg-primary-hover transition-colors"
              >
                Post a business job
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-lg border border-white/40 px-6 py-3 text-base font-semibold text-white! hover:bg-white/10 transition-colors"
              >
                Talk to our team
              </Link>
            </div>
          </div>

          <div className="relative min-h-[320px] lg:min-h-full">
            <Image
              src={stock.officeHighFive}
              alt="Colleagues celebrating a finished project"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#2A0A12]/60 to-transparent lg:bg-linear-to-r lg:from-[#2A0A12] lg:via-[#2A0A12]/10" />
            <div className="absolute bottom-6 right-6 left-6 sm:left-auto sm:w-72 rounded-2xl bg-white p-4 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="relative h-11 w-11 overflow-hidden rounded-full">
                  <Image src={stock.portraitWomanGlasses} alt="" fill sizes="44px" className="object-cover" />
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-title">Quote accepted</p>
                  <p className="text-xs text-copy">Office deep clean · Funds in escrow</p>
                </div>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-2/3 rounded-full bg-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
