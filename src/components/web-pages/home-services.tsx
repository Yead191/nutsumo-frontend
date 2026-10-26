"use client";

import { useRouter } from "next/navigation";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { ServiceTile } from "@/components/shared/service-tile";
import { categories } from "@/Mockdata";
import type { Category } from "@/types";

const featuredSlugs = [
  "plumbing",
  "electrical",
  "hvac",
  "roofing",
  "handyman",
  "appliance-repair",
  "painting",
  "landscaping",
] as const;

export function HomeServices() {
  const router = useRouter();
  const featured = featuredSlugs
    .map((slug) => categories.find((item) => item.slug === slug))
    .filter((item): item is Category => Boolean(item));

  return (
    <section className="bg-white py-[var(--section-sm)] md:py-[var(--section)]">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Specialties"
            title="Popular home repair services"
            description="Explore trusted local specialists, verified reviews, and screened pros in every category."
          />
          <Button href="/services" variant="ghost" className="hidden shrink-0 sm:inline-flex">
            View all services ↗
          </Button>
        </div>

        <div className="mt-14 sm:mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((category) => (
            <ServiceTile
              key={category.id}
              category={category}
              onSelect={(slug) => router.push(`/browse-pros?category=${slug}`)}
            />
          ))}
        </div>

        <div className="mt-10 flex justify-center sm:hidden">
          <Button href="/services" variant="ghost" className="w-full justify-center">
            View all services ↗
          </Button>
        </div>
      </div>
    </section>
  );
}