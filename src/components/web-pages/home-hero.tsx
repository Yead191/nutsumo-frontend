"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Search, MapPin, ArrowRight } from "lucide-react";

export function HomeHero() {
  const [searchNeed, setSearchNeed] = useState("");
  const [postcode, setPostcode] = useState("");

  const searchHref =
    "/browse-pros?q=" +
    encodeURIComponent(searchNeed) +
    "&location=" +
    encodeURIComponent(postcode);

  return (
    <section
      id="hero"
      className="relative mx-auto  px-3 sm:px-6 lg:px-8 pt-2 sm:pt-4"
    >
      <div className="relative min-h-[95vh] w-full overflow-hidden rounded-[28px] sm:rounded-[36px] bg-slate-950 shadow-2xl">
        <Image
          src="/images/home/hero-bg.png"
          alt="Trust is earned through good work - Nutsumo"
          fill
          priority
          className="object-cover object-[center_right] select-none"
        />

        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(90deg, rgba(0, 0, 0, 0.78) 0%, rgba(0, 0, 0, 0.52) 48%, rgba(0, 0, 0, 0.15) 75%, transparent 100%)",
          }}
        />

        <div className="relative z-2 flex min-h-[640px] sm:min-h-[720px] lg:min-h-[780px] max-w-7xl mx-auto flex-col justify-center px-6 pt-28 pb-16 sm:px-12 sm:pt-36 sm:pb-20 lg:px-16">
          <div className="max-w-2xl">
            <h1 className="font-display text-[44px] sm:text-[60px] lg:text-[72px] font-bold text-white leading-[1.05] tracking-tight">
              Trust is earned
              <br />
              Through good
              <br />
              work.
            </h1>

            <p className="mt-5 max-w-[500px] text-white/90 text-base sm:text-lg leading-relaxed font-normal">
              Find the right people for your jobs, or discover opportunities to
              put your skills to use.
            </p>

            <div className="mt-8 flex w-full max-w-[580px] flex-col sm:flex-row items-stretch sm:items-center rounded-2xl sm:rounded-full bg-white p-2 shadow-2xl gap-2 sm:gap-0">
              <div className="flex flex-1 items-center gap-3 pl-4 py-2 sm:py-0">
                <Search className="h-5 w-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchNeed}
                  onChange={(e) => setSearchNeed(e.target.value)}
                  placeholder="What do you need?"
                  className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="hidden sm:block h-6 w-px bg-slate-200" />

              <div className="flex flex-1 items-center gap-3 pl-4 py-2 sm:py-0">
                <MapPin className="h-5 w-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  placeholder="Postcode"
                  className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <Link
                href={searchHref}
                className="flex items-center justify-center gap-2 rounded-full bg-[#FE375D] hover:bg-[#e0284e] px-6 py-3 font-semibold text-white shadow-md transition-all shrink-0"
              >
                <span>Sign Up</span>
                <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-[#FE375D]">
                  <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                </span>
              </Link>
            </div>

            <div className="mt-14 sm:mt-18 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8 max-w-[620px]">
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  12k+
                </div>
                <div className="mt-1 text-[11px] font-semibold text-white/75 tracking-wider uppercase">
                  Projects Completed
                </div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  2.4k
                </div>
                <div className="mt-1 text-[11px] font-semibold text-white/75 tracking-wider uppercase">
                  Independent Job Seekerss
                </div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  96%
                </div>
                <div className="mt-1 text-[11px] font-semibold text-white/75 tracking-wider uppercase">
                  Would Book Again
                </div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  48h
                </div>
                <div className="mt-1 text-[11px] font-semibold text-white/75 tracking-wider uppercase">
                  Average First Reply
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
