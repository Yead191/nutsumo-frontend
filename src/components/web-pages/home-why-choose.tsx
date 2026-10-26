"use client";

import Image from "next/image";

const stats = [
  {
    value: "$0",
    label: "Extra Platform Charges",
    desc: "Pay only for the agreed repair work — zero middleman markup",
  },
  {
    value: "100%",
    label: "Direct to Pro",
    desc: "Full repair payment goes directly to your technician",
  },
  {
    value: "0",
    label: "Spam Calls",
    desc: "Your phone number stays strictly private",
  },
];

export function HomeWhyChoose() {
  return (
    <section className="bg-white py-[var(--section-sm)] md:py-[var(--section)] border-t border-line/60">
      <div className="container-site">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 items-start">
          {/* ============================================================ */}
          {/* LEFT COLUMN: Eyebrow + Headline + Big Hero Photo             */}
          {/* ============================================================ */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Eyebrow with blue ring indicator */}
              <div className="inline-flex items-center gap-2 font-geist text-[13.5px] sm:text-[14px] font-medium tracking-tight text-title">
                <span
                  aria-hidden="true"
                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-full border-[1.75px] border-primary"
                />
                <span>Why Choose LocalHomeFix</span>
              </div>

              {/* Headline */}
              <h2 className="mt-4 font-display text-[32px] sm:text-[40px] md:text-[46px] font-medium leading-[1.12] tracking-[-0.035em] text-title">
                Trusted Expertise. Reliable Results. Every Time.
              </h2>
            </div>

            {/* Large primary photo */}
            <div className="mt-7 sm:mt-9 relative h-[320px] sm:h-[400px] w-full overflow-hidden rounded-[24px] sm:rounded-[28px] border border-line/70 shadow-sm group">
              <Image
                src="/images/why-choose/pro-craftsman.jpg"
                alt="Professional residential carpenter installing custom cabinetry"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN: 2 Photos + Quote w/ Accent Bar + 3 True Stats  */}
          {/* ============================================================ */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full pt-1 sm:pt-2">
            {/* 2 Side-by-side photos */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="relative h-[180px] sm:h-[240px] overflow-hidden rounded-[20px] sm:rounded-[24px] border border-line/70 shadow-sm group">
                <Image
                  src="/images/why-choose/pro-painter.jpg"
                  alt="Professional painter applying precision interior paint"
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="relative h-[180px] sm:h-[240px] overflow-hidden rounded-[20px] sm:rounded-[24px] border border-line/70 shadow-sm group">
                <Image
                  src="/images/why-choose/pro-plumber.jpg"
                  alt="Licensed plumbing technician installing kitchen sink fixtures"
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Description with brand vertical blue accent bar */}
            <div className="mt-7 sm:mt-8 border-l-2 border-primary pl-4 sm:pl-5 py-1">
              <p className="font-sans text-[15px] sm:text-[16px] leading-[1.65] text-[#555]">
                Direct home repairs delivered with verified local technicians, clear itemized quotes,
                and a commitment to honest pricing, privacy, and long-term customer peace of mind.
              </p>
            </div>

            {/* 3 Genuine, non-fake platform metrics */}
            <div className="mt-8 sm:mt-10 grid grid-cols-3 gap-3 sm:gap-6 border-t border-line/70 pt-6 sm:pt-8">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <p className="font-display text-[28px] sm:text-[36px] md:text-[42px] font-bold leading-none tracking-tight text-title">
                    {stat.value}
                  </p>
                  <p className="mt-2 font-display text-[13px] sm:text-[14px] font-semibold text-title leading-snug">
                    {stat.label}
                  </p>
                  <p className="mt-1 font-sans text-[11px] sm:text-xs text-[#757575] leading-normal hidden sm:block">
                    {stat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}