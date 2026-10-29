"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Tag,
  ArrowRightLeft,
  CheckCircle2,
  Clock,
  Edit3,
  ChevronLeft,
  ChevronRight,
  User,
  MapPin,
  Briefcase,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/getImageUrl";
import { getSinglePortfolioItem } from "@/helpers/next-fetch/apiActions/artisanActions";
import type {
  PortfolioItem,
  PortfolioCategory,
  PortfolioArtisan,
  PortfolioImage,
} from "../types";

interface ViewPortfolioModalProps {
  item: PortfolioItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (item: PortfolioItem) => void;
}

export function ViewPortfolioModal({
  item,
  isOpen,
  onClose,
  onEdit,
}: ViewPortfolioModalProps) {
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(item);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showComparison, setShowComparison] = useState(false);

  // Sync item and fetch full details if available
  useEffect(() => {
    if (item) {
      setActiveItem(item);
      setSelectedImageIndex(0);
      setShowComparison(false);

      if (item._id) {
        getSinglePortfolioItem(item._id).then((res) => {
          if (res?.success && res.data) {
            setActiveItem(res.data);
          }
        });
      }
    }
  }, [item]);

  if (!isOpen || !activeItem) return null;

  const images: PortfolioImage[] = activeItem.images || [];
  const activeImage = images[selectedImageIndex] || images[0];
  const activeImageUrl = activeImage
    ? getImageUrl(activeImage.url) || activeImage.url
    : "";

  const categoryName =
    typeof activeItem.category === "object" && activeItem.category !== null
      ? (activeItem.category as PortfolioCategory).name
      : "General Craft";

  const artisan =
    typeof activeItem.artisan === "object" && activeItem.artisan !== null
      ? (activeItem.artisan as PortfolioArtisan)
      : null;

  const beforeImage = images.find((img) => img.type === "before");
  const afterImage = images.find((img) => img.type === "after");
  const hasBeforeAfter = Boolean(beforeImage && afterImage);

  const formattedCompletedDate = activeItem.completedAt
    ? new Date(activeItem.completedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-line bg-white shadow-2xl z-10 my-8">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-line px-6 py-4 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-bold">
              <Tag className="h-3.5 w-3.5" />
              {categoryName}
            </span>

            {activeItem.isPublished ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Published
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 text-xs font-bold">
                <Clock className="h-3.5 w-3.5 text-amber-600" />
                Draft
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                onClose();
                onEdit(activeItem);
              }}
              className="text-xs font-bold h-8 px-3 flex items-center gap-1.5"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit Project
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-muted hover:bg-slate-200 hover:text-title transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="max-h-[calc(85vh-80px)] overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* Main Visual Display */}
          <div className="space-y-4">
            {/* Compare Toggle if Before & After exists */}
            {hasBeforeAfter && (
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setShowComparison(!showComparison)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                    showComparison
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-title hover:bg-slate-200"
                  }`}
                >
                  <ArrowRightLeft className="h-3.5 w-3.5" />
                  {showComparison ? "Single View" : "Side-by-Side Comparison"}
                </button>
              </div>
            )}

            {showComparison && beforeImage && afterImage ? (
              /* Before & After Side-by-Side */
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-rose-200 shadow-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getImageUrl(beforeImage.url) || beforeImage.url}
                    alt="Before"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-rose-600 px-3 py-1 text-xs font-bold text-white shadow-md">
                    Before
                  </span>
                </div>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-emerald-200 shadow-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getImageUrl(afterImage.url) || afterImage.url}
                    alt="After"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-md">
                    After
                  </span>
                </div>
              </div>
            ) : (
              /* Single Photo Showcase with Navigation */
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
                {activeImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={activeImageUrl}
                    alt={activeItem.title}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-500">
                    <Layers className="h-12 w-12 opacity-40 mb-2" />
                    <span className="text-xs">No image available</span>
                  </div>
                )}

                {/* Photo Tag Badge */}
                {activeImage && (
                  <span
                    className={`absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-bold text-white shadow-md ${
                      activeImage.type === "before"
                        ? "bg-rose-600"
                        : activeImage.type === "after"
                          ? "bg-emerald-600"
                          : "bg-blue-600"
                    }`}
                  >
                    {activeImage.type === "before"
                      ? "Before Photo"
                      : activeImage.type === "after"
                        ? "After Photo"
                        : "Work Sample"}
                  </span>
                )}

                {/* Prev / Next Arrows if > 1 images */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 hover:scale-110 active:scale-95 transition"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 hover:scale-110 active:scale-95 transition"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>

                    {/* Image Counter */}
                    <div className="absolute bottom-3 right-3 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white">
                      {selectedImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Thumbnail Navigation Row */}
            {images.length > 1 && !showComparison && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {images.map((img, i) => {
                  const thumbUrl = getImageUrl(img.url) || img.url;
                  const isSelected = i === selectedImageIndex;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedImageIndex(i)}
                      className={`relative h-16 w-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                        isSelected
                          ? "border-primary ring-2 ring-primary/20 scale-105"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumbUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                      <span
                        className={`absolute bottom-0 inset-x-0 text-[9px] font-bold text-white text-center ${
                          img.type === "before"
                            ? "bg-rose-600/90"
                            : img.type === "after"
                              ? "bg-emerald-600/90"
                              : "bg-blue-600/90"
                        }`}
                      >
                        {img.type}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Title & Metadata */}
          <div className="space-y-4">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-title">
                {activeItem.title}
              </h2>

              {formattedCompletedDate && (
                <p className="text-xs sm:text-sm text-muted flex items-center gap-1.5 mt-1 font-medium">
                  <Calendar className="h-4 w-4 text-primary" />
                  Completed on {formattedCompletedDate}
                </p>
              )}
            </div>

            {/* Full Craftsmanship Description */}
            <div className="rounded-2xl bg-slate-50/80 border border-line p-5 sm:p-6 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted">
                Project Scope & Execution Notes
              </h4>
              <p className="text-sm text-title whitespace-pre-line leading-relaxed">
                {activeItem.description || "No project description provided."}
              </p>
            </div>
          </div>

          {/* Artisan Profile Card (if populated) */}
          {artisan && (
            <div className="rounded-2xl border border-line bg-white p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl overflow-hidden bg-slate-100 border border-line shrink-0">
                  {artisan.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getImageUrl(artisan.image) || artisan.image}
                      alt={artisan.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted">
                      <User className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-title">
                    {artisan.businessName || artisan.name}
                  </h4>
                  <p className="text-xs text-muted flex items-center gap-2">
                    {artisan.trade && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3 text-primary" />
                        {artisan.trade}
                      </span>
                    )}
                    {artisan.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted" />
                        {artisan.location}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {artisan.email && (
                <span className="text-xs text-muted hidden sm:inline-block">
                  {artisan.email}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
