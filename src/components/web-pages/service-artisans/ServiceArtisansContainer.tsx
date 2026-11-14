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
import { getImageUrl } from "@/lib/getImageUrl";
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
}: ServiceArtisansContainerProps) {
  // Direct Quote Modal state
  const [selectedArtisanForQuote, setSelectedArtisanForQuote] =
    useState<IArtisanProfileItem | null>(null);

  const handleOpenQuote = (artisan: IArtisanProfileItem) => {
    setSelectedArtisanForQuote(artisan);
  };

  const serviceImg = service.image ? getImageUrl(service.image) : null;
  const categoryName = category?.name || (service.category as any)?.name || "Trade Services";
  const categoryId = category?._id || (service.category as any)?._id;

  return (
    <div className="bg-slate-50/60 min-h-screen pb-24">
      {/* 1. HEADER & HERO BANNER */}
      <section className="bg-white border-b border-slate-200 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-semibold text-muted flex-wrap"
          >
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            {categoryId && (
              <>
                <Link
                  href={`/categories/${categoryId}`}
                  className="hover:text-primary transition-colors"
                >
                  {categoryName}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-title" aria-current="page">
              {service.name} Specialists
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Verified Specialist Service</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-title tracking-tight">
                {service.name} in Ghana
              </h1>

              <p className="text-sm sm:text-base text-copy leading-relaxed font-sans">
                {service.description ||
                  `Compare verified craftsmen offering professional ${service.name.toLowerCase()}. Request custom quotes, check customer ratings, and hire with 100% escrow protection.`}
              </p>

              {/* Trust Markers */}
              <div className="pt-1 flex flex-wrap items-center gap-4 text-xs text-muted">
                <span className="inline-flex items-center gap-1.5 font-bold text-title">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Ghana Card Biometric Audited</span>
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5 font-bold text-title">
                  <Lock className="h-4 w-4 text-primary" />
                  <span>100% Escrow Protected</span>
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5 font-bold text-title">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                  <span>Transparent 22.5% fees</span>
                </span>
              </div>
            </div>

            {/* Service Thumbnail Visual */}
            {serviceImg && (
              <div className="relative h-32 w-32 sm:h-40 sm:w-40 rounded-3xl overflow-hidden border-2 border-slate-200 bg-slate-100 shrink-0 shadow-sm hidden sm:block">
                <Image
                  src={serviceImg}
                  alt={service.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. MAIN LISTING CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
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
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4 shadow-2xs">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-primary/10 text-primary">
              <Search className="h-8 w-8" />
            </div>

            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="font-display text-lg font-bold text-title">
                No Exact Matches Found with Current Filters
              </h3>
              <p className="text-xs sm:text-sm text-muted">
                Try clearing your location or availability filters, or post a custom job request to receive direct proposals from verified {categoryName} pros.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                href={`/services/${service._id}/pros`}
                className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-title px-5 py-2.5 text-xs font-bold transition-colors"
              >
                <span>Reset All Filters</span>
              </Link>

              {categoryId && (
                <Link
                  href={`/categories/${categoryId}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary hover:bg-primary-hover text-white px-5 py-2.5 text-xs font-bold shadow-xs transition-colors"
                >
                  <span>Browse All {categoryName} Services</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        />
      )}
    </div>
  );
}

