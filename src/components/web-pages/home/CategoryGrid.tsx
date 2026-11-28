import Link from "next/link";
import Image from "next/image";
import type { ICategoryItem } from "@/helpers/next-fetch/apiActions/marketplaceActions";
import { getImageUrl } from "@/lib/getImageUrl";
import { getCategoryIcon } from "./category-icons";

interface CategoryGridProps {
  categories: ICategoryItem[];
}

/**
 * Fiverr-style category row: compact white tiles with an icon and label,
 * sitting directly under the hero.
 */
export function CategoryGrid({ categories }: CategoryGridProps) {
  const active = (categories || []).filter((c) => c.isActive !== false);
  if (active.length === 0) return null;

  return (
    <section className="bg-white pt-10 pb-4 sm:pt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-3 overflow-x-auto pb-2 snap-x [scrollbar-width:none] sm:grid sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 sm:overflow-visible">
          {active.slice(0, 16).map((cat) => {
            const Icon = getCategoryIcon(cat.name, cat.slug);
            const imageUrl = cat.image ? getImageUrl(cat.image) : null;

            return (
              <Link
                key={cat._id}
                href={`/browse-pros?category=${cat._id}`}
                className="group snap-start shrink-0 w-32 sm:w-auto flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 min-h-[118px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-primary/50 hover:shadow-md transition-all"
              >
                <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-lg">
                  {imageUrl ? (
                    <Image src={imageUrl} alt="" fill sizes="36px" className="object-cover" />
                  ) : (
                    <Icon className="h-7 w-7 text-title group-hover:text-primary transition-colors" strokeWidth={1.6} />
                  )}
                </span>
                <span className="text-sm font-semibold leading-snug text-title line-clamp-2">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
