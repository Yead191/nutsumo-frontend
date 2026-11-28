"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Sparkles,
  Wrench,
  Search,
  ArrowRight,
  Info,
} from "lucide-react";
import { ServiceArtisansFilterBar } from "./ServiceArtisansFilterBar";
import { ServiceArtisanCard } from "./ServiceArtisanCard";
import { DirectQuoteModal } from "@/components/web-pages/DirectQuoteModal";
import type { QuoteViewer } from "@/lib/quoteViewer";
import { getImageUrl } from "@/lib/getImageUrl";
import { categoryPhoto } from "@/lib/stock-photos";
import type {
  IServiceItem,
  IArtisanProfileItem,
  IArtisanServiceItem,
  ICategoryItem,
} from "@/helpers/next-fetch/apiActions/marketplaceActions";

interface ServiceArtisansContainerProps {
  service: IServiceItem;
  category?: ICategoryItem | null;
  artisans: Array<{
    profile: IArtisanProfileItem;
    customRate?: { amount: number; type: string };
  }>;
  categories: ICategoryItem[];
  viewer?: QuoteViewer | null;
  filterParams: {
    searchTerm?: string;
    location?: string;
    sort?: string;
    availability?: string;
    rating?: string;
  };
}

export function ServiceArtisansContainer({
  service,
  category,
  artisans,
  categories,
  filterParams,
  viewer = null,
}: ServiceArtisansContainerProps) {
  // Direct Quote Modal state
  const [selectedArtisanForQuote, setSelectedArtisanForQuote] =
    useState<IArtisanProfileItem | null>(null);

  const handleOpenQuote = (artisan: IArtisanProfileItem) => {
    setSelectedArtisanForQuote(artisan);
  };

  const serviceImg = service.image ? getImageUrl(service.image) : null;
  const categoryName = category?.name || (service.category as any)?.name || "Professional Services";
  const categoryId = category?._id || (service.category as any)?._id;
  const heroImage = serviceImg || categoryPhoto(service.name, categoryName);

  return (
    <div className="bg-white min-h-screen pt-18 pb-24">
      {/* 1. Breadcrumb + photo hero */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-sm text-copy"
        >
          <Link href="/" className="hover:text-title transition-colors">
            Home
          </Link>
          <span className="text-slate-300">/</span>
          {categoryId && (
            <>
              <Link
                href={`/categories/${categoryId}`}
                className="hover:text-title transition-colors"
              >
                {categoryName}
              </Link>
              <span className="text-slate-300">/</span>
            </>
          )}
          <span className="text-title" aria-current="page">
            {service.name}
          </span>
        </nav>

        <div className="relative isolate mt-5 overflow-hidden rounded-3xl bg-[#2A0A12]">
          {heroImage ? (
            <Image
              src={heroImage}
              alt=""
              fill
              priority
              sizes="(min-width: 1280px) 1216px, 100vw"
              className="-z-10 object-cover"
            />
          ) : null}
          <div className="absolute inset-0 -z-10 bg-linear-to-r from-[#2A0A12] via-[#2A0A12]/80 to-[#2A0A12]/20" />
          <div className="max-w-2xl px-6 py-12 sm:px-12 sm:py-16">
            <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-[-0.02em] text-white! sm:text-5xl">
              {service.name} in Ghana
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg">
              {service.description ||
                `Compare verified professionals offering ${service.name.toLowerCase()}. Request custom quotes, check customer ratings, and hire with 100% escrow protection.`}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-white/85">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Ghana Card verified
              </span>
              <span className="inline-flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                100% escrow protected
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-white" />
                Transparent 22.5% fees
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN LISTING CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        {/* Server-Driven Filter Bar */}
        <ServiceArtisansFilterBar
          initialSearch={filterParams.searchTerm}
          initialLocation={filterParams.location}
          initialSort={filterParams.sort}
          initialAvailability={filterParams.availability}
          initialRating={filterParams.rating}
          totalFound={artisans.length}
        />

        {/* Artisans Grid or Empty State */}
        {artisans.length === 0 ? (
          <div className="rounded-3xl bg-slate-50 px-6 py-16 text-center space-y-4 ring-1 ring-slate-200">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white text-primary shadow-sm ring-1 ring-slate-200">
              <Search className="h-8 w-8" strokeWidth={1.6} />
            </div>

            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="font-display text-2xl font-semibold text-title">
                No exact matches with these filters
              </h3>
              <p className="text-[15px] text-copy">
                Try clearing your location or availability filters, or post a custom job request to receive direct proposals from verified {categoryName} pros.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                href={`/services/${service._id}/pros`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white ring-1 ring-slate-300 hover:ring-title text-title px-5 py-2.5 text-sm font-semibold transition"
              >
                <span>Reset All Filters</span>
              </Link>

              {categoryId && (
                <Link
                  href={`/categories/${categoryId}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white px-5 py-2.5 text-sm font-semibold transition-colors"
                >
                  <span>Browse All {categoryName} Services</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {artisans.map(({ profile, customRate }) => (
              <ServiceArtisanCard
                key={profile._id}
                artisan={profile}
                serviceId={service._id}
                serviceName={service.name}
                customRate={customRate}
                onRequestQuote={() => handleOpenQuote(profile)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 3. DIRECT CUSTOM QUOTE MODAL (Method 1: Upwork/Fiverr Flow) */}
      {selectedArtisanForQuote && (
        <DirectQuoteModal
          isOpen={Boolean(selectedArtisanForQuote)}
          onClose={() => setSelectedArtisanForQuote(null)}
          artisan={{
            _id: selectedArtisanForQuote._id,
            user: selectedArtisanForQuote.user,
            trade: selectedArtisanForQuote.trade || categoryName,
            businessName: selectedArtisanForQuote.businessName,
            location:
              selectedArtisanForQuote.location ||
              selectedArtisanForQuote.city ||
              (selectedArtisanForQuote.user as any)?.location,
          }}
          categories={categories}
          preselectedServiceId={service._id}
          preselectedServiceName={service.name}
          viewer={viewer}
        />
      )}
    </div>
  );
}

