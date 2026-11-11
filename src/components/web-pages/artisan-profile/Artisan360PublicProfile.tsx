"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  PhoneCall,
  Clock,
  Layers,
  Wrench,
  Star,
  FileText,
} from "lucide-react";
import { ArtisanHeroIdentity } from "./ArtisanHeroIdentity";
import { ArtisanStatsStrip } from "./ArtisanStatsStrip";
import { ArtisanAboutCredentials } from "./ArtisanAboutCredentials";
import { ArtisanServicesCatalog } from "./ArtisanServicesCatalog";
import { ArtisanPortfolioShowcase } from "./ArtisanPortfolioShowcase";
import { ArtisanReviewsSection } from "./ArtisanReviewsSection";
import { DirectQuoteModal } from "@/components/web-pages/DirectQuoteModal";
import type {
  IArtisanProfileItem,
  IArtisanServiceItem,
  IPortfolioItem,
  IArtisanReviewData,
  ICategoryItem,
} from "@/helpers/next-fetch/apiActions/marketplaceActions";

interface Artisan360PublicProfileProps {
  profile: IArtisanProfileItem;
  services: IArtisanServiceItem[];
  portfolio: IPortfolioItem[];
  reviewData?: IArtisanReviewData;
  categories: ICategoryItem[];
}

export function Artisan360PublicProfile({
  profile,
  services,
  portfolio,
  reviewData,
  categories,
}: Artisan360PublicProfileProps) {
  // Modal state
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<{
    id?: string;
    name?: string;
  }>({});

  const [activeTab, setActiveTab] = useState<
    "overview" | "services" | "portfolio" | "reviews"
  >("overview");

  const handleOpenGeneralQuote = () => {
    setPreselectedService({});
    setQuoteModalOpen(true);
  };

  const handleOpenServiceQuote = (serviceId: string, serviceName: string) => {
    setPreselectedService({ id: serviceId, name: serviceName });
    setQuoteModalOpen(true);
  };

  const user = profile.user || ({} as any);
  const displayName = profile.businessName || user.name || "Master Artisan";
  const categoryName =
    typeof profile.category === "object"
      ? profile.category?.name
      : profile.category;
  const trade = profile.trade || categoryName || "Professional Artisan";
  const startingRate = profile.startingRate || profile.hourlyRate || 50;

  return (
    <div className="bg-slate-50/60 min-h-screen pb-24 pt-20.5">
      {/* Container with max width and comfortable padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* 1. HERO IDENTITY CARD */}
        <ArtisanHeroIdentity
          profile={profile}
          onRequestQuote={handleOpenGeneralQuote}
        />

        {/* 2. STATS STRIP */}
        <ArtisanStatsStrip
          profile={profile}
          totalReviews={reviewData?.summary?.totalReviews}
          averageRating={reviewData?.summary?.averageRating}
        />

        {/* 3. NAVIGATION TABS */}
        <div className="border-b border-slate-200/80 bg-white rounded-2xl p-1.5 shadow-2xs flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "overview"
                ? "bg-primary text-white shadow-xs"
                : "text-muted hover:text-title hover:bg-slate-50"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Overview & Bio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("services")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "services"
                ? "bg-primary text-white shadow-xs"
                : "text-muted hover:text-title hover:bg-slate-50"
            }`}
          >
            <Wrench className="h-4 w-4" />
            <span>Services & Rates ({services.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("portfolio")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "portfolio"
                ? "bg-primary text-white shadow-xs"
                : "text-muted hover:text-title hover:bg-slate-50"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Portfolio ({portfolio.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("reviews")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "reviews"
                ? "bg-primary text-white shadow-xs"
                : "text-muted hover:text-title hover:bg-slate-50"
            }`}
          >
            <Star className="h-4 w-4" />
            <span>Reviews ({reviewData?.reviews?.length || 0})</span>
          </button>
        </div>

        {/* 4. MAIN CONTENT GRID (With Sticky Desktop Booking Box) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8">
            {activeTab === "overview" && (
              <div className="space-y-8">
                <ArtisanAboutCredentials profile={profile} />
                <ArtisanServicesCatalog
                  services={services}
                  onRequestServiceQuote={handleOpenServiceQuote}
                  onRequestGeneralQuote={handleOpenGeneralQuote}
                />
                <ArtisanPortfolioShowcase portfolio={portfolio} />
                <ArtisanReviewsSection
                  reviewData={reviewData}
                  artisanName={displayName}
                />
              </div>
            )}

            {activeTab === "services" && (
              <ArtisanServicesCatalog
                services={services}
                onRequestServiceQuote={handleOpenServiceQuote}
                onRequestGeneralQuote={handleOpenGeneralQuote}
              />
            )}

            {activeTab === "portfolio" && (
              <ArtisanPortfolioShowcase portfolio={portfolio} />
            )}

            {activeTab === "reviews" && (
              <ArtisanReviewsSection
                reviewData={reviewData}
                artisanName={displayName}
              />
            )}
          </div>

          {/* Sticky Quick-Hire Sidebar Column */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-bold text-muted uppercase tracking-wider block">
                    Starting Estimate
                  </span>
                  <div className="font-display text-2xl font-black text-title mt-0.5">
                    GH₵ {startingRate}
                    <span className="text-xs font-normal text-muted ml-1">
                      / job or hr
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Verified
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleOpenGeneralQuote}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-primary-hover text-white py-3.5 text-sm font-bold shadow-md hover:shadow-lg transition-all transform active:scale-[0.98] cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Request Custom Quote</span>
                </button>

                <Link
                  href={`/account/messages?to=${user._id || profile._id}`}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-title py-3 text-xs sm:text-sm font-bold transition-colors"
                >
                  <MessageSquare className="h-4 w-4 text-slate-500" />
                  <span>Chat with {displayName}</span>
                </Link>
              </div>

              {/* Trust Guarantees */}
              <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-muted">
                <div className="flex items-start gap-2.5">
                  <Lock className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-title block">
                      100% Escrow Protection
                    </strong>
                    <span>
                      Funds held safely until you sign off the completed job.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-title block">
                      No Direct Cash Risk
                    </strong>
                    <span>
                      Payment released to artisan only upon your explicit
                      approval.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-title block">
                      Fast Response Time
                    </strong>
                    <span>
                      Artisans typically respond with itemized bids in 15–30
                      mins.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Need Help Card */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center space-y-2">
              <span className="text-xs font-bold text-title block">
                Have questions about hiring this pro?
              </span>
              <p className="text-[11px] text-muted">
                Our Accra customer dispute and trust team is on standby to help
                you anytime.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline pt-1"
              >
                <span>Contact Nutsumo Support</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 5. DIRECT QUOTE MODAL (Method 1: Upwork/Fiverr Custom Offer Flow) */}
      <DirectQuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        artisan={{
          _id: profile._id,
          user: profile.user,
          trade,
          businessName: profile.businessName,
          location: profile.location || profile.city,
        }}
        categories={categories}
        preselectedServiceId={preselectedService.id}
        preselectedServiceName={preselectedService.name}
      />
    </div>
  );
}
