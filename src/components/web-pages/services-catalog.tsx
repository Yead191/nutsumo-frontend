"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Wrench, ShieldCheck, Sparkles, Layers } from "lucide-react";
import type { ICategoryItem } from "@/helpers/next-fetch/apiActions/marketplaceActions";
import { getImageUrl } from "@/lib/getImageUrl";

interface ServicesCatalogProps {
  categories: ICategoryItem[];
}

export function ServicesCatalog({ categories }: ServicesCatalogProps) {
  const activeCategories = (categories || []).filter((c) => c.isActive !== false);

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1 font-display">
              All Service Categories
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-title">
              Specialized Trade Categories
            </h2>
            <p className="text-xs sm:text-sm text-copy mt-1 max-w-xl">
              Choose a category to view specialized sub-services or explore verified local professionals.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full shrink-0">
            {activeCategories.length} Categories Available
          </span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activeCategories.map((category) => {
            const imageUrl = category.image ? getImageUrl(category.image) : null;

            return (
              <div
                key={category._id}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs hover:shadow-lg hover:border-primary/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 mb-4">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center bg-primary/5 text-primary">
                        <Wrench className="h-10 w-10 text-primary/60" />
                      </div>
                    )}
                  </div>

                  <h3 className="font-display text-lg font-bold text-title group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>

                  <p className="mt-1 text-xs text-copy line-clamp-2 leading-relaxed">
                    {category.description ||
                      `Hire verified ${category.name.toLowerCase()} trade professionals with 100% escrow protection.`}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    href={`/categories/${category._id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                  >
                    <span>View Services</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  <Link
                    href={`/browse-pros?category=${category.slug || category._id}`}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-100 hover:bg-primary hover:text-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 transition-colors"
                  >
                    <span>Browse Pros</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Action Strip */}
        <div className="mt-14 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-primary/20 bg-primary/5 p-6 sm:p-8 shadow-xs">
          <div>
            <h3 className="font-display text-lg sm:text-xl font-bold text-title">
              Looking for a custom project or specialized trade?
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-copy">
              Post your job details to receive transparent proposals with 20% statutory deductions and 100% escrow protection.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/browse-pros"
              className="rounded-full border border-slate-200 bg-white hover:bg-slate-50 px-5 py-2.5 text-xs font-bold text-title shadow-2xs transition-colors"
            >
              Browse All Pros
            </Link>
            <Link
              href="/account/post-job"
              className="rounded-full bg-primary hover:bg-primary-hover px-6 py-2.5 text-xs font-bold text-white shadow-xs transition-colors"
            >
              Post a Request
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
