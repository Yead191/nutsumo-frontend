"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Home,
  ImagePlus,
  MapPin,
  Package,
  Truck,
  Pencil,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Sun,
  Sunrise,
  Sunset,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, NativeSelect, TextArea, TextField } from "@/components/ui/field";
import { categories, getPro, professionals } from "@/Mockdata";
import { matchEligiblePros } from "@/lib/matching";
import { loginAs } from "@/redux/slices/authSlice";
import { clearDraft } from "@/redux/slices/intakeSlice";
import { addJob, addQuote } from "@/redux/slices/marketplaceSlice";
import { addNotification, invitePro, setJobPhotos, setJobStatus } from "@/redux/slices/featuresSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { JobVisibility, PropertyType, Urgency } from "@/types";
import { cn } from "@/lib/cn";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

const STEPS = [
  { id: 1, label: "Job Details", shortLabel: "Details" },
  { id: 2, label: "When & Where", shortLabel: "Schedule" },
  { id: 3, label: "Review & Submit", shortLabel: "Review" },
];

const MATERIAL_OPTIONS = [
  {
    id: "contractor",
    title: "Pro brings parts",
    desc: "They supply fittings and hardware",
    icon: Truck,
  },
  {
    id: "on_site",
    title: "I have parts",
    desc: "Replacement pieces are already here",
    icon: Package,
  },
  {
    id: "diagnostic",
    title: "Inspect first",
    desc: "Diagnose before buying parts",
    icon: Wrench,
  },
] as const;

const BUDGET_OPTIONS = [
  "",
  "Under $250",
  "$250–$500",
  "$500–$1,000",
  "$1,000–$3,000",
  "$3,000+",
];

type MaterialsStatus = (typeof MATERIAL_OPTIONS)[number]["id"];

export default function PostJobPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-[20px] border border-line/80 bg-white p-8 text-center">
          <p className="text-sm text-muted">Loading booking flow…</p>
        </div>
      }
    >
      <BookingFlow />
    </Suspense>
  );
}

function createJobId() {
  return `job-local-${Date.now()}`;
}

function headlineFromDraft(problem: string, title: string, categoryName?: string) {
  const fromProblem = problem.split(/[.!\n]/)[0]?.trim() || problem.trim();
  if (fromProblem.length >= 4) return fromProblem.slice(0, 72);
  if (title && title !== categoryName) return title;
  return title || "";
}

function BookingFlow() {
  const searchParams = useSearchParams();
  const inviteId = searchParams.get("invite");
  const invitedPro = inviteId ? getPro(inviteId) : null;

  const draft = useAppSelector((state) => state.intake.draft);
  const intakeReady = useAppSelector((state) => state.intake.hydrated);
  const user = useAppSelector((state) => state.auth.user);
  const addresses = useAppSelector((state) => state.features.addresses);
  const listingStatus = useAppSelector((state) => state.admin.listingStatus);
  const dispatch = useAppDispatch();
  const fileRef = useRef<HTMLInputElement>(null);

  // 3-Step Streamlined Flow
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [submittedJobId, setSubmittedJobId] = useState<string | null>(null);

  // Form State
  const startingCategory = invitedPro?.categorySlug || draft.categorySlug || "plumbing";
  const startingCategoryName = categories.find((item) => item.slug === startingCategory)?.name;
  const cameFromHome = Boolean(draft.problem || draft.categorySlug || draft.zip);
  const [categorySlug, setCategorySlug] = useState(startingCategory);
  const [titleInput, setTitleInput] = useState(
    headlineFromDraft(draft.problem || draft.summary || "", draft.title || "", startingCategoryName),
  );
  const [descriptionInput, setDescriptionInput] = useState(draft.problem || draft.summary || "");
  const [urgency, setUrgency] = useState<Urgency>("this_week");
  const [timeWindow, setTimeWindow] = useState("anytime");
  const [propertyType, setPropertyType] = useState<PropertyType>("single_family");
  const [materialsStatus, setMaterialsStatus] = useState<MaterialsStatus>("contractor");
  const [budget, setBudget] = useState("");
  // Only select saved address if user explicitly picks it; default to empty so homepage zip is used without fabricating 418 West 5th St
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [zipInput, setZipInput] = useState(
    draft.zip || user?.zip || "78701",
  );
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [editingLocation, setEditingLocation] = useState(true);
  const [appliedDraft, setAppliedDraft] = useState(false);

  useEffect(() => {
    if (!intakeReady || appliedDraft) return;
    if (!(draft.problem || draft.summary || draft.categorySlug)) {
      setAppliedDraft(true);
      return;
    }
    const nextCategory = invitedPro?.categorySlug || draft.categorySlug || startingCategory;
    const nextCategoryName = categories.find((item) => item.slug === nextCategory)?.name;
    setCategorySlug(nextCategory);
    setTitleInput(
      headlineFromDraft(draft.problem || draft.summary || "", draft.title || "", nextCategoryName),
    );
    setDescriptionInput(draft.problem || draft.summary || "");
    if (draft.zip) setZipInput(draft.zip);
    setAppliedDraft(true);
  }, [appliedDraft, draft, intakeReady, invitedPro, startingCategory]);

  const selectedCategory = categories.find((c) => c.slug === categorySlug) ?? categories[0];
  const activeAddress = addresses.find((a) => a.id === selectedAddressId);
  const displayLocation = activeAddress?.street
    ? `${activeAddress.street}, ${activeAddress.city || "Austin"}, ${activeAddress.state || "TX"} ${zipInput}`
    : `Austin, TX ${zipInput}`;
  const areaDescription = `${activeAddress?.city || "Austin"}, TX ${zipInput}`;

  // Simple Step Validations
  function validateStep(currentStep: number): boolean {
    setError("");
    if (currentStep === 1) {
      if (titleInput.trim().length < 4) {
        setError("Please enter a short project headline (at least 4 characters).");
        return false;
      }
      if (descriptionInput.trim().length < 10) {
        setError("Please add a brief description of what you need (at least 10 characters).");
        return false;
      }
    }
    if (currentStep === 2) {
      if (!/^\d{5}$/.test(zipInput.trim())) {
        setError("Please enter a valid 5-digit ZIP code.");
        return false;
      }
    }
    return true;
  }

  function handleNext() {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 3));
    }
  }

  function handleBack() {
    setError("");
    setStep((prev) => Math.max(prev - 1, 1));
  }

  function onPhotos(event: React.ChangeEvent<HTMLInputElement>) {
    const files = [...(event.target.files ?? [])].slice(0, 4 - photoUrls.length);
    files.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setPhotoUrls((prev) => [...prev, reader.result as string].slice(0, 4));
        }
      };
      reader.readAsDataURL(file);
    });
    event.target.value = "";
  }

  function removePhoto(index: number) {
    setPhotoUrls((prev) => prev.filter((_, i) => i !== index));
  }

  function handleFinalSubmit() {
    if (!validateStep(1)) {
      setStep(1);
      return;
    }
    if (!validateStep(2)) {
      setStep(2);
      return;
    }

    const jobId = createJobId();
    const timeLabel =
      timeWindow === "morning"
        ? "Morning (8 AM – 12 PM)"
        : timeWindow === "afternoon"
          ? "Afternoon (12 PM – 5 PM)"
          : timeWindow === "evening"
            ? "Evening (5 PM – 8 PM)"
            : "Flexible / Anytime";

    const enhancedDescription = descriptionInput.trim();
    const visibility: JobVisibility = invitedPro ? "direct" : "open";
    const matches = matchEligiblePros(
      {
        categorySlug,
        zip: zipInput.trim(),
        city: activeAddress?.city || user?.city || "Austin",
      },
      professionals,
      listingStatus,
    );
    const matchedIds = invitedPro ? [invitedPro.id] : matches.map((item) => item.id);

    if (!user) {
      dispatch(loginAs("homeowner"));
    }

    dispatch(
      addJob({
        id: jobId,
        title: titleInput.trim(),
        categorySlug,
        description: enhancedDescription,
        zip: zipInput.trim(),
        city: activeAddress?.city || user?.city || "Austin",
        state: activeAddress?.state || user?.state || "TX",
        urgency,
        budget: budget || undefined,
        propertyType,
        intakeAnswers: [
          {
            id: "materials",
            label: "Parts & materials",
            value: MATERIAL_OPTIONS.find((item) => item.id === materialsStatus)?.title ?? "Pro brings parts",
          },
          {
            id: "timing",
            label: "Timing",
            value: timeLabel,
          },
        ],
        homeownerName: user?.name ?? "Homeowner",
        requestedProId: invitedPro?.id,
        visibility,
        photos: photoUrls,
        matchedProIds: matchedIds,
      }),
    );

    if (photoUrls.length) {
      dispatch(setJobPhotos({ jobId, photos: photoUrls }));
    }

    if (!invitedPro) {
      matches.slice(0, 3).forEach((pro, index) => {
        dispatch(
          addQuote({
            jobId,
            proId: pro.id,
            priceType: "fixed",
            amount: 140 + index * 45,
            scope: `Quoted work for ${titleInput.trim()}.`,
            availability: urgency === "asap" ? "Same day / tomorrow" : "This week",
            estimatedDuration: "1–3 hours",
            proposedSchedule: timeLabel,
            paymentTerms: "Pay the pro directly after the work is done.",
            warranty: "90-day workmanship",
            materialsIncluded: true,
          }),
        );
      });
      if (matches.length) {
        dispatch(setJobStatus({ jobId, status: "quotes_in" }));
      }
    }

    if (invitedPro) {
      dispatch(invitePro({ jobId, proId: invitedPro.id }));
      dispatch(
        addNotification({
          title: "Quote request",
          body: `${user?.name ?? "A homeowner"} asked you to quote "${titleInput.trim()}" in ${zipInput.trim()}.`,
          href: `/pro/jobs/${jobId}`,
          createdAt: "Just now",
          role: "pro",
        }),
      );
    } else if (matchedIds.includes("pro-1")) {
      dispatch(
        addNotification({
          title: "New matching job",
          body: `${titleInput.trim()} was posted in ${zipInput.trim()}. Review and send a quotation.`,
          href: `/pro/jobs/${jobId}`,
          createdAt: "Just now",
          role: "pro",
        }),
      );
    }

    dispatch(
      addNotification({
        title: invitedPro ? "Request sent" : "Job published",
        body: invitedPro
          ? `${invitedPro.name} has your details and can send a quotation. Hiring is not confirmed until you accept it.`
          : `${matchedIds.length} matching professional${matchedIds.length === 1 ? "" : "s"} can now send quotations.`,
        href: `/account/jobs/${jobId}`,
        createdAt: "Just now",
        role: "homeowner",
      }),
    );

    dispatch(clearDraft());
    setSubmittedJobId(jobId);
  }

  // Confirmation View
  if (submittedJobId) {
    return (
      <Card className="rounded-[24px] border border-line/80 bg-white p-6 sm:p-10 shadow-sm max-w-xl mx-auto text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 shadow-xs mb-5">
          <CheckCircle2 className="h-9 w-9 stroke-[2.5]" />
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800 border border-emerald-200/80">
          Request Sent
        </span>

        <h1 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-title">
          {invitedPro ? `Request Sent to ${invitedPro.name}!` : "Your Request is Live!"}
        </h1>

        <p className="mt-2 text-sm text-[#555] max-w-md mx-auto leading-relaxed">
          {invitedPro
            ? `${invitedPro.name} has your details and can send a quotation. Viewing a profile or sending this request is not a booking.`
            : "Matching professionals can review this job and send quotations. You hire only after you accept one."}
        </p>

        {/* Work Order Receipt Box */}
        <div className="mt-6 rounded-2xl border border-line/80 bg-surface/50 p-4 sm:p-5 text-left space-y-3">
          <div className="flex items-center justify-between border-b border-line/60 pb-3">
            <span className="text-xs font-medium text-muted">Request Reference</span>
            <span className="font-mono text-xs font-bold text-title">
              #{submittedJobId.replace("job-local-", "HF-")}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-muted block">Service</span>
              <span className="font-semibold text-title truncate block">{titleInput}</span>
            </div>
            <div>
              <span className="text-muted block">Location</span>
              <span className="font-semibold text-title">
                {zipInput} (Austin, TX)
              </span>
            </div>
            <div>
              <span className="text-muted block">Timeframe</span>
              <span className="font-semibold text-title capitalize">
                {urgency === "asap" ? "Emergency / ASAP" : urgency.replace("_", " ")}
              </span>
            </div>
            <div>
              <span className="text-muted block">Status</span>
              <span className="font-semibold text-emerald-700">
                {invitedPro ? "Waiting for a quote" : "Quotations in"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            href="/account"
            size="lg"
            className="w-full sm:w-auto font-semibold rounded-full shadow-xs px-6"
          >
            View my requests
          </Button>
          <Button
            href={`/account/jobs/${submittedJobId}?posted=1`}
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto rounded-full text-xs font-semibold"
          >
            Open this request
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl space-y-6">
      {/* 1. Invited Pro Banner (If directly booking) */}
      {invitedPro ? (
        <Card className="rounded-[20px] border border-primary/30 bg-gradient-to-r from-primary/5 via-blue-50/20 to-white p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 font-display text-lg font-bold text-white shadow-xs">
                {initials(invitedPro.name)}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                    <CheckCircle2 className="h-3 w-3" />
                    Direct Request
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 border border-emerald-200">
                    <ShieldCheck className="h-3 w-3" />
                    Verified Pro
                  </span>
                </div>
                <h2 className="font-display text-lg font-bold text-title mt-0.5">
                  {invitedPro.name}
                </h2>
                <p className="text-xs text-muted">
                  ★ {invitedPro.rating.toFixed(1)} ({invitedPro.reviewCount} reviews) • Starting at ${invitedPro.startingPrice}
                </p>
              </div>
            </div>

            <Link
              href={`/browse-pros/${invitedPro.id}`}
              className="text-xs font-semibold text-primary hover:underline shrink-0"
            >
              View Profile ↗
            </Link>
          </div>
        </Card>
      ) : null}

      {/* 2. Streamlined 3-Step Progress Indicator */}
      <div className="rounded-[20px] border border-line/80 bg-white p-4 shadow-xs">
        <div className="flex items-center justify-between pb-2 text-xs">
          <span className="font-display font-bold text-title text-sm">
            Step {step} of 3: <span className="text-primary">{STEPS[step - 1].label}</span>
          </span>
          <span className="font-medium text-muted">{Math.round((step / 3) * 100)}% Completed</span>
        </div>

        {/* Animated Progress Bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-smoke">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Step Tabs */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          {STEPS.map((s) => {
            const isCompleted = s.id < step;
            const isCurrent = s.id === step;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  if (s.id < step) setStep(s.id);
                }}
                disabled={s.id > step}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-xl py-2 px-2 text-xs font-semibold transition-all",
                  isCurrent && "bg-primary text-white shadow-xs font-bold",
                  isCompleted && "bg-smoke text-title hover:bg-smoke/80 cursor-pointer",
                  !isCurrent && !isCompleted && "bg-transparent text-muted/60 opacity-60 cursor-not-allowed",
                )}
              >
                {isCompleted ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3]" />
                ) : (
                  <span className="text-[11px]">{s.id}.</span>
                )}
                <span>{s.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Layout: Focused Wizard Form */}
      <div className="w-full">
        <Card className="rounded-[22px] border border-line/80 bg-white p-5 sm:p-7 shadow-xs">
          {/* STEP 1: JOB DETAILS */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="border-b border-line/60 pb-3">
                <h2 className="font-display text-xl font-bold text-title">
                  What do you need help with?
                </h2>
                <p className="mt-0.5 text-xs text-muted">
                  {cameFromHome || invitedPro
                    ? "Review and edit your project details before posting."
                    : "Tell us about your project so we can match you with the right specialist."}
                </p>
              </div>

              <Field label="Trade Category *">
                <NativeSelect
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  className="rounded-xl"
                >
                  {categories.map((item) => (
                    <option key={item.id} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </NativeSelect>
              </Field>

              <Field label="Project Headline *">
                <TextField
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder="e.g. Leaking kitchen faucet"
                  required
                  className="rounded-xl"
                />
              </Field>

              <Field label="Detailed Work Description *">
                <TextArea
                  value={descriptionInput}
                  onChange={(e) => setDescriptionInput(e.target.value)}
                  placeholder="Describe what needs to be fixed or installed, any symptoms, and any specific requests..."
                  className="min-h-[110px] rounded-xl text-sm"
                  rows={4}
                  required
                />
              </Field>

                {/* Inline Photo Upload (Convenient & frictionless) */}
                <div className="space-y-2 pt-1 border-t border-line/40">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-title">
                      Project Photos (Optional)
                    </label>
                    <span className="text-[11px] text-muted">{photoUrls.length} / 4 attached</span>
                  </div>

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={onPhotos}
                    className="sr-only"
                  />

                  <div className="flex flex-wrap items-center gap-2.5">
                    {photoUrls.map((src, index) => (
                      <div
                        key={src.slice(0, 48)}
                        className="relative h-20 w-20 overflow-hidden rounded-xl border border-line shadow-xs group"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="Uploaded site photo" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          aria-label="Remove photo"
                          onClick={() => removePhoto(index)}
                          className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-title/80 text-white transition hover:bg-error"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}

                    {photoUrls.length < 4 && (
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="flex h-20 w-28 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-line bg-smoke/40 text-muted transition hover:border-primary hover:text-primary hover:bg-primary/[0.02]"
                      >
                        <ImagePlus className="h-5 w-5" />
                        <span className="text-[11px] font-semibold">+ Add Photos</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: WHEN & WHERE */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="border-b border-line/60 pb-3">
                  <h2 className="font-display text-xl font-bold text-title">
                    When and where do you need service?
                  </h2>
                  <p className="mt-0.5 text-xs text-muted">
                    Choose your timeframe and service location.
                  </p>
                </div>

                {/* Streamlined Urgency Selection (3 Clean Cards) */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-title">
                    When would you like this done?
                  </label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      {
                        id: "asap",
                        title: "ASAP / Emergency",
                        desc: "Immediate or same-day",
                        icon: Zap,
                      },
                      {
                        id: "this_week",
                        title: "Within a few days",
                        desc: "Next 1–3 business days",
                        icon: Calendar,
                      },
                      {
                        id: "flexible",
                        title: "Flexible",
                        desc: "Planning ahead / no rush",
                        icon: Clock,
                      },
                    ].map((item) => {
                      const active = urgency === item.id;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setUrgency(item.id as Urgency)}
                          className={cn(
                            "flex flex-col text-left rounded-xl border p-3.5 transition-all",
                            active
                              ? "border-primary bg-primary/[0.04] ring-2 ring-primary/20 shadow-xs"
                              : "border-line bg-white hover:border-primary/40 hover:bg-smoke/40",
                          )}
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <span
                              className={cn(
                                "grid h-7 w-7 place-items-center rounded-lg transition-colors",
                                active ? "bg-primary text-white" : "bg-smoke text-primary",
                              )}
                            >
                              <Icon className="h-3.5 w-3.5" />
                            </span>
                            <span className="font-display text-xs font-bold text-title">
                              {item.title}
                            </span>
                          </div>
                          <span className="text-[11px] text-muted">{item.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Preferred Time of Day (Clean Compact Tabs) */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-title">
                    Preferred Arrival Window (Optional)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "morning", label: "Morning", sub: "8 AM – 12 PM", icon: Sunrise },
                      { id: "afternoon", label: "Afternoon", sub: "12 PM – 5 PM", icon: Sun },
                      { id: "evening", label: "Evening", sub: "5 PM – 8 PM", icon: Sunset },
                      { id: "anytime", label: "Anytime", sub: "Flexible", icon: Clock },
                    ].map((w) => {
                      const active = timeWindow === w.id;
                      const Icon = w.icon;
                      return (
                        <button
                          key={w.id}
                          type="button"
                          onClick={() => setTimeWindow(w.id)}
                          className={cn(
                            "flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all",
                            active
                              ? "border-primary bg-primary text-white shadow-xs font-semibold"
                              : "border-line bg-white text-copy hover:border-primary/40 hover:bg-smoke",
                          )}
                        >
                          <Icon className={cn("h-4 w-4 mb-0.5", active ? "text-white" : "text-primary")} />
                          <span className="text-xs font-bold">{w.label}</span>
                          <span className={cn("text-[10px]", active ? "text-white/80" : "text-muted")}>
                            {w.sub}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Location: Address / ZIP */}
                <div className="space-y-3 pt-2 border-t border-line/40">
                  <div>
                    <label className="block text-xs font-bold text-title">
                      Service Location
                    </label>
                    <p className="text-[11px] text-muted mt-0.5">
                      Pros match based on your ZIP code radius. Street address is private and only shared directly with the pro you hire.
                    </p>
                  </div>

                  {addresses.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-muted block uppercase tracking-wider">
                        Location Options:
                      </span>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {/* Option 1: Custom ZIP only */}
                        <button
                          type="button"
                          onClick={() => setSelectedAddressId("")}
                          className={cn(
                            "flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer",
                            !selectedAddressId
                              ? "border-primary bg-primary/[0.04] ring-2 ring-primary/20 shadow-xs"
                              : "border-line bg-white hover:border-primary/40 hover:bg-smoke/60",
                          )}
                        >
                          <MapPin className={cn("h-4 w-4 shrink-0", !selectedAddressId ? "text-primary" : "text-muted")} />
                          <div className="min-w-0">
                            <span className="font-display text-xs font-bold text-title block truncate">
                              Service ZIP Area
                            </span>
                            <span className="text-[11px] text-muted block truncate">
                              Austin, TX {zipInput || "78701"}
                            </span>
                          </div>
                        </button>

                        {/* Option 2+: Saved address presets */}
                        {addresses.map((addr) => {
                          const active = selectedAddressId === addr.id;
                          return (
                            <button
                              key={addr.id}
                              type="button"
                              onClick={() => {
                                setSelectedAddressId(addr.id);
                                if (addr.zip) setZipInput(addr.zip);
                              }}
                              className={cn(
                                "flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer",
                                active
                                  ? "border-primary bg-primary/[0.04] ring-2 ring-primary/20 shadow-xs"
                                  : "border-line bg-white hover:border-primary/40 hover:bg-smoke/60",
                              )}
                            >
                              <MapPin className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "text-muted")} />
                              <div className="min-w-0">
                                <span className="font-display text-xs font-bold text-title block truncate">
                                  Use Saved: {addr.label}
                                </span>
                                <span className="text-[11px] text-muted block truncate">
                                  {addr.street}, {addr.zip}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="max-w-xs">
                    <Field label="Service ZIP Code *">
                      <TextField
                        value={zipInput}
                        onChange={(e) => setZipInput(e.target.value)}
                        placeholder="78701"
                        maxLength={5}
                        required
                        className="rounded-xl font-mono text-sm"
                      />
                    </Field>
                  </div>
                </div>

                {/* Property Type (Clean compact pills) */}
                <div className="space-y-2 pt-2 border-t border-line/40">
                  <label className="block text-xs font-bold text-title">
                    Property Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "single_family", label: "Single-Family", icon: Home },
                      { id: "condo", label: "Condo / HOA", icon: Building },
                      { id: "apartment", label: "Apartment", icon: Building2 },
                      { id: "commercial", label: "Commercial", icon: Store },
                    ].map((p) => {
                      const active = propertyType === p.id;
                      const Icon = p.icon;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPropertyType(p.id as PropertyType)}
                          className={cn(
                            "flex items-center justify-center gap-2 p-2.5 rounded-xl border text-center transition-all",
                            active
                              ? "border-primary bg-primary/[0.05] ring-2 ring-primary/20 text-primary font-bold shadow-xs"
                              : "border-line bg-white text-title hover:border-primary/40 hover:bg-smoke text-xs",
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="text-xs font-semibold">{p.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-line/40">
                  <label className="block text-xs font-bold text-title">Parts &amp; materials</label>
                  <p className="text-[11px] text-muted">So the pro knows what to bring.</p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {MATERIAL_OPTIONS.map((item) => {
                      const active = materialsStatus === item.id;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setMaterialsStatus(item.id)}
                          className={cn(
                            "flex flex-col text-left rounded-xl border p-3 transition-all",
                            active
                              ? "border-primary bg-primary/[0.04] ring-2 ring-primary/20 shadow-xs"
                              : "border-line bg-white hover:border-primary/40 hover:bg-smoke/40",
                          )}
                        >
                          <span
                            className={cn(
                              "grid h-7 w-7 place-items-center rounded-lg",
                              active ? "bg-primary text-white" : "bg-smoke text-primary",
                            )}
                          >
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                          <span className="mt-2 font-display text-xs font-bold text-title">{item.title}</span>
                          <span className="mt-0.5 text-[11px] text-muted">{item.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-line/40">
                  <label className="block text-xs font-bold text-title">Budget (optional)</label>
                  <div className="flex flex-wrap gap-2">
                    {BUDGET_OPTIONS.map((item) => {
                      const active = budget === item;
                      return (
                        <button
                          key={item || "none"}
                          type="button"
                          onClick={() => setBudget(item)}
                          className={cn(
                            "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                            active
                              ? "border-primary bg-primary text-white"
                              : "border-line bg-white text-copy hover:border-primary/40",
                          )}
                        >
                          {item || "Not specified"}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: REVIEW & CONFIRM */}
            {step === 3 && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="border-b border-line/60 pb-3">
                  <h2 className="font-display text-xl font-bold text-title">
                    Review &amp; Submit
                  </h2>
                  <p className="mt-0.5 text-xs text-muted">
                    Check your details before we notify top-rated pros in your area.
                  </p>
                </div>

                {/* Direct Pro Invitation Banner (if directed to specific pro) */}
                {invitedPro && (
                  <div className="flex items-center justify-between gap-3.5 rounded-2xl border border-primary/25 bg-gradient-to-r from-blue-50/80 via-primary/[0.04] to-surface p-4 shadow-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-white font-display text-base font-bold shadow-xs">
                        {initials(invitedPro.name)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                            Direct Request To Pro
                          </span>
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                            <ShieldCheck className="h-3 w-3 text-emerald-600" /> Verified Pro
                          </span>
                        </div>
                        <h3 className="font-display text-base font-bold text-title truncate mt-0.5">
                          {invitedPro.name}
                        </h3>
                        <p className="text-xs text-muted flex items-center gap-2">
                          <span>{invitedPro.trade}</span>
                          <span className="text-stone-300">•</span>
                          <span className="inline-flex items-center gap-1 font-semibold text-title">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                            {invitedPro.rating.toFixed(1)}
                            <span className="font-normal text-muted">({invitedPro.reviewCount})</span>
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-white/90 border border-line/70 px-3 py-1.5 text-xs text-stone-700 font-medium shrink-0 shadow-2xs">
                      <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-400" />
                      Replies {invitedPro.responseTime}
                    </div>
                  </div>
                )}

                {/* Rich & Colorful Structured Review Card */}
                <div className="rounded-2xl border border-line/80 bg-white shadow-xs overflow-hidden">
                  {/* Card Header with category badge & edit */}
                  <div className="bg-gradient-to-r from-slate-50 via-blue-50/30 to-slate-50/60 p-4 sm:p-5 border-b border-line/60">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                          <Sparkles className="h-3 w-3 text-primary" />
                          {selectedCategory.name}
                        </div>
                        <h3 className="font-display text-lg sm:text-xl font-bold text-title mt-2 tracking-tight">
                          {titleInput}
                        </h3>
                        {descriptionInput ? (
                          <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed bg-white/90 rounded-xl p-3 border border-line/50">
                            {descriptionInput}
                          </p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="inline-flex items-center gap-1 rounded-lg bg-white border border-line/80 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary/5 hover:border-primary/40 transition-colors shrink-0 shadow-2xs"
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* Clean Metadata Feature Grid with Uniform Monochrome Icons */}
                  <div className="p-4 sm:p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* Tile 1: Timeframe */}
                      <div className="flex items-center gap-3 rounded-xl border border-line/70 bg-white p-3 hover:border-slate-300 transition-colors">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-smoke text-title">
                          <Calendar className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="block text-[11px] font-medium text-muted">Timeframe</span>
                          <span className="font-semibold text-title capitalize text-xs sm:text-sm">
                            {urgency === "asap" ? "Emergency / ASAP" : urgency.replace("_", " ")}
                          </span>
                        </div>
                      </div>

                      {/* Tile 2: Preferred Arrival Window */}
                      <div className="flex items-center gap-3 rounded-xl border border-line/70 bg-white p-3 hover:border-slate-300 transition-colors">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-smoke text-title">
                          <Clock className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="block text-[11px] font-medium text-muted">Arrival Window</span>
                          <span className="font-semibold text-title capitalize text-xs sm:text-sm">
                            {timeWindow}
                          </span>
                        </div>
                      </div>

                      {/* Tile 3: Service Location */}
                      <div className="flex items-center gap-3 rounded-xl border border-line/70 bg-white p-3 hover:border-slate-300 transition-colors">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-smoke text-title">
                          <MapPin className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="block text-[11px] font-medium text-muted">Service Location</span>
                          <span className="font-semibold text-title text-xs sm:text-sm">
                            {displayLocation}
                          </span>
                        </div>
                      </div>

                      {/* Tile 4: Property Type */}
                      <div className="flex items-center gap-3 rounded-xl border border-line/70 bg-white p-3 hover:border-slate-300 transition-colors">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-smoke text-title">
                          <Home className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="block text-[11px] font-medium text-muted">Property Type</span>
                          <span className="font-semibold text-title capitalize text-xs sm:text-sm">
                            {propertyType.replace("_", " ")}
                          </span>
                        </div>
                      </div>

                      {/* Tile 5: Parts & materials */}
                      <div className="flex items-center gap-3 rounded-xl border border-line/70 bg-white p-3 hover:border-slate-300 transition-colors">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-smoke text-title">
                          <Package className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="block text-[11px] font-medium text-muted">Parts &amp; materials</span>
                          <span className="font-semibold text-title text-xs sm:text-sm">
                            {MATERIAL_OPTIONS.find((item) => item.id === materialsStatus)?.title}
                          </span>
                        </div>
                      </div>

                      {/* Tile 6: Budget */}
                      {budget ? (
                        <div className="flex items-center gap-3 rounded-xl border border-line/70 bg-white p-3 hover:border-slate-300 transition-colors">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-smoke text-title">
                            <Sparkles className="h-4.5 w-4.5" />
                          </div>
                          <div className="min-w-0">
                            <span className="block text-[11px] font-medium text-muted">Budget</span>
                            <span className="font-semibold text-title text-xs sm:text-sm">{budget}</span>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    {/* Bottom strip inside review card */}
                    <div className="mt-3.5 pt-3 border-t border-line/60 flex items-center justify-between text-xs text-muted">
                      <span>
                        {photoUrls.length > 0
                          ? `📷 ${photoUrls.length} job photo${photoUrls.length > 1 ? "s" : ""} attached`
                          : "No photos attached (optional)"}
                      </span>
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                      >
                        <Pencil className="h-3 w-3" />
                        Edit schedule &amp; address
                      </button>
                    </div>
                  </div>
                </div>

                {/* Photos Preview in Review (if any) */}
                {photoUrls.length > 0 && (
                  <div className="space-y-2 rounded-2xl border border-line/70 bg-white p-4">
                    <span className="text-xs font-semibold text-title block">Attached Photos ({photoUrls.length})</span>
                    <div className="flex flex-wrap gap-2.5">
                      {photoUrls.map((src) => (
                        <div
                          key={src.slice(0, 48)}
                          className="h-16 w-16 overflow-hidden rounded-xl border border-line shadow-2xs"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt="Attached" className="h-full w-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-medium text-error border border-red-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-6 flex items-center justify-between border-t border-line/60 pt-4">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={handleBack}
                  className="rounded-full gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
              ) : (
                <Button
                  href="/account"
                  variant="ghost"
                  size="md"
                  className="rounded-full text-muted"
                >
                  Cancel
                </Button>
              )}

              {step < 3 ? (
                <Button
                  type="button"
                  size="md"
                  onClick={handleNext}
                  className="rounded-full gap-1.5 font-semibold shadow-xs"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  size="md"
                  onClick={handleFinalSubmit}
                  className="rounded-full gap-2 font-semibold shadow-sm bg-primary hover:bg-primary-hover px-6"
                >
                  <Send className="h-4 w-4" />
                  {invitedPro
                    ? `Send Request to ${invitedPro.name}`
                    : "Post Request & Get Quotes"}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
  );
}
