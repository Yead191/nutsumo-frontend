"use client";

import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { photos } from "@/lib/media";
import { useAppSelector } from "@/redux/hooks";
import { postJobHref } from "@/lib/role-access";

export function HomeCta() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <section className="bg-white py-[var(--section-sm)] md:py-[var(--section)]">
      <div className="container-site">
        <div className="relative overflow-hidden rounded-[32px] bg-title px-6 py-10 text-center text-white shadow-xl sm:px-10 md:py-14">
          {/* Subtle background image & wash */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${photos.cta})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#020b1e] via-[#051336]/95 to-[#0d2870]/90" />

          <div className="relative z-10 mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-medium text-white backdrop-blur-md">
              <Clock className="h-3.5 w-3.5 text-blue-300" />
              Post your job in under 2 minutes
            </span>

            <h2 className="mt-5 font-display text-[26px] font-medium leading-[1.15] tracking-[-0.04em] text-white sm:text-[34px] md:text-[40px]">
              Ready to find a trusted pro without the middleman markup?
            </h2>

            <p className="mt-3 font-sans text-sm sm:text-base leading-relaxed text-white/80">
              Post your repair for free, compare itemized quotes from vetted local contractors, and pay only when the job is done right.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button href={postJobHref(user)} variant="white" size="lg" className="font-semibold">
                Post your request free ↗
              </Button>
              <Button href="/browse-pros" variant="onDark" size="lg" className="font-semibold">
                Browse local pros ↗
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}