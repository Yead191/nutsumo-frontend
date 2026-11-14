"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  Upload,
  MapPin,
  ShieldCheck,
  Loader2,
  Trash2,
  LogIn,
} from "lucide-react";
import { toast } from "sonner";
import { createJobAction } from "@/helpers/next-fetch/apiActions/jobActions";
import { getImageUrl } from "@/lib/getImageUrl";
import type { QuoteViewer } from "@/lib/quoteViewer";
import type { ICategoryItem } from "@/helpers/next-fetch/apiActions/marketplaceActions";

interface DirectQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  artisan: {
    _id?: string;
    user?: {
      _id?: string;
      id?: string;
      name?: string;
      image?: string;
      verified?: boolean;
      trade?: string;
      location?: string;
    };
    trade?: string;
    businessName?: string;
    location?: string;
  };
  categories?: ICategoryItem[];
  preselectedServiceId?: string;
  preselectedServiceName?: string;
  viewer?: QuoteViewer | null;
}

export function DirectQuoteModal({
  isOpen,
  onClose,
  artisan,
  categories = [],
  preselectedServiceId,
  preselectedServiceName,
  viewer = null,
}: DirectQuoteModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [location, setLocation] = useState("");
  const [postCode, setPostCode] = useState("");
  const [budget, setBudget] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [returnTo, setReturnTo] = useState("/");

  // Auto-match category if artisan has a matching trade
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      const proTrade = (artisan.trade || artisan.user?.trade || "").toLowerCase();
      const matched = categories.find((c) =>
        proTrade.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(proTrade)
      );
      if (matched) setSelectedCategory(matched._id);
      else setSelectedCategory(categories[0]._id);
    }
  }, [categories, artisan, selectedCategory]);

  useEffect(() => {
    if (!isOpen || typeof window === "undefined") return;
    setReturnTo(`${window.location.pathname}${window.location.search}`);
  }, [isOpen]);

  if (!isOpen) return null;

  const artisanUser = artisan.user || {};
  const artisanName = artisanUser.name || artisan.businessName || "Verified Pro";
  const artisanAvatar = artisanUser.image ? getImageUrl(artisanUser.image) : null;
  const artisanTrade = artisan.trade || artisanUser.trade || "Specialist";
  const artisanUserId = artisanUser._id || artisanUser.id || artisan._id;
  const isOwnProfile = Boolean(viewer?.id && artisanUserId && viewer.id === artisanUserId);

  if (!viewer) {
    return (
      <QuoteAccessDialog
        onClose={onClose}
        title="Sign in to request a quote"
        body={`Log in with a customer account and you can send this request to ${artisanName}. You will come back to this page.`}
        primaryHref={`/login?redirect=${encodeURIComponent(returnTo)}`}
        primaryLabel="Log in"
        secondaryHref="/signup"
        secondaryLabel="Create account"
      />
    );
  }

  if (viewer.role !== "USER") {
    return (
      <QuoteAccessDialog
        onClose={onClose}
        title="Customer accounts send quotes"
        body="This login is a professional account. Quote requests are sent from a customer account, then the pro replies with a price."
        primaryHref={viewer.role === "ARTISAN" ? "/pro" : undefined}
        primaryLabel="Go to your dashboard"
      />
    );
  }

  if (isOwnProfile) {
    return (
      <QuoteAccessDialog
        onClose={onClose}
        title="This is your profile"
        body="Customers request quotes from this page. Open your dashboard to reply when a request arrives."
        primaryHref="/pro"
        primaryLabel="Open dashboard"
      />
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const combined = [...selectedFiles, ...files].slice(0, 8); // Max 8 files
    setSelectedFiles(combined);

    const previews = combined.map((file) => URL.createObjectURL(file));
    setFilePreviews(previews);
  };

  const removeFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);

    const updatedPreviews = filePreviews.filter((_, i) => i !== index);
    setFilePreviews(updatedPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || title.length < 5) {
      toast.error("Please enter a descriptive project title (at least 5 characters).");
      return;
    }

    if (!description.trim() || description.length < 10) {
      toast.error("Please describe your project needs in detail (at least 10 characters).");
      return;
    }

    if (!location.trim()) {
      toast.error("Please provide your task location or address.");
      return;
    }

    if (!artisanUserId) {
      toast.error("Unable to identify target artisan.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("location", location.trim());
      if (postCode.trim()) formData.append("postCode", postCode.trim());
      if (budget && Number(budget) > 0) formData.append("budget", String(Number(budget)));
      if (preferredDate) formData.append("preferredDate", new Date(preferredDate).toISOString());
      if (selectedCategory) formData.append("category", selectedCategory);
      if (preselectedServiceId) formData.append("service", preselectedServiceId);

      // PIN DIRECTLY TO THIS ARTISAN
      formData.append("selectedArtisan", artisanUserId);

      // Append images
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      const res = await createJobAction(formData);

      if (res.success) {
        toast.success(
          `Custom quote request sent to ${artisanName}! 🎉 Escrow milestone protection is active.`
        );
        onClose();
      } else {
        toast.error(res.message || "Failed to submit custom quote inquiry.");
      }
    } catch {
      toast.error("An error occurred while submitting your inquiry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={!isSubmitting ? onClose : undefined}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto my-auto">
        {/* Close Button */}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onClose}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-title transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* PINNED ARTISAN HEADER */}
        <div className="rounded-2xl bg-primary/5 p-4 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0">
              {artisanAvatar ? (
                <Image
                  src={artisanAvatar}
                  alt={artisanName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center bg-primary/10 text-primary font-bold text-base font-display">
                  {artisanName.charAt(0)}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-display text-base font-bold text-title">
                  {artisanName}
                </h3>
                {artisanUser.verified !== false && (
                  <span title="Verified Pro" className="inline-flex items-center">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  </span>
                )}
              </div>
              <p className="text-xs text-primary font-semibold">
                {artisanTrade} · Direct Quote Request
              </p>
            </div>
          </div>

          <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Escrow Protected</span>
          </div>
        </div>

        {/* FORM TITLE */}
        <div className="mb-5">
          <h2 className="font-display text-xl font-bold text-title">
            Request a Custom Quote
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Describe your project details. {artisanName} will review and reply with a tailored price proposal.
          </p>
        </div>

        {/* SUBMISSION FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Project Title */}
          <div>
            <label className="block font-bold text-title mb-1">
              Project Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master bathroom pipe leak repair"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-title placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Category Select (if not preselected) */}
          {categories.length > 0 && (
            <div>
              <label className="block font-bold text-title mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-title focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Service Name Highlight if preselected */}
          {preselectedServiceName && (
            <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-muted">Target Service:</span>
              <strong className="text-primary font-bold">{preselectedServiceName}</strong>
            </div>
          )}

          {/* Project Description */}
          <div>
            <label className="block font-bold text-title mb-1">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the problem, requirements, timeline, or any specific materials needed..."
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs sm:text-sm text-title placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary leading-relaxed"
            />
          </div>

          {/* Location & Postcode Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-title mb-1">
                Location / Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Accra, East Legon"
                  className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-xs text-title focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-title mb-1">
                Postcode / Postal Area
              </label>
              <input
                type="text"
                value={postCode}
                onChange={(e) => setPostCode(e.target.value)}
                placeholder="e.g. 00233"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-title focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          {/* Target Date & Estimated Budget Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-title mb-1">
                Preferred Schedule Date
              </label>
              <input
                type="datetime-local"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-title focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-bold text-title mb-1">
                Estimated Budget Expectation (GH₵)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">GH₵</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. 150 (Optional)"
                  className="w-full rounded-xl border border-slate-200 bg-white pl-12 pr-3 py-2 text-xs text-title focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Photo Upload Section */}
          <div>
            <label className="block font-bold text-title mb-1">
              Upload Photos of the Issue (Up to 8)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="rounded-2xl border-2 border-dashed border-slate-200 p-4 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
            >
              <Upload className="h-5 w-5 text-slate-400 mx-auto mb-1" />
              <span className="text-xs text-muted block font-medium">
                Click to attach photos of the workspace or issue
              </span>
              <span className="text-[10px] text-slate-400">PNG, JPG, WEBP up to 5MB each</span>
            </div>

            {/* Thumbnail previews */}
            {filePreviews.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {filePreviews.map((src, i) => (
                  <div key={i} className="relative h-14 w-14 rounded-lg overflow-hidden border border-slate-200 group">
                    <Image src={src} alt="Upload preview" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Escrow Notice */}
          <div className="rounded-xl bg-blue-50/70 p-3 border border-blue-100 text-[11px] text-blue-950 flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>100% Escrow Protected:</strong> You are under no obligation until you review and accept the official quotation sent by {artisanName}. Funds are held in escrow only after your agreement.
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-title hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary-hover text-white px-7 py-2.5 text-xs font-bold shadow-md transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting Inquiry...</span>
                </>
              ) : (
                <span>Send Custom Quote Request</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function QuoteAccessDialog({
  onClose,
  title,
  body,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  onClose: () => void;
  title: string;
  body: string;
  primaryHref?: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-title"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fff1f3] text-[#d4234c]">
          <LogIn className="h-5 w-5" />
        </div>
        <h2 className="mt-4 font-display text-xl font-bold text-title">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          {primaryHref ? (
            <Link
              href={primaryHref}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-white hover:bg-primary-hover"
            >
              {primaryLabel}
            </Link>
          ) : null}
          {secondaryHref && secondaryLabel ? (
            <Link
              href={secondaryHref}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl border border-slate-200 text-sm font-semibold text-title hover:bg-slate-50"
            >
              {secondaryLabel}
            </Link>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl border border-slate-200 text-sm font-semibold text-title hover:bg-slate-50"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
