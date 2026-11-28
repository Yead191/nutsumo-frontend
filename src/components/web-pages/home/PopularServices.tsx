"use client";

import { createElement, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight } from "lucide-react";
import type { ICategoryItem } from "@/helpers/next-fetch/apiActions/marketplaceActions";
import { getImageUrl } from "@/lib/getImageUrl";
import { groupCategories } from "@/lib/category-groups";
import { categoryPhoto } from "@/lib/stock-photos";
import { getCategoryIcon } from "./category-icons";

interface PopularServicesProps {
  categories: ICategoryItem[];
}

const CARDS_PER_GROUP = 8;

/** Brand-tinted backgrounds, dark and light, cycled across cards. */
const TILE_THEMES = [
  { bg: "#4A0D1E", fg: "#FFD3DC", glow: "#FE375D" },
  { bg: "#FDE2E7", fg: "#8A1D35", glow: "#FFFFFF" },
  { bg: "#01133C", fg: "#BFD3FF", glow: "#3B6BFF" },
  { bg: "#FE375D", fg: "#FFFFFF", glow: "#FFB3C2" },
  { bg: "#1D3B2A", fg: "#CDEBD7", glow: "#4CAF7A" },
  { bg: "#F4D9C6", fg: "#6B2A12", glow: "#FFFFFF" },
  { bg: "#2A0A12", fg: "#FF9AAE", glow: "#C2264A" },
  { bg: "#E8EEF9", fg: "#0D2A4A", glow: "#FFFFFF" },
];

/** Varying heights give the masonry its staggered, Fiverr-like rhythm. */
const ASPECTS = ["aspect-[4/5]", "aspect-[3/2]", "aspect-[5/6]", "aspect-[4/3]", "aspect-square", "aspect-[3/4]", "aspect-[16/11]", "aspect-[5/4]"];

function photoFor(category: ICategoryItem) {
  // Admin-uploaded image first, then a matching stock photo; otherwise an illustrated tile.
  if (category.image) return getImageUrl(category.image);
  return categoryPhoto(category.name, category.slug);
}

/**
 * Fiverr-style "browse by category": pill tabs for each group, then a masonry of
 * large image cards with the category name underneath.
 */
export function PopularServices({ categories }: PopularServicesProps) {
  const groups = groupCategories((categories || []).filter((c) => c.isActive !== false));
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (groups.length === 0) return null;
  const active = groups.find((group) => group.key === activeKey) ?? groups[0];
  const shown = active.categories.slice(0, CARDS_PER_GROUP);

  return (
    <section className="bg-white py-20 sm:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 font-display text-3xl font-semibold text-title sm:text-4xl">
          Popular services
        </h2>

        {/* Group tabs */}
        <div className="relative mb-8">
          <div
            ref={scrollerRef}
            role="tablist"
            aria-label="Service categories"
            className="flex gap-2 overflow-x-auto pr-12 scrollbar-none [&::-webkit-scrollbar]:hidden"
          >
            {groups.map((group) => {
              const selected = group.key === active.key;
              return (
                <button
                  key={group.key}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveKey(group.key)}
                  className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2.5 text-base font-semibold transition cursor-pointer sm:text-[17px] ${
                    selected ? "bg-title text-white!" : "text-title hover:bg-slate-100"
                  }`}
                >
                  {group.label}
                </button>
              );
            })}
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-linear-to-l from-white to-transparent" />
          <button
            type="button"
            aria-label="Scroll categories"
            onClick={() => scrollerRef.current?.scrollBy({ left: 320, behavior: "smooth" })}
            className="absolute right-0 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white text-title shadow-[0_1px_8px_rgba(0,0,0,0.18)] hover:text-primary cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Masonry of category cards */}
        <div key={active.key} role="tabpanel" className="columns-2 gap-4 sm:gap-6 lg:columns-4">
          {shown.map((category, index) => (
            <CategoryCard key={category._id} category={category} index={index} />
          ))}
        </div>

        {active.categories.length > shown.length ? (
          <div className="mt-2 flex justify-center">
            <Link
              href="/browse-pros"
              className="inline-flex items-center gap-2 rounded-full border border-title px-5 py-2.5 text-sm font-semibold text-title transition hover:bg-title hover:text-white"
            >
              See all {active.categories.length} in {active.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function CategoryCard({ category, index }: { category: ICategoryItem; index: number }) {
  const photo = photoFor(category);
  const theme = TILE_THEMES[index % TILE_THEMES.length];
  const icon = getCategoryIcon(category.name, category.slug);
  const aspect = ASPECTS[index % ASPECTS.length];

  return (
    <Link
      href={`/browse-pros?category=${category._id}`}
      className="group mb-6 block break-inside-avoid animate-[fadeUp_.45s_ease_both]"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div
        className={`relative ${aspect} overflow-hidden rounded-2xl ${photo ? "bg-slate-100" : ""}`}
        style={photo ? undefined : { backgroundColor: theme.bg }}
      >
        {photo ? (
          // Photo fills the whole card edge to edge (no colored frame).
          <Image
            src={photo}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <>
            <div
              aria-hidden="true"
              className="absolute -right-10 -top-10 h-48 w-48 rounded-full opacity-40 blur-2xl"
              style={{ backgroundColor: theme.glow }}
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full border-18 opacity-15"
              style={{ borderColor: theme.fg }}
            />
            <div className="absolute inset-0 grid place-items-center">
              <span
                className="grid h-24 w-24 place-items-center rounded-3xl border backdrop-blur-sm transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 sm:h-28 sm:w-28"
                style={{ borderColor: `${theme.fg}33`, backgroundColor: `${theme.fg}14`, color: theme.fg }}
              >
                {createElement(icon, { className: "h-12 w-12 sm:h-14 sm:w-14", strokeWidth: 1.4 })}
              </span>
            </div>
          </>
        )}
      </div>
      <p className="mt-3 text-[15px] font-semibold text-title transition-colors group-hover:text-primary sm:text-base">
        {category.name}
      </p>
    </Link>
  );
}
