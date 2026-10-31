"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  DollarSign,
  Calendar,
  MapPin,
  Sparkles,
  Loader2,
  Building,
  Wrench,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { PhotoUploader } from "./components/PhotoUploader";
import { CategorySelector } from "./components/CategorySelector";
import type { PostJobWizardProps, PostJobFormData } from "./types";
import { createJobAction } from "@/helpers/next-fetch/apiActions/jobActions";

const STEPS = [
  { id: 1, title: "Job Scope", subtitle: "Trade & Details" },
  { id: 2, title: "When & Where", subtitle: "Location & Date" },
  { id: 3, title: "Budget & Photos", subtitle: "Pricing & Media" },
  { id: 4, title: "Review & Post", subtitle: "Confirm Details" },
];

export function PostJobWizard({ categories }: PostJobWizardProps) {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<PostJobFormData>({
    title: "",
    description: "",
    category: "",
    service: "",
    customServiceName: "",
    location: "",
    postCode: "",
    budget: "",
    preferredDate: "",
    images: [],
  });

  const selectedCategoryObj = categories.find((c) => c._id === formData.category);
  const selectedServiceObj = selectedCategoryObj?.services?.find(
    (s) => s._id === formData.service,
  );

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!formData.title.trim() || formData.title.trim().length < 3) {
        toast.error("Please enter a job title (at least 3 characters)");
        return false;
      }
      if (!formData.description.trim() || formData.description.trim().length < 10) {
        toast.error("Please describe your problem or project in detail (at least 10 characters)");
        return false;
      }
    }
    if (step === 2) {
      if (!formData.location.trim()) {
        toast.error("Please enter the service location or city");
        return false;
      }
    }
    if (step === 3) {
      const budgetNum = Number(formData.budget);
      if (!formData.budget || Number.isNaN(budgetNum) || budgetNum <= 0) {
        toast.error("Please enter a valid estimated budget");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const dataPayload = new FormData();
      dataPayload.append("title", formData.title.trim());
      dataPayload.append("description", formData.description.trim());
      if (formData.category) dataPayload.append("category", formData.category);
      if (formData.service && formData.service !== "CUSTOM") {
        dataPayload.append("service", formData.service);
      }
      if (formData.customServiceName) {
        dataPayload.append("customServiceName", formData.customServiceName.trim());
      }
      dataPayload.append("location", formData.location.trim());
      if (formData.postCode) dataPayload.append("postCode", formData.postCode.trim());
      dataPayload.append("budget", String(Number(formData.budget)));
      if (formData.preferredDate) {
        dataPayload.append("preferredDate", new Date(formData.preferredDate).toISOString());
      }

      // Append image files
      formData.images.forEach((file) => {
        dataPayload.append("images", file);
      });

      const res = await createJobAction(dataPayload);

      if (res.success && res.data) {
        toast.success("Job posted successfully! Job Seekers are being notified 🎉");
        router.push(`/account/jobs/${res.data._id}`);
      } else {
        toast.error(res.message || "Failed to post job. Please try again.");
      }
    } catch {
      toast.error("An error occurred while creating the job.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-line/70 pb-4">
        <div>
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-[#FE375D] transition-colors mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Cancel & Back</span>
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-title tracking-tight">
            Post a Service Request
          </h1>
        </div>
      </div>

      {/* STEPPER PROGRESS */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {STEPS.map((s) => {
          const isDone = s.id < currentStep;
          const isCurrent = s.id === currentStep;

          return (
            <div
              key={s.id}
              className={cn(
                "rounded-2xl border p-3 sm:p-3.5 transition-all text-left",
                isCurrent
                  ? "border-[#FE375D] bg-[#FE375D]/5 ring-1 ring-[#FE375D]"
                  : isDone
                    ? "border-emerald-200 bg-emerald-50/50"
                    : "border-line/70 bg-white opacity-60",
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "grid h-6 w-6 place-items-center rounded-full text-xs font-bold shrink-0",
                    isCurrent
                      ? "bg-[#FE375D] text-white"
                      : isDone
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 text-slate-700",
                  )}
                >
                  {isDone ? <Check className="h-3.5 w-3.5" /> : s.id}
                </span>
                <span className="font-display text-xs font-bold text-title truncate hidden sm:inline">
                  {s.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* STEP CONTAINER */}
      <div className="rounded-3xl border border-line bg-white p-6 sm:p-8 shadow-xs">
        {/* STEP 1: JOB SCOPE & CATEGORY */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="font-display text-lg font-bold text-title">
                1. What do you need help with?
              </h2>
              <p className="text-xs text-muted">
                Be specific with your job title so the best matching tradespeople can find it.
              </p>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-title mb-1.5">
                Job Title <span className="text-[#FE375D]">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g. Fix Leaking Kitchen Sink and Replace Pipe"
                className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-xs sm:text-sm text-title placeholder:text-muted focus:border-[#FE375D] focus:outline-none focus:ring-1 focus:ring-[#FE375D] shadow-2xs"
              />
            </div>

            {/* Category Selector */}
            <CategorySelector
              categories={categories}
              selectedCategory={formData.category}
              selectedService={formData.service}
              customServiceName={formData.customServiceName}
              onCategoryChange={(val) =>
                setFormData({ ...formData, category: val })
              }
              onServiceChange={(val) =>
                setFormData({ ...formData, service: val })
              }
              onCustomServiceChange={(val) =>
                setFormData({ ...formData, customServiceName: val })
              }
            />

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-title mb-1.5">
                Detailed Description <span className="text-[#FE375D]">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={5}
                placeholder="Describe the issue, dimensions, current condition, or any specific requirements for the artisan..."
                className="w-full rounded-xl border border-line bg-white p-3.5 text-xs sm:text-sm text-title placeholder:text-muted focus:border-[#FE375D] focus:outline-none focus:ring-1 focus:ring-[#FE375D] shadow-2xs resize-none"
              />
            </div>
          </div>
        )}

        {/* STEP 2: LOCATION & SCHEDULE */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="font-display text-lg font-bold text-title">
                2. Where and when should the work take place?
              </h2>
              <p className="text-xs text-muted">
                Location enables our automated matching engine to notify nearby verified pros.
              </p>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-title mb-1.5">
                Service Address / Neighborhood <span className="text-[#FE375D]">*</span>
              </label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="e.g. Banani, Dhaka or 145 Main St, Brooklyn"
                  className="w-full rounded-xl border border-line bg-white pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-title placeholder:text-muted focus:border-[#FE375D] focus:outline-none focus:ring-1 focus:ring-[#FE375D] shadow-2xs"
                />
              </div>
            </div>

            {/* Postcode */}
            <div>
              <label className="block text-xs font-semibold text-title mb-1.5">
                Postal / Zip Code
              </label>
              <input
                type="text"
                value={formData.postCode}
                onChange={(e) =>
                  setFormData({ ...formData, postCode: e.target.value })
                }
                placeholder="e.g. 1213"
                className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-xs sm:text-sm text-title placeholder:text-muted focus:border-[#FE375D] focus:outline-none focus:ring-1 focus:ring-[#FE375D] shadow-2xs"
              />
            </div>

            {/* Preferred Date */}
            <div>
              <label className="block text-xs font-semibold text-title mb-1.5">
                Preferred Date / Deadline
              </label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <input
                  type="date"
                  value={formData.preferredDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    setFormData({ ...formData, preferredDate: e.target.value })
                  }
                  className="w-full rounded-xl border border-line bg-white pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-title focus:border-[#FE375D] focus:outline-none focus:ring-1 focus:ring-[#FE375D] shadow-2xs cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-muted mt-1">
                Leave blank if your schedule is flexible.
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: BUDGET & PHOTOS */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-display text-lg font-bold text-title">
                3. What is your estimated budget?
              </h2>
              <p className="text-xs text-muted">
                Artisans will propose competitive quotes based on this target amount.
              </p>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-xs font-semibold text-title mb-1.5">
                Estimated Budget (GH₵ GHS) <span className="text-[#FE375D]">*</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-display text-sm font-bold text-title">
                  GH₵
                </span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData({ ...formData, budget: e.target.value })
                  }
                  placeholder="150"
                  className="w-full rounded-xl border border-line bg-white pl-14 pr-3.5 py-2.5 text-xs sm:text-sm font-display font-bold text-title placeholder:text-muted focus:border-[#FE375D] focus:outline-none focus:ring-1 focus:ring-[#FE375D] shadow-2xs"
                />
              </div>
            </div>

            {/* Photos Uploader */}
            <PhotoUploader
              files={formData.images}
              onChange={(files) => setFormData({ ...formData, images: files })}
            />
          </div>
        )}

        {/* STEP 4: REVIEW & CONFIRM */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-display text-lg font-bold text-title">
                4. Review and publish your request
              </h2>
              <p className="text-xs text-muted">
                Make sure everything looks right before sending it to local Job Seekers.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-smoke/60 p-5 space-y-4">
              <div>
                <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
                  Job Title
                </span>
                <h3 className="font-display text-base font-bold text-title mt-0.5">
                  {formData.title}
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-line/60 text-xs">
                <div>
                  <span className="text-muted block">Category:</span>
                  <span className="font-bold text-title">
                    {selectedCategoryObj?.name || "General"}
                  </span>
                </div>
                <div>
                  <span className="text-muted block">Service:</span>
                  <span className="font-bold text-title">
                    {selectedServiceObj?.name || formData.customServiceName || "Standard"}
                  </span>
                </div>
                <div>
                  <span className="text-muted block">Est. Budget:</span>
                  <span className="font-display font-bold text-base text-[#FE375D]">
                    GH₵{formData.budget}
                  </span>
                </div>
                <div>
                  <span className="text-muted block">Location:</span>
                  <span className="font-semibold text-title">
                    {formData.location} {formData.postCode ? `(${formData.postCode})` : ""}
                  </span>
                </div>
                <div>
                  <span className="text-muted block">Preferred Date:</span>
                  <span className="font-semibold text-title">
                    {formData.preferredDate || "Flexible"}
                  </span>
                </div>
                <div>
                  <span className="text-muted block">Photos:</span>
                  <span className="font-semibold text-title">
                    {formData.images.length} Attached
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-line/60">
                <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
                  Description
                </span>
                <p className="mt-1 text-xs sm:text-sm text-copy whitespace-pre-line leading-relaxed">
                  {formData.description}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-rose-50/60 p-4 border border-rose-100 flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-[#FE375D] shrink-0 mt-0.5" />
              <div className="text-xs text-rose-950 leading-relaxed">
                <strong className="block font-bold">Instant Marketplace Matching:</strong>
                As soon as you click Publish, verified local Job Seekers matching this trade will receive real-time push alerts and email notifications. You can expect proposals right in your dashboard!
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM CONTROLS */}
        <div className="mt-8 pt-5 border-t border-line flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-muted hover:text-title hover:border-title transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < STEPS.length ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-full bg-[#FE375D] hover:bg-[#e0284e] text-white px-6 py-2.5 text-xs sm:text-sm font-semibold shadow-md transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 rounded-full bg-[#FE375D] hover:bg-[#e0284e] text-white px-7 py-3 text-sm font-semibold shadow-md transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Publishing Request...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Publish Service Request</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
