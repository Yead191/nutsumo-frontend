"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Tag,
  ArrowRightLeft,
  CheckCircle2,
  Clock,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  User,
  MapPin,
  Briefcase,
  Layers,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/getImageUrl";
import {
  updatePortfolioItem,
  deletePortfolioItem,
} from "@/helpers/next-fetch/apiActions/artisanActions";
import { AddEditPortfolioModal } from "./AddEditPortfolioModal";
import type {
  PortfolioItem,
  PortfolioCategory,
  PortfolioArtisan,
  PortfolioImage,
} from "../types";

interface PortfolioDetailsViewProps {
  initialItem: PortfolioItem;
  categories: PortfolioCategory[];
}

export function PortfolioDetailsView({
  initialItem,
  categories,
}: PortfolioDetailsViewProps) {
  const router = useRouter();
  const [item, setItem] = useState<PortfolioItem>(initialItem);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showComparison, setShowComparison] = useState(false);

  // Edit & Delete modal states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const images: PortfolioImage[] = item.images || [];
  const activeImage = images[selectedImageIndex] || images[0];
  const activeImageUrl = activeImage
    ? getImageUrl(activeImage.url) || activeImage.url
    : "";

  const categoryName =
    typeof item.category === "object" && item.category !== null
      ? (item.category as PortfolioCategory).name
      : "General Craft";

  const artisan =
    typeof item.artisan === "object" && item.artisan !== null
      ? (item.artisan as PortfolioArtisan)
      : null;

  const beforeImage = images.find((img) => img.type === "before");
  const afterImage = images.find((img) => img.type === "after");
  const hasBeforeAfter = Boolean(beforeImage && afterImage);

  const formattedCompletedDate = item.completedAt
    ? new Date(item.completedAt).toLocaleDateString("en-US", {
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

  // Handle Edit Project
  const handleSaveEdit = async (formData: FormData): Promise<boolean> => {
    if (!item._id) return false;

    setIsSubmitting(true);
    try {
      const res = await updatePortfolioItem(item._id, formData);
      if (res?.success) {
        toast.success("Portfolio project updated successfully!");
        if (res.data) {
          setItem((prev) => ({ ...prev, ...(res.data || {}) }));
        }
        return true;
      } else {
        toast.error(res?.message || "Failed to update project");
        return false;
      }
    } catch {
      toast.error("Failed to update project");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Project
  const handleDelete = async () => {
    if (!item._id) return;

    setIsDeleting(true);
    try {
      const res = await deletePortfolioItem(item._id);
      if (res?.success) {
        toast.success("Project removed from your portfolio");
        router.push("/pro/portfolio");
        router.refresh();
      } else {
        toast.error(res?.message || "Failed to delete project");
      }
    } catch {
      toast.error("Failed to delete project");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/pro/portfolio"
          className="inline-flex items-center gap-2 text-xs font-bold text-muted hover:text-title transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Portfolio
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsEditOpen(true)}
            className="h-9 px-4 text-xs font-bold flex items-center gap-1.5"
          >
            <Edit3 className="h-3.5 w-3.5" />
            Edit Project
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowDeleteModal(true)}
            className="h-9 px-3 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50"
            title="Delete project"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="space-y-3 border-b border-line pb-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-bold">
            <Tag className="h-3.5 w-3.5" />
            {categoryName}
          </span>

          {item.isPublished ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-xs font-bold">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Published Showcase
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 text-xs font-bold">
              <Clock className="h-3.5 w-3.5 text-amber-600" />
              Draft (Private)
            </span>
          )}

          {formattedCompletedDate && (
            <span className="text-xs text-muted flex items-center gap-1 ml-auto font-medium">
              <Calendar className="h-3.5 w-3.5 text-muted" />
              Completed on {formattedCompletedDate}
            </span>
          )}
        </div>

        <h1 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-title">
          {item.title}
        </h1>
      </div>

      {/* Hero Visual Gallery Showcase */}
      <div className="space-y-4">
        {/* Comparison toggle if both Before & After photos exist */}
        {hasBeforeAfter && (
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Verified Transformation Available
            </span>
            <button
              type="button"
              onClick={() => setShowComparison(!showComparison)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-2xs ${
                showComparison
                  ? "bg-slate-900 text-white"
                  : "bg-white border border-line text-title hover:bg-slate-50"
              }`}
            >
              <ArrowRightLeft className="h-3.5 w-3.5" />
              {showComparison ? "Single Photo View" : "Side-by-Side Before & After"}
            </button>
          </div>
        )}

        {showComparison && beforeImage && afterImage ? (
          /* Side-by-Side Transformation View */
          <div className="grid gap-5 md:grid-cols-2">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 border border-rose-200 shadow-sm group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getImageUrl(beforeImage.url) || beforeImage.url}
                alt="Before Transformation"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-4 left-4 rounded-full bg-rose-600 px-3.5 py-1 text-xs font-bold text-white shadow-md">
                Before Transformation
              </span>
            </div>

            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 border border-emerald-200 shadow-sm group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getImageUrl(afterImage.url) || afterImage.url}
                alt="After Transformation"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-4 left-4 rounded-full bg-emerald-600 px-3.5 py-1 text-xs font-bold text-white shadow-md">
                Completed Result (After)
              </span>
            </div>
          </div>
        ) : (
          /* High-Definition Single Photo View with Smooth Navigation */
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-3xl overflow-hidden bg-slate-950 flex items-center justify-center shadow-md">
            {activeImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeImageUrl}
                alt={item.title}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-500">
                <Layers className="h-12 w-12 opacity-40 mb-2" />
                <span className="text-xs">No image available</span>
              </div>
            )}

            {/* Photo Stage Tag Badge */}
            {activeImage && (
              <span
                className={`absolute top-5 left-5 rounded-full px-3.5 py-1 text-xs font-bold text-white shadow-lg ${
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

            {/* Prev / Next Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 hover:scale-110 active:scale-95 transition"
                  title="Previous photo"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 hover:scale-110 active:scale-95 transition"
                  title="Next photo"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

                {/* Counter */}
                <div className="absolute bottom-4 right-4 rounded-full bg-black/70 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-white">
                  {selectedImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        )}

        {/* Thumbnail Selector Strip */}
        {images.length > 1 && !showComparison && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            {images.map((img, i) => {
              const thumbUrl = getImageUrl(img.url) || img.url;
              const isSelected = i === selectedImageIndex;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImageIndex(i)}
                  className={`relative h-20 w-28 shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${
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
                    className={`absolute bottom-0 inset-x-0 text-[10px] font-bold text-white text-center capitalize py-0.5 ${
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

      {/* Details & Execution Notes */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Scope & Description */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-line bg-white p-6 sm:p-8 shadow-2xs space-y-4">
            <h3 className="font-display text-lg font-bold text-title flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Project Scope & Execution Notes
            </h3>
            <p className="text-sm text-title whitespace-pre-line leading-relaxed">
              {item.description || "No project description provided."}
            </p>
          </div>
        </div>

        {/* Right Column: Artisan Identity & Metadata */}
        <div className="space-y-6">
          {artisan && (
            <div className="rounded-3xl border border-line bg-white p-6 shadow-2xs space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted">
                Craftsman & Verified Pro
              </h4>
              <div className="flex items-center gap-3.5">
                <div className="h-14 w-14 rounded-2xl overflow-hidden bg-slate-100 border border-line shrink-0">
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
                  <h4 className="text-base font-bold text-title">
                    {artisan.businessName || artisan.name}
                  </h4>
                  <p className="text-xs text-muted flex items-center gap-1.5 mt-0.5">
                    {artisan.trade && (
                      <span className="font-medium text-primary">
                        {artisan.trade}
                      </span>
                    )}
                    {artisan.location && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <MapPin className="h-3 w-3" />
                          {artisan.location}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats Card */}
          <div className="rounded-3xl border border-line bg-slate-50/70 p-6 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">Total Project Photos</span>
              <strong className="text-title font-bold">
                {images.length} Photos
              </strong>
            </div>
            <div className="flex items-center justify-between text-xs border-t border-line/60 pt-2.5">
              <span className="text-muted">Service Category</span>
              <strong className="text-title font-bold">{categoryName}</strong>
            </div>
            {formattedCompletedDate && (
              <div className="flex items-center justify-between text-xs border-t border-line/60 pt-2.5">
                <span className="text-muted">Completion Date</span>
                <strong className="text-title font-bold">
                  {formattedCompletedDate}
                </strong>
              </div>
            )}
            <div className="flex items-center justify-between text-xs border-t border-line/60 pt-2.5">
              <span className="text-muted">Showcase Status</span>
              <strong
                className={`font-bold ${
                  item.isPublished ? "text-emerald-600" : "text-amber-600"
                }`}
              >
                {item.isPublished ? "Published" : "Draft"}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AddEditPortfolioModal
        isOpen={isEditOpen}
        editingItem={item}
        categories={categories}
        isSubmitting={isSubmitting}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSaveEdit}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !isDeleting && setShowDeleteModal(false)}
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-line bg-white p-6 sm:p-8 shadow-2xl z-10 space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-8 ring-rose-50">
              <Trash2 className="h-6 w-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-display text-lg font-bold text-title">
                Delete Portfolio Project?
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Are you sure you want to delete &ldquo;
                <strong className="text-title">{item.title}</strong>
                &rdquo;? All uploaded photos and project records will be permanently removed.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-line">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="text-xs font-bold"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-5 flex items-center gap-1.5"
              >
                {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {isDeleting ? "Deleting..." : "Delete Project"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
