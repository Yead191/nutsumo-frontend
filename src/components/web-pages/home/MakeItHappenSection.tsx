import Link from "next/link";
import Image from "next/image";
import { LayoutGrid, Zap, Lock, BadgeCheck, ShieldCheck, Star } from "lucide-react";
import { stock } from "@/lib/stock-photos";

const POINTS = [
  {
    icon: LayoutGrid,
    text: "Access a pool of verified talent across trades, home, office and creative work",
  },
  {
    icon: Zap,
    text: "Post a job in minutes and get matched with the right pro fast",
  },
  {
    icon: BadgeCheck,
    text: "See ID checks, real reviews and clear quotes before you hire",
  },
  {
    icon: Lock,
    text: "Pay safely through escrow  funds release only when you approve the work",
  },
];

export function MakeItHappenSection() {
  return (
    <section className="bg-white py-20 sm:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[44px] lg:leading-[1.1] font-semibold text-title max-w-xl">
            Make it all happen with <span className="text-primary">verified pros</span>
          </h2>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {POINTS.map(({ icon: Icon, text }) => (
              <div key={text} className="space-y-4">
                <span className="grid h-12 w-12 place-items-center rounded-xl border-2 border-title text-title">
                  <Icon className="h-6 w-6" strokeWidth={1.8} />
                </span>
                <p className="text-base text-title/85 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center rounded-lg bg-title px-6 py-3 text-base font-semibold text-white! hover:bg-black transition-colors"
            >
              Join now
            </Link>
            <Link
              href="/account/post-job"
              className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white hover:bg-primary-hover transition-colors"
            >
              Post a job
            </Link>
          </div>
        </div>

        {/* Photo collage with floating trust cards */}
        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="relative aspect-[5/4] overflow-hidden rounded-3xl">
            <Image
              src={stock.techTeam}
              alt="A team of professionals working together at a laptop"
              fill
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-8 -left-4 w-[42%] overflow-hidden rounded-2xl border-[6px] border-white shadow-xl sm:-left-10">
            <div className="relative aspect-[4/5]">
              <Image
                src={stock.electricianPortrait}
                alt="A verified electrician"
                fill
                sizes="240px"
                className="object-cover"
              />
            </div>
          </div>
          <div className="absolute -top-5 right-4 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_12px_30px_-10px_rgba(15,23,42,0.35)] sm:-right-6">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-50 text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-title">ID verified</p>
              <p className="text-xs text-copy">Checked before they quote</p>
            </div>
          </div>
          <div className="absolute bottom-6 right-4 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-title shadow-lg backdrop-blur sm:right-6">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            Reviews from real jobs
          </div>
        </div>
      </div>
    </section>
  );
}
