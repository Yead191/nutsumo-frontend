import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { stock } from "@/lib/stock-photos";

const TALL = "aspect-[4/5]";
const SHORT = "aspect-[4/3]";

/**
 * Example work by service type; each tile searches for pros who offer it.
 * Tiles pair one TALL with one SHORT per column so every column ends level
 * (4 columns on desktop, 2 on mobile).
 */
const TILES = [
  { label: "Kitchen remodeling", q: "Kitchen", image: stock.kitchen, aspect: TALL },
  { label: "Web development", q: "Web", image: stock.codeScreen, aspect: SHORT },
  { label: "Interior design", q: "Interior", image: stock.livingRoom, aspect: SHORT },
  { label: "Private chefs", q: "Chef", image: stock.chef, aspect: TALL },
  { label: "Graphic design", q: "Design", image: stock.designPalette, aspect: TALL },
  { label: "Landscaping", q: "Landscaping", image: stock.lawn, aspect: SHORT },
  { label: "Event planning", q: "Event", image: stock.eventTable, aspect: SHORT },
  { label: "Bathroom renovation", q: "Bathroom", image: stock.bathroom, aspect: TALL },
];

export function InspirationGallery() {
  return (
    <section className="bg-white py-20 sm:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-title">
              Get inspired by work done right
            </h2>
            <p className="mt-3 text-base sm:text-lg text-copy">
              From a new kitchen to a new website: see what&apos;s possible, then find the pro to make it happen.
            </p>
          </div>
          <Link
            href="/browse-pros"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-title underline-offset-4 hover:underline"
          >
            Explore all pros <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 columns-2 gap-4 sm:gap-5 lg:columns-4">
          {TILES.map((tile) => (
            <Link
              key={tile.label}
              href={`/browse-pros?q=${encodeURIComponent(tile.q)}`}
              className="group relative mb-4 block break-inside-avoid overflow-hidden rounded-2xl sm:mb-5"
            >
              <div className={`relative ${tile.aspect}`}>
                <Image
                  src={tile.image}
                  alt={tile.label}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/0 to-black/0 opacity-80 transition-opacity group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
                  <span className="text-sm font-semibold text-white sm:text-base">{tile.label}</span>
                  <span className="grid h-8 w-8 shrink-0 translate-y-1 place-items-center rounded-full bg-white text-title opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
