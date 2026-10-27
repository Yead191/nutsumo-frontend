"use client";

import { useRouter } from "next/navigation";
import { ServiceTile } from "@/components/shared/service-tile";
import { Button } from "@/components/ui/button";
import { categories } from "@/Mockdata";
import { postJobHref } from "@/lib/role-access";

export function ServicesCatalog() {
  const router = useRouter();
  const user = null;

  return (
    <section className="bg-surface py-[var(--section-sm)] md:py-[var(--section)]">
      <div className="container-site">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <ServiceTile
              key={category.id}
              category={category}
              onSelect={(slug) => router.push(`/browse-pros?category=${slug}`)}
            />
          ))}
        </div>
        {/* Bottom Action Strip */}
        <div className="mt-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-line/80 bg-white p-6 sm:p-7 shadow-xs">
          <div>
            <h3 className="font-display text-base sm:text-lg font-semibold text-title">
              Looking for a custom repair or different trade?
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-muted">
              Post your job details to receive direct quotes from cleared local Austin pros.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button href="/browse-pros" variant="ghost" size="sm">
              Browse all pros ↗
            </Button>
            <Button href={postJobHref(user)} size="sm">
              Post a request ↗
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
