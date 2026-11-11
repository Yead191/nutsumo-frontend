"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  Layers,
  ArrowRight,
  Maximize2,
  Calendar,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { getImageUrl } from "@/lib/getImageUrl";
import type { IPortfolioItem } from "@/helpers/next-fetch/apiActions/marketplaceActions";

interface ArtisanPortfolioShowcaseProps {
  portfolio: IPortfolioItem[];
}

export function ArtisanPortfolioShowcase({
  portfolio,
}: ArtisanPortfolioShowcaseProps) {
  const [selectedItem, setSelectedItem] = useState<IPortfolioItem | null>(null);
  const [activeTab, setActiveTab] = useState<"after" | "before">("after");

  if (!portfolio || portfolio.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center space-y-3">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Layers className="h-6 w-6" />
        </div>
        <h3 className="font-display text-base font-bold text-title">
          Portfolio Projects Being Added
        </h3>
        <p className="text-xs sm:text-sm text-muted max-w-md mx-auto">
          This artisan is actively completing verified customer jobs under
          Nutsumo escrow. Customer project photos will be published here upon
          client sign-off.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h2 className="font-display text-lg sm:text-xl font-bold text-title flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <span>Past Projects & Before / After Showcase</span>
          </h2>
          <p className="text-xs text-muted mt-1">
            Real craftsmanship from previous verified clients in Ghana.
          </p>
        </div>
        <span className="text-xs font-semibold text-muted bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
          {portfolio.length} Showcase{" "}
          {portfolio.length === 1 ? "Project" : "Projects"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolio.map((item) => {
          const hasBeforeAfter = Boolean(item.beforeImage && item.afterImage);
          const primaryImage =
            item.afterImage || item.images?.[0] || item.beforeImage;
          const imgUrl = primaryImage ? getImageUrl(primaryImage) : null;

          return (
            <div
              key={item._id}
              className="group rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                {imgUrl ? (
                  <Image
                    src={imgUrl}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="h-full w-full grid place-items-center bg-slate-100 text-slate-400">
                    <Layers className="h-8 w-8" />
                  </div>
                )}

                {hasBeforeAfter && (
                  <span className="absolute top-2.5 left-2.5 rounded-full bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="h-2.5 w-2.5 text-amber-300" />
                    Before & After
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setSelectedItem(item);
                    setActiveTab("after");
                  }}
                  className="absolute bottom-2.5 right-2.5 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-title shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white cursor-pointer"
                  title="View project details"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-sm sm:text-base font-bold text-title line-clamp-1 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-muted line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-muted">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle2 className="h-3 w-3" />
                    Completed & Signed Off
                  </span>

                  {item.completedAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      {new Date(item.completedAt).toLocaleDateString(
                        undefined,
                        {
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox / Before-After Comparison Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-title">
                  {selectedItem.title}
                </h3>
                {selectedItem.description && (
                  <p className="text-xs text-muted mt-0.5">
                    {selectedItem.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Before vs After Switcher */}
            {selectedItem.beforeImage && selectedItem.afterImage && (
              <div className="flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("before")}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "before"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-muted hover:text-title"
                  }`}
                >
                  Before State
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("after")}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "after"
                      ? "bg-primary text-white"
                      : "bg-slate-100 text-muted hover:text-title"
                  }`}
                >
                  After Completion ✨
                </button>
              </div>
            )}

            <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden bg-slate-100">
              {(() => {
                const imgSource =
                  activeTab === "before" && selectedItem.beforeImage
                    ? selectedItem.beforeImage
                    : selectedItem.afterImage ||
                      selectedItem.images?.[0] ||
                      selectedItem.beforeImage;
                const modalUrl = imgSource ? getImageUrl(imgSource) : null;

                return modalUrl ? (
                  <Image
                    src={modalUrl}
                    alt={selectedItem.title}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="h-full w-full grid place-items-center text-slate-400">
                    No image available
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
