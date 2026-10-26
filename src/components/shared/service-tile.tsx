"use client";

import {
  ArrowUpRight,
  Wrench,
  Zap,
  Wind,
  Hammer,
  Trees,
  Paintbrush,
  Bug,
  Droplets,
  Home,
} from "lucide-react";
import { photos } from "@/lib/media";
import type { Category } from "@/types";

const icons: Record<string, typeof Wrench> = {
  "appliance-repair": Wrench,
  electrical: Zap,
  hvac: Wind,
  handyman: Hammer,
  landscaping: Trees,
  painting: Paintbrush,
  "pest-control": Bug,
  plumbing: Droplets,
  roofing: Home,
};

export function ServiceTile({
  category,
  onSelect,
}: {
  category: Category;
  onSelect?: (slug: string) => void;
}) {
  const Icon = icons[category.slug] ?? Wrench;
  const image = photos.services[category.slug];

  return (
    <button
      type="button"
      onClick={() => onSelect?.(category.slug)}
      className="group relative flex h-[210px] sm:h-[220px] w-full flex-col justify-between overflow-hidden rounded-[18px] border border-line/80 bg-white p-4 sm:p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_16px_36px_color-mix(in_srgb,var(--ink)_14%,transparent)] focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
    >
      {/* Background Image with Zoom */}
      <span
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
        style={{ backgroundImage: `url(${image})` }}
      />
      {/* High-end gradient wash: soft top, rich dark bottom */}
      <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/15 transition-opacity group-hover:from-black/90" />

      {/* Top Bar: Service Icon */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/20 text-white backdrop-blur-md transition-colors group-hover:bg-primary group-hover:text-white">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>

      <div className="relative z-10">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-[18px] sm:text-[19px] font-medium leading-tight text-white group-hover:text-white">
              {category.name}
            </h3>
          </div>
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-title transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </button>
  );
}