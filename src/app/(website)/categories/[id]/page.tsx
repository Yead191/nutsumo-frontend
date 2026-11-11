import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Wrench,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import {
  getCategoryById,
  getServicesByCategory,
} from "@/helpers/next-fetch/apiActions/marketplaceActions";
import { getImageUrl } from "@/lib/getImageUrl";

export const revalidate = 3600; // 1 hour ISR

interface CategoryServicesPageProps {
  params: Promise<{ id: string }>;
}

export default async function CategoryServicesPage({
  params,
}: CategoryServicesPageProps) {
  const { id } = await params;
  const [categoryRes, servicesRes] = await Promise.all([
    getCategoryById(id),
    getServicesByCategory(id),
  ]);

  const category = categoryRes?.data;
  if (!category) {
    notFound();
  }

  const services = servicesRes?.data || [];
  const categoryBannerUrl = category.image ? getImageUrl(category.image) : null;

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* 1. CATEGORY HEADER & HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/60 py-12 sm:py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Marketplace Home</span>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Specialized Trade Catalog</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-title tracking-tight">
                {category.name} Services
              </h1>

              <p className="text-sm sm:text-base text-copy leading-relaxed font-sans">
                {category.description ||
                  `Explore verified ${category.name.toLowerCase()} specialists. Compare custom bids, check verified ratings, and hire with 100% escrow protection.`}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-muted">
                <span className="flex items-center gap-1.5 font-semibold text-title">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Verified Craftsmen</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 font-semibold text-title">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>100% Escrow Protection</span>
                </span>
              </div>
            </div>

            {/* Quick Find Pros CTA */}
            <div className="shrink-0 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm max-w-sm w-full space-y-3">
              <span className="text-xs font-bold text-title block uppercase tracking-wider font-display">
                Looking for {category.name} Pros?
              </span>
              <p className="text-xs text-muted">
                Browse all available professionals offering services in this
                category.
              </p>
              <Link
                href={`/browse-pros?category=${category.slug || category._id}`}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary-hover text-white py-3 text-xs sm:text-sm font-bold shadow-xs transition-colors"
              >
                <span>Browse {category.name} Pros</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-title">
              Specialized Services Under {category.name}
            </h2>
            <p className="text-xs sm:text-sm text-muted mt-1">
              Select a specialized service to view certified pros and request
              quotes.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {services.length} Services Available
          </span>
        </div>

        {services.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center space-y-3">
            <Wrench className="h-10 w-10 text-slate-400 mx-auto" />
            <h3 className="font-display text-base font-bold text-title">
              No individual sub-services listed yet
            </h3>
            <p className="text-xs text-muted max-w-md mx-auto">
              You can still browse general {category.name} professionals and
              submit direct quote requests.
            </p>
            <Link
              href={`/browse-pros?category=${category.slug || category._id}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary text-white px-6 py-2.5 text-xs font-bold shadow-xs"
            >
              <span>Browse All {category.name} Pros</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const serviceImg = service.image
                ? getImageUrl(service.image)
                : null;

              return (
                <div
                  key={service._id}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs hover:shadow-lg hover:border-primary/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 mb-4">
                      {serviceImg ? (
                        <Image
                          src={serviceImg}
                          alt={service.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center bg-primary/5 text-primary">
                          <Wrench className="h-10 w-10 text-primary/60" />
                        </div>
                      )}
                    </div>

                    <h3 className="font-display text-base sm:text-lg font-bold text-title group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-copy line-clamp-2 leading-relaxed">
                      {service.description ||
                        `Professional ${service.name.toLowerCase()} provided by verified, background-screened craftsmen.`}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={`/browse-pros?service=${service._id}&trade=${encodeURIComponent(category.name)}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:underline"
                    >
                      <span>Find Pros for this Service</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
