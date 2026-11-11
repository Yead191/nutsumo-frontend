"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Star,
  MessageSquare,
  Send,
  Loader2,
  Sparkles,
  Briefcase,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/ui/field";
import { cn } from "@/lib/cn";
import { getImageUrl } from "@/lib/getImageUrl";
import type { IReviewItem } from "@/helpers/next-fetch/apiActions/reviewActions";
import type { ArtisanUserProfile } from "../types";

interface ReviewCardProps {
  review: IReviewItem;
  profile?: ArtisanUserProfile | null;
  onPostReply: (reviewId: string, comment: string) => Promise<boolean>;
}

const QUICK_TEMPLATES = [
  "Thank you for your business! Glad we could deliver quality work for your home.",
  "Appreciate your trust and recommendation. Always here if you need anything in the future!",
  "Thanks for the kind words! We take pride in clean, reliable, and timely craftsmanship.",
];

function getInitials(name?: string): string {
  if (!name) return "C";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? dateStr
      : new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }).format(d);
  } catch {
    return dateStr;
  }
}

export function ReviewCard({ review, profile, onPostReply }: ReviewCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const customerName =
    review.customer && typeof review.customer === "object"
      ? review.customer.name || "Verified Customer"
      : "Verified Customer";
  const customerImage =
    review.customer && typeof review.customer === "object"
      ? review.customer.image
      : undefined;

  const artisanObj =
    review.artisan && typeof review.artisan === "object" ? review.artisan : null;
  const artisanName =
    artisanObj?.name || profile?.name || profile?.businessName || "You";
  const artisanAvatar = artisanObj?.image || profile?.image;

  const hasReply = Boolean(review.reply?.comment) && !isEditing;

  const handleStartEdit = () => {
    setDraft(review.reply?.comment || "");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setDraft("");
  };

  const handleSubmit = async () => {
    const text = draft.trim();
    if (!text || isSubmitting) return;

    setIsSubmitting(true);
    const success = await onPostReply(review._id, text);
    setIsSubmitting(false);

    if (success) {
      setIsEditing(false);
      setDraft("");
    }
  };

  return (
    <Card className="rounded-xl border border-line/80 bg-white p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all duration-200">
      {/* Review Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Customer Avatar */}
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-2 ring-slate-100 flex items-center justify-center relative">
            {customerImage ? (
              <Image
                src={getImageUrl(customerImage) || customerImage}
                alt={customerName}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="font-display text-xs font-semibold text-slate-700">
                {getInitials(customerName)}
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <p className="font-display text-sm font-semibold text-title sm:text-base">
                {customerName}
              </p>
              {review.customer &&
                typeof review.customer === "object" &&
                review.customer.verified && (
                  <span title="Verified Customer" className="inline-flex text-primary">
                    <CheckCircle2 className="h-3.5 w-3.5 fill-primary text-white" />
                  </span>
                )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted">
              <span>{formatDate(review.createdAt)}</span>
              {review.job?.location && (
                <>
                  <span>·</span>
                  <span>{review.job.location}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Rating Stars & Numeric Value */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-0.5 text-amber-500">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={cn(
                  "h-4 w-4",
                  s <= Math.round(review.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-slate-100 text-slate-300",
                )}
              />
            ))}
          </div>
          <span className="font-display text-xs sm:text-sm font-bold text-title">
            {review.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Optional Job Context & Sub-ratings */}
      <div className="mt-3 pl-0 sm:pl-13 flex flex-wrap items-center gap-2">
        {review.job?.title && (
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
            <Briefcase className="h-3 w-3 text-muted" />
            {review.job.title}
          </span>
        )}
        {review.qualityRating != null && (
          <span className="rounded-md bg-slate-50 border border-line/60 px-2 py-0.5 text-[11px] font-medium text-title">
            Quality: {review.qualityRating}/5
          </span>
        )}
        {review.communicationRating != null && (
          <span className="rounded-md bg-slate-50 border border-line/60 px-2 py-0.5 text-[11px] font-medium text-title">
            Communication: {review.communicationRating}/5
          </span>
        )}
        {review.timelinessRating != null && (
          <span className="rounded-md bg-slate-50 border border-line/60 px-2 py-0.5 text-[11px] font-medium text-title">
            Timeliness: {review.timelinessRating}/5
          </span>
        )}
      </div>

      {/* Review Comment Body */}
      <div className="mt-3 pl-0 sm:pl-13">
        <p className="font-sans text-sm sm:text-[15px] leading-relaxed text-copy">
          &ldquo;{review.comment}&rdquo;
        </p>

        {/* 1. Public Response Thread (When already replied) */}
        {hasReply ? (
          <div className="mt-4 rounded-xl border-l-2 border-primary bg-slate-50/70 p-3.5 sm:p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {/* Artisan Real Avatar */}
                <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center relative">
                  {artisanAvatar ? (
                    <Image
                      src={getImageUrl(artisanAvatar) || artisanAvatar}
                      alt={artisanName}
                      width={28}
                      height={28}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-[11px] font-bold text-primary">
                      {getInitials(artisanName)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-display text-xs font-semibold text-title">
                    {artisanName}
                  </span>
                  {artisanObj?.verified && (
                    <span title="Verified Professional" className="inline-flex text-primary">
                      <CheckCircle2 className="h-3 w-3 fill-primary text-white" />
                    </span>
                  )}
                  <span className="rounded-full bg-primary/10 px-2 py-0.2 text-[10px] font-bold text-primary">
                    You
                  </span>
                  <span className="text-[11px] text-muted">
                    · Public response
                  </span>
                  {review.reply?.repliedAt && (
                    <span className="text-[11px] text-muted">
                      ({formatDate(review.reply.repliedAt)})
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartEdit}
                className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>

            <p className="font-sans text-xs sm:text-sm text-copy leading-relaxed pl-9">
              {review.reply?.comment}
            </p>
          </div>
        ) : (
          /* 2. Response Editor Form (When needs reply OR editing) */
          <div className="mt-4 rounded-xl border border-line/80 bg-slate-50/60 p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Artisan Avatar Preview */}
                <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full bg-primary/10 flex items-center justify-center relative">
                  {artisanAvatar ? (
                    <Image
                      src={getImageUrl(artisanAvatar) || artisanAvatar}
                      alt={artisanName}
                      width={24}
                      height={24}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] font-bold text-primary">
                      {getInitials(artisanName)}
                    </span>
                  )}
                </div>
                <span className="font-display text-xs font-semibold text-title flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-primary" />
                  {isEditing
                    ? "Edit your public response:"
                    : `Reply as ${artisanName}:`}
                </span>
              </div>

              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-xs font-medium text-muted hover:text-title cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>

            {/* Quick Reply Chips */}
            <div className="space-y-1.5">
              <span className="text-muted text-[10px] uppercase font-semibold flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-500" />
                Quick insert template:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setDraft(tmpl)}
                    className="rounded-md border border-line/80 bg-white px-2.5 py-1 text-xs text-copy hover:border-primary hover:text-primary transition-colors cursor-pointer text-left truncate max-w-sm"
                  >
                    &ldquo;{tmpl.slice(0, 36)}...&rdquo;
                  </button>
                ))}
              </div>
            </div>

            <TextArea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={`Write a professional public response to ${customerName}...`}
              className="min-h-[85px] bg-white text-xs sm:text-sm rounded-lg"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
              <span className="text-[11px] text-muted">
                Your response will appear publicly under this client review on
                your profile.
              </span>
              <Button
                type="button"
                size="sm"
                disabled={!draft.trim() || isSubmitting}
                onClick={handleSubmit}
                className="font-semibold text-xs rounded-lg inline-flex items-center gap-1.5 shrink-0 self-end sm:self-auto"
              >
                {isSubmitting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                {isEditing ? "Update Response" : "Post Public Response"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
