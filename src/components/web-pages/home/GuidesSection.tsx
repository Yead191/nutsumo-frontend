import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { stock } from "@/lib/stock-photos";

const GUIDES = [
  {
    tag: "Getting started",
    title: "How hiring on Nutsumo works, step by step",
    href: "/how-it-works",
    image: stock.consultation,
  },
  {
    tag: "Payments",
    title: "How escrow keeps your money safe until the job is done",
    href: "/faq",
    image: stock.checkout,
  },
  {
    tag: "Pricing",
    title: "Clear pricing and platform fees, explained",
    href: "/pricing",
    image: stock.finance,
  },
  {
    tag: "For pros",
    title: "Get verified and start winning jobs near you",
    href: "/pro-register",
    image: stock.constructionTeam,
  },
];

export function GuidesSection() {
  return (
    <section className="bg-white py-20 sm:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-title">
            Guides to help you get it done
          </h2>
          <Link href="/faq" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-title underline-offset-4 hover:underline">
            See more <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="-mx-4 mt-10 flex snap-x gap-5 overflow-x-auto px-4 pb-2 scrollbar-none sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {GUIDES.map((guide) => (
            <Link key={guide.title} href={guide.href} className="group w-72 shrink-0 snap-start sm:w-auto">
              <div className="relative aspect-[16/11] overflow-hidden rounded-2xl">
                <Image
                  src={guide.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 288px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-primary">{guide.tag}</p>
              <h3 className="mt-1.5 text-lg font-semibold leading-snug text-title transition-colors group-hover:text-primary">
                {guide.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
