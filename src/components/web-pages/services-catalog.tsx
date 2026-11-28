"use client";

import { createElement, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search, X } from "lucide-react";
import type { ICategoryItem } from "@/helpers/next-fetch/apiActions/marketplaceActions";
import { getImageUrl } from "@/lib/getImageUrl";
import { groupCategories } from "@/lib/category-groups";
import { categoryPhoto, stock } from "@/lib/stock-photos";
import { getCategoryIcon } from "@/components/web-pages/home/category-icons";

interface ServicesCatalogProps {
  categories: ICategoryItem[];
}

/**
 * Fiverr-style catalog: search + group chips, then each group as a grid of
 * photo cards. Admin-uploaded images win; otherwise an on-topic stock photo.
 */
export function ServicesCatalog({ categories }: ServicesCatalogProps) {
  const [query, setQuery] = useState("");
  const [groupKey, setGroupKey] = useState<string | null>(null);

  const groups = useMemo(
    () => groupCategories((categories || []).filter((c) => c.isActive !== false)),
    [categories],
  );
  const total = groups.reduce((sum, group) => sum + group.categories.length, 0);

  const q = query.trim().toLowerCase();
  const visible = groups
    .filter((group) => !groupKey || group.key === groupKey)
    .map((group) => ({
      ...group,
      categories: q
        ? group.categories.filter((c) =>
            `${c.name} ${c.description || ""}`.toLowerCase().includes(q),
          )
        : group.categories,
    }))
    .filter((group) => group.categories.length > 0);

  return (
    <section className="bg-white pt-10 pb-20 sm:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Toolbar: search + group chips */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative block w-full lg:max-w-md">
            <span className="sr-only">Search services</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${total} service categories…`}
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-10 text-[15px] text-title placeholder:text-slate-400 focus:border-title focus:outline-none"
            />
            {query ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </label>
          <p className="text-sm text-copy">
            <span className="font-semibold text-title">{total}</span> categories ·{" "}
            <span className="font-semibold text-title">{groups.length}</span> groups
          </p>
        </div>

        <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:px-0">
          <Chip active={!groupKey} onClick={() => setGroupKey(null)}>
            All
          </Chip>
          {groups.map((group) => (
            <Chip key={group.key} active={groupKey === group.key} onClick={() => setGroupKey(group.key)}>
              {group.label}
            </Chip>
          ))}
        </div>

        {/* Groups */}
        {visible.length === 0 ? (
          <div className="mt-16 rounded-3xl bg-slate-50 px-6 py-16 text-center">
            <p className="font-display text-xl font-semibold text-title">No categories match “{query}”</p>
            <p className="mt-2 text-copy">Try a different word, or post a job and let pros come to you.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setGroupKey(null);
              }}
              className="mt-6 rounded-lg bg-title px-5 py-2.5 text-sm font-semibold text-white! cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="mt-12 space-y-16 sm:space-y-20">
            {visible.map((group) => (
              <div key={group.key}>
                <div className="flex items-end justify-between gap-4">
                  <h2 className="font-display text-2xl font-semibold text-title sm:text-3xl">{group.label}</h2>
                  <span className="text-sm text-copy">{group.categories.length} categories</span>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
                  {withUniquePhotos(group.categories).map(({ category, photo }, index) => (
                    <CategoryCard key={category._id} category={category} photo={photo} index={index} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Closing CTA */}
        <div className="relative mt-20 grid overflow-hidden rounded-3xl bg-[#2A0A12] md:grid-cols-2 sm:mt-28">
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/25 blur-3xl" />
          <div className="relative px-6 py-12 sm:px-12 sm:py-14">
            <h3 className="font-display text-3xl font-semibold leading-tight text-white! sm:text-4xl">
              Can&apos;t find the skill you need?
            </h3>
            <p className="mt-4 max-w-md text-base text-white/75">
              Post your job for free and verified pros will send you quotes with a clear fee breakdown and 100% escrow protection.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/account/post-job"
                className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white hover:bg-primary-hover transition-colors"
              >
                Post a job
              </Link>
              <Link
                href="/browse-pros"
                className="inline-flex items-center rounded-lg border border-white/40 px-6 py-3 text-base font-semibold text-white! hover:bg-white/10 transition-colors"
              >
                Browse all pros
              </Link>
            </div>
          </div>
          <div className="relative min-h-[240px]">
            <Image src={stock.consultation} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-[#2A0A12]/50 to-transparent md:bg-linear-to-r md:from-[#2A0A12] md:via-[#2A0A12]/10 md:to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition cursor-pointer ${
        active ? "bg-title text-white!" : "bg-slate-100 text-title hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

/** Brand-tinted fallback tiles for categories with no photo. */
const TILE_THEMES = [
  { bg: "#4A0D1E", fg: "#FFD3DC" },
  { bg: "#01133C", fg: "#BFD3FF" },
  { bg: "#1D3B2A", fg: "#CDEBD7" },
  { bg: "#2A0A12", fg: "#FF9AAE" },
];

/**
 * Resolves each card's photo: admin image first, then a stock photo, but a stock
 * photo is used only once per group so repeated pictures don't look templated.
 */
function withUniquePhotos(categories: ICategoryItem[]) {
  const used = new Set<string>();
  return categories.map((category) => {
    if (category.image) return { category, photo: getImageUrl(category.image) || null };
    const stockPhoto = categoryPhoto(category.name, category.slug);
    if (!stockPhoto || used.has(stockPhoto)) return { category, photo: null };
    used.add(stockPhoto);
    return { category, photo: stockPhoto };
  });
}

function CategoryCard({
  category,
  photo,
  index,
}: {
  category: ICategoryItem;
  photo: string | null;
  index: number;
}) {
  const theme = TILE_THEMES[index % TILE_THEMES.length];
  const icon = getCategoryIcon(category.name, category.slug);
  const href = `/categories/${category._id}`;

  return (
    <article className="group flex flex-col">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden rounded-2xl" style={photo ? undefined : { backgroundColor: theme.bg }}>
        {photo ? (
          <Image
            src={photo}
            alt={category.name}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center" style={{ color: theme.fg }}>
            {createElement(icon, { className: "h-14 w-14", strokeWidth: 1.4 })}
          </span>
        )}
      </Link>
      <Link href={href} className="mt-3 font-display text-base font-semibold text-title transition-colors sm:mt-4 sm:text-lg group-hover:text-primary">
        {category.name}
      </Link>
      <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-copy">
        {category.description ||
          `Hire verified ${category.name.toLowerCase()} professionals with 100% escrow protection.`}
      </p>
      <Link
        href={`/browse-pros?category=${category._id}`}
        className="mt-3 inline-flex items-center gap-1 self-start text-sm font-semibold text-title underline-offset-4 hover:text-primary hover:underline"
      >
        Browse pros <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </article>
  );
}
