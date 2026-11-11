"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  Layers,
  Maximize2,
  Calendar,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Columns,
} from "lucide-react";
import { getImageUrl } from "@/lib/getImageUrl";
import type { IPortfolioItem } from "@/helpers/next-fetch/apiActions/marketplaceActions";

interface ArtisanPortfolioShowcaseProps {
  portfolio: IPortfolioItem[];
}

interface NormalizedImage {
  url: string;
  type: "before" | "after" | "work" | string;
}

function getPortfolioImages(item: IPortfolioItem) {
  const rawList = Array.isArray(item.images) ? item.images : [];
  const normalized: NormalizedImage[] = [];

  rawList.forEach((entry: any) => {
    if (typeof entry === "string" && entry.trim()) {
      normalized.push({ url: entry.trim(), type: "work" });
    } else if (entry && typeof entry.url === "string" && entry.url.trim()) {
      normalized.push({
        url: entry.url.trim(),
        type: (entry.type || "work").toLowerCase(),
      });
    }
  });

  const beforeObj =
    normalized.find((img) => img.type === "before") ||
    (item.beforeImage ? { url: item.beforeImage, type: "before" } : null);

  const afterObj =
    normalized.find((img) => img.type === "after") ||
    (item.afterImage ? { url: item.afterImage, type: "after" } : null);

  const workObj = normalized.find((img) => img.type === "work");

  const hasBeforeAfter = Boolean(beforeObj?.url && afterObj?.url);

  // Preferred primary card image: 'after', then 'work', then 'before', then first available
  const primaryUrl =
    afterObj?.url || workObj?.url || beforeObj?.url || normalized[0]?.url || null;

  return {
    normalized,
    beforeUrl: beforeObj?.url || null,
    afterUrl: afterObj?.url || null,
    workUrl: workObj?.url || null,
    primaryUrl,
    hasBeforeAfter,
  };
}

export function ArtisanPortfolioShowcase({
  portfolio,
}: ArtisanPortfolioShowcaseProps) {
  const [selectedItem, setSelectedItem] = useState<IPortfolioItem | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isSideBySideView, setIsSideBySideView] = useState<boolean>(false);

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

  const openModal = (item: IPortfolioItem) => {
    const data = getPortfolioImages(item);
    setSelectedItem(item);
    setIsSideBySideView(false);

    // Default to the 'after' image or first image
    const afterIdx = data.normalized.findIndex((img) => img.type === "after");
    setActiveImageIndex(afterIdx >= 0 ? afterIdx : 0);
  };

  const selectedData = selectedItem ? getPortfolioImages(selectedItem) : null;
  const currentImage = selectedData?.normalized[activeImageIndex] || null;

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h2 className="font-display text-lg sm:text-xl font-bold text-title flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <span>Past Projects &amp; Before / After Showcase</span>
          </h2>
          <p className="text-xs text-muted mt-1">
            Real craftsmanship and verified project transformations in Ghana.
          </p>
        </div>
        <span className="text-xs font-semibold text-muted bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
          {portfolio.length} Showcase {portfolio.length === 1 ? "Project" : "Projects"}
        </span>
      </div>

      {/* 2-COLUMN CARDS GRID (as requested: grid col-2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {portfolio.map((item) => {
          const { hasBeforeAfter, beforeUrl, afterUrl, primaryUrl, normalized } =
            getPortfolioImages(item);
          const beforeImg = beforeUrl ? getImageUrl(beforeUrl) : null;
          const afterImg = afterUrl ? getImageUrl(afterUrl) : null;
          const primaryImg = primaryUrl ? getImageUrl(primaryUrl) : null;

          return (
            <div
              key={item._id}
              className="group rounded-3xl border border-slate-200/80 hover:border-primary/40 bg-white overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              {/* IMAGE SHOWCASE AREA */}
              {hasBeforeAfter && beforeImg && afterImg ? (
                /* INITIALLY SHOW BEFORE & AFTER COMPARISON SIDE-BY-SIDE */
                <div
                  onClick={() => openModal(item)}
                  className="relative h-60 sm:h-68 w-full bg-slate-100 overflow-hidden cursor-pointer select-none group/img"
                  title="Click to view full comparison &amp; work photos"
                >
                  <div className="grid grid-cols-2 h-full w-full relative">
                    {/* Left: BEFORE Image */}
                    <div className="relative h-full w-full overflow-hidden border-r-2 border-white">
                      <Image
                        src={beforeImg}
                        alt={`${item.title} - Before`}
                        fill
                        className="object-cover group-hover/img:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover/img:bg-transparent transition-colors" />
                      <span className="absolute bottom-3 left-3 rounded-full bg-black/80 backdrop-blur-xs text-white text-[10px] font-black px-2.5 py-1 tracking-wider uppercase shadow-md border border-white/20">
                        BEFORE
                      </span>
                    </div>

                    {/* Right: AFTER Image */}
                    <div className="relative h-full w-full overflow-hidden">
                      <Image
                        src={afterImg}
                        alt={`${item.title} - After`}
                        fill
                        className="object-cover group-hover/img:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-emerald-950/15 group-hover/img:bg-transparent transition-colors" />
                      <span className="absolute bottom-3 right-3 rounded-full bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-black px-2.5 py-1 tracking-wider uppercase shadow-md border border-white/20 flex items-center gap-1">
                        <Sparkles className="h-2.5 w-2.5 text-amber-300" />
                        AFTER ✨
                      </span>
                    </div>

                    {/* Center Split Comparison Pill */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full bg-white text-title shadow-lg border border-slate-200 pointer-events-none group-hover/img:scale-110 transition-transform">
                      <span className="text-xs font-black">↔</span>
                    </div>
                  </div>

                  {/* Top Left Badge */}
                  <span className="absolute top-3 left-3 rounded-full bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <Sparkles className="h-3 w-3 text-amber-300" />
                    Before &amp; After Comparison
                  </span>

                  {/* Maximize Icon */}
                  <div className="absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-title shadow-sm opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-white">
                    <Maximize2 className="h-4 w-4" />
                  </div>
                </div>
              ) : (
                /* SINGLE PHOTO OR WORK SHOWCASE */
                <div
                  onClick={() => openModal(item)}
                  className="relative h-60 sm:h-68 w-full bg-slate-100 overflow-hidden cursor-pointer group/img"
                  title="Click to view project details"
                >
                  {primaryImg ? (
                    <Image
                      src={primaryImg}
                      alt={item.title}
                      fill
                      className="object-cover group-hover/img:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-full w-full grid place-items-center bg-slate-100 text-slate-400">
                      <Layers className="h-10 w-10" />
                    </div>
                  )}

                  <span className="absolute bottom-3 left-3 rounded-full bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider">
                    {normalized[0]?.type?.toUpperCase() || "PROJECT WORK"}
                  </span>

                  <div className="absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-title shadow-sm opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-white">
                    <Maximize2 className="h-4 w-4" />
                  </div>
                </div>
              )}

              {/* CARD DETAILS */}
              <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-base sm:text-lg font-bold text-title group-hover:text-primary transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <span className="text-[11px] font-semibold text-muted bg-slate-100 px-2.5 py-0.5 rounded-full shrink-0">
                      {normalized.length} {normalized.length === 1 ? "Photo" : "Photos"}
                    </span>
                  </div>

                  {item.description && (
                    <p className="text-xs sm:text-sm text-copy line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {/* Thumbnail Tags Preview */}
                  {normalized.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1">
                      {normalized.map((img, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600"
                        >
                          {img.type}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Strip */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-muted">
                  <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Completed &amp; Signed Off</span>
                  </span>

                  {item.completedAt && (
                    <span className="flex items-center gap-1 text-slate-500">
                      <Calendar className="h-3 w-3" />
                      {new Date(item.completedAt).toLocaleDateString(undefined, {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* INTERACTIVE LIGHTBOX MODAL WITH FULL WORK / BEFORE / AFTER PHOTO SUPPORT */}
      {selectedItem && selectedData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl rounded-3xl bg-white p-5 sm:p-7 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-title">
                  {selectedItem.title}
                </h3>
                {selectedItem.description && (
                  <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
                    {selectedItem.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer shrink-0 ml-3"
                title="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* DYNAMIC VIEW MODE & PHOTO TYPE SWITCHER */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              {/* Type Switcher Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedData.normalized.map((img, idx) => {
                  const isActive = !isSideBySideView && activeImageIndex === idx;
                  const label =
                    img.type === "before"
                      ? "Before State"
                      : img.type === "after"
                        ? "After Completion ✨"
                        : "Work / Progress";

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setIsSideBySideView(false);
                        setActiveImageIndex(idx);
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? img.type === "after"
                            ? "bg-emerald-600 text-white shadow-xs"
                            : img.type === "before"
                              ? "bg-slate-900 text-white shadow-xs"
                              : "bg-primary text-white shadow-xs"
                          : "bg-slate-100 text-muted hover:text-title hover:bg-slate-200"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}

                {/* Side-by-Side Dual View Option (when before & after exist) */}
                {selectedData.hasBeforeAfter && (
                  <button
                    type="button"
                    onClick={() => setIsSideBySideView(!isSideBySideView)}
                    className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isSideBySideView
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                    }`}
                  >
                    <Columns className="h-3.5 w-3.5" />
                    <span>Side-by-Side ↔</span>
                  </button>
                )}
              </div>

              {/* Photos Counter */}
              <span className="text-xs font-semibold text-muted">
                {isSideBySideView
                  ? "Comparing Before & After"
                  : `Photo ${activeImageIndex + 1} of ${selectedData.normalized.length}`}
              </span>
            </div>

            {/* MAIN PHOTO DISPLAY AREA */}
            {isSideBySideView && selectedData.hasBeforeAfter ? (
              /* DUAL SIDE-BY-SIDE IN MODAL */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-72 sm:h-96 w-full">
                {/* Before */}
                <div className="relative h-full w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                  <Image
                    src={getImageUrl(selectedData.beforeUrl!)!}
                    alt="Before"
                    fill
                    className="object-contain"
                  />
                  <span className="absolute bottom-3 left-3 rounded-full bg-black/80 text-white text-[10px] font-black px-3 py-1 uppercase">
                    BEFORE
                  </span>
                </div>

                {/* After */}
                <div className="relative h-full w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                  <Image
                    src={getImageUrl(selectedData.afterUrl!)!}
                    alt="After"
                    fill
                    className="object-contain"
                  />
                  <span className="absolute bottom-3 right-3 rounded-full bg-emerald-600 text-white text-[10px] font-black px-3 py-1 uppercase flex items-center gap-1">
                    <Sparkles className="h-2.5 w-2.5 text-amber-300" />
                    AFTER ✨
                  </span>
                </div>
              </div>
            ) : (
              /* SINGLE HIGH-RES DISPLAY WITH PREV/NEXT ARROWS */
              <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
                {currentImage ? (
                  <>
                    <Image
                      src={getImageUrl(currentImage.url)!}
                      alt={selectedItem.title}
                      fill
                      className="object-contain"
                    />

                    {/* Floating Label */}
                    <span
                      className={`absolute bottom-3 left-3 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md ${
                        currentImage.type === "after"
                          ? "bg-emerald-600"
                          : currentImage.type === "before"
                            ? "bg-slate-900/90"
                            : "bg-primary"
                      }`}
                    >
                      {currentImage.type === "after"
                        ? "AFTER COMPLETION ✨"
                        : currentImage.type === "before"
                          ? "BEFORE STATE"
                          : "WORK / IN-PROGRESS"}
                    </span>

                    {/* Left & Right Arrow Navigation */}
                    {selectedData.normalized.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setActiveImageIndex((prev) =>
                              prev > 0 ? prev - 1 : selectedData.normalized.length - 1
                            )
                          }
                          className="absolute left-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-black/60 hover:bg-black/85 text-white transition-colors cursor-pointer shadow-md"
                          title="Previous photo"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setActiveImageIndex((prev) =>
                              prev < selectedData.normalized.length - 1 ? prev + 1 : 0
                            )
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-black/60 hover:bg-black/85 text-white transition-colors cursor-pointer shadow-md"
                          title="Next photo"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="text-slate-400 text-xs">No image available</div>
                )}
              </div>
            )}

            {/* BOTTOM THUMBNAILS (Exact design matching user screenshot) */}
            {selectedData.normalized.length > 1 && (
              <div className="pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted font-display block mb-2">
                  All Project Photos (Click to view):
                </span>
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {selectedData.normalized.map((img, idx) => {
                    const thumbUrl = getImageUrl(img.url);
                    const isCurrent = !isSideBySideView && activeImageIndex === idx;

                    return thumbUrl ? (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setIsSideBySideView(false);
                          setActiveImageIndex(idx);
                        }}
                        className={`group relative h-20 w-20 rounded-2xl overflow-hidden shrink-0 transition-all cursor-pointer shadow-xs ${
                          isCurrent
                            ? "ring-3 ring-rose-500 border-2 border-white scale-105"
                            : "border-2 border-slate-200 opacity-70 hover:opacity-100 hover:scale-102"
                        }`}
                      >
                        <Image
                          src={thumbUrl}
                          alt={`${img.type} thumbnail`}
                          fill
                          className="object-cover"
                        />

                        {/* Dark Gradient Label (BEFORE / WORK / AFTER) */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent pt-3 pb-1">
                          <span className="block text-[10px] font-black text-white uppercase text-center tracking-wider">
                            {img.type}
                          </span>
                        </div>
                      </button>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
