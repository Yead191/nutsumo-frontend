"use client";

import {
  Wrench,
  Clock,
  ArrowRight,
  Sparkles,
  Banknote,
  CheckCircle2,
} from "lucide-react";
import type { IArtisanServiceItem } from "@/helpers/next-fetch/apiActions/marketplaceActions";

interface ArtisanServicesCatalogProps {
  services: IArtisanServiceItem[];
  onRequestServiceQuote: (serviceId: string, serviceName: string) => void;
  onRequestGeneralQuote: () => void;
}

export function ArtisanServicesCatalog({
  services,
  onRequestServiceQuote,
  onRequestGeneralQuote,
}: ArtisanServicesCatalogProps) {
  if (!services || services.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center space-y-4">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Wrench className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-display text-base font-bold text-title">
            Direct Custom Quotes Available
          </h3>
          <p className="text-xs sm:text-sm text-muted max-w-md mx-auto">
            This artisan accepts custom job inquiries tailored to your exact
            repair and maintenance needs.
          </p>
        </div>
        <button
          type="button"
          onClick={onRequestGeneralQuote}
          className="inline-flex items-center gap-2 rounded-full bg-primary hover:bg-primary-hover text-white px-5 py-2.5 text-xs font-bold shadow-xs cursor-pointer transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Request Custom Quote</span>
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h2 className="font-display text-lg sm:text-xl font-bold text-title flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            <span>Services & Pricing Catalog</span>
          </h2>
          <p className="text-xs text-muted mt-1">
            Choose a specific service below to request an exact tailored
            quotation.
          </p>
        </div>

        <button
          type="button"
          onClick={onRequestGeneralQuote}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline self-start sm:self-auto cursor-pointer"
        >
          <span>Have a custom need? Click here</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((serviceItem) => {
          const serviceName =
            serviceItem.service?.name ||
            serviceItem.customName ||
            "Professional Artisan Service";
          const rateFormatted = `GH₵ ${serviceItem.rateAmount}`;
          const rateTypeLabel =
            serviceItem.rateType?.toLowerCase() === "hourly"
              ? "/ hr"
              : serviceItem.rateType?.toLowerCase() === "daily"
                ? "/ day"
                : " fixed";

          return (
            <div
              key={serviceItem._id}
              className="group rounded-2xl border border-slate-200/80 hover:border-primary/40 p-5 bg-white hover:bg-slate-50/50 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-base font-bold text-title group-hover:text-primary transition-colors">
                    {serviceName}
                  </h3>
                  <div className="text-right shrink-0">
                    <span className="font-display font-black text-primary text-base">
                      {rateFormatted}
                    </span>
                    <span className="text-[11px] text-muted block -mt-0.5">
                      {rateTypeLabel}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-copy line-clamp-2 leading-relaxed">
                  {serviceItem.description ||
                    `Specialized ${serviceName.toLowerCase()} performed with premium tools, strict quality assurance, and clean job completion.`}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Escrow Guaranteed</span>
                </span>

                <button
                  type="button"
                  onClick={() =>
                    onRequestServiceQuote(
                      serviceItem.service?._id || serviceItem._id,
                      serviceName,
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 hover:bg-primary text-white px-4 py-1.5 text-xs font-bold transition-all transform active:scale-95 cursor-pointer shadow-2xs"
                >
                  <span>Request Quote</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
