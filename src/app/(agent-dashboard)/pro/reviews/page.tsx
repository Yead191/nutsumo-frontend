"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Copy,
  MessageSquare,
  Send,
  Share2,
  Star,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { TextArea, TextField } from "@/components/ui/field";
import { replyToReview, addNotification } from "@/redux/slices/featuresSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { cn } from "@/lib/cn";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

type FilterType =
  | "all"
  | "needs-reply"
  | "replied"
  | "5-star"
  | "4-star"
  | "3-star"
  | "2-star"
  | "1-star";

export default function ProReviewsPage() {
  const dispatch = useAppDispatch();
  const reviews = useAppSelector((state) =>
    state.features.reviews.filter((item) => item.proId === "pro-1")
  );
  const proProfile = useAppSelector((state) => state.features.proProfile);

  const [replyDraft, setReplyDraft] = useState<Record<string, string>>({});
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick reply templates for faster pro workflows
  const quickTemplates = [
    "Thank you for your business! Glad we could help get this resolved.",
    "Appreciate your trust and recommendation. Always here if you need anything!",
    "Thanks for the kind words! We take pride in clean and timely work.",
  ];

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }

  // Calculate statistics
  const stats = useMemo(() => {
    if (!reviews.length) {
      return { avg: 5.0, total: 0, repliedCount: 0, needsReplyCount: 0 };
    }
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = Number((sum / reviews.length).toFixed(1));
    const repliedCount = reviews.filter((r) => Boolean(r.reply)).length;
    const needsReplyCount = reviews.filter((r) => !r.reply).length;
    return { avg, total: reviews.length, repliedCount, needsReplyCount };
  }, [reviews]);

  // Star Rating Breakdown (5 to 1) for visual distribution
  const breakdown = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = Math.min(Math.max(Math.round(r.rating), 1), 5);
      counts[star] = (counts[star] || 0) + 1;
    });
    const starKeys: Record<number, FilterType> = {
      5: "5-star",
      4: "4-star",
      3: "3-star",
      2: "2-star",
      1: "1-star",
    };
    return ([5, 4, 3, 2, 1] as const).map((star) => {
      const count = counts[star] || 0;
      const percentage = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
      return { star, count, percentage, filterKey: starKeys[star] };
    });
  }, [reviews]);

  // Filter reviews
  const filteredReviews = useMemo(() => {
    switch (selectedFilter) {
      case "needs-reply":
        return reviews.filter((r) => !r.reply);
      case "replied":
        return reviews.filter((r) => Boolean(r.reply));
      case "5-star":
        return reviews.filter((r) => r.rating === 5);
      case "4-star":
        return reviews.filter((r) => r.rating === 4);
      case "3-star":
        return reviews.filter((r) => r.rating === 3);
      case "2-star":
        return reviews.filter((r) => r.rating === 2);
      case "1-star":
        return reviews.filter((r) => r.rating === 1);
      default:
        return reviews;
    }
  }, [reviews, selectedFilter]);

  function handlePostReply(reviewId: string) {
    const text = replyDraft[reviewId]?.trim();
    if (!text) return;
    dispatch(replyToReview({ id: reviewId, reply: text }));
    setReplyDraft((prev) => ({ ...prev, [reviewId]: "" }));
    setEditingReplyId(null);
    showToast("Response posted publicly to client review.");
  }

  function handleCopyReviewLink() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText("https://localhomefix.com/review/ortega-plumbing");
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
      showToast("Direct review invite link copied to clipboard!");
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Floating Interactive Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-title px-4 py-3 text-white shadow-xl text-xs sm:text-sm font-medium animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header with Title & Direct Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line/70 pb-4 pt-1">
        <div>
          <h1 className="font-display text-[24px] font-semibold tracking-tight text-title">
            Reviews
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopyReviewLink}
            className="shadow-2xs text-xs font-semibold rounded-xl bg-white hover:bg-smoke"
          >
            <Copy className="h-3.5 w-3.5 mr-1.5" />
            {linkCopied ? "Link Copied!" : "Copy Review Link"}
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => setShowRequestModal(true)}
            className="shadow-xs text-xs font-semibold rounded-xl"
          >
            <Share2 className="h-3.5 w-3.5 mr-1.5" />
            Request a Review
          </Button>
        </div>
      </div>

      {/* 2. Rating Breakdown Scorecard Widget */}
      <Card className="rounded-xl border border-line/80 bg-white p-5 sm:p-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {/* Left Column: Overall Rating Score */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left md:border-r border-line/70 md:pr-6 justify-between py-0.5">
            <div>
              <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted">
                Average Rating
              </p>

              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-title">
                  {stats.avg.toFixed(1)}
                </span>
                <span className="text-sm font-medium text-muted">/ 5.0</span>
              </div>

              <div className="mt-2 flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.floor(stats.avg)
                        ? "fill-amber-400 text-amber-500"
                        : i < stats.avg
                          ? "fill-amber-400/50 text-amber-500"
                          : "fill-slate-100 text-slate-300"
                    )}
                  />
                ))}
              </div>

              <p className="mt-2 text-xs font-medium text-title/70">
                Based on {stats.total} verified {stats.total === 1 ? "review" : "reviews"}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-line/60 w-full flex items-center justify-center md:justify-start">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                100% Client Satisfaction
              </span>
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col justify-between py-0.5">
            <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted px-2.5">
              <span>Rating Breakdown</span>
              {selectedFilter !== "all" ? (
                <button
                  type="button"
                  onClick={() => setSelectedFilter("all")}
                  className="text-primary hover:underline text-[11px] font-medium lowercase first-letter:uppercase"
                >
                  Clear filter
                </button>
              ) : (
                <span className="text-[11px] font-normal text-muted lowercase">click star to filter</span>
              )}
            </div>

            <div className="space-y-1">
              {breakdown.map(({ star, count, percentage, filterKey }) => {
                const isSelected = selectedFilter === filterKey;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setSelectedFilter((prev) => (prev === filterKey ? "all" : filterKey))
                    }
                    className={cn(
                      "group flex w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 py-1.5 text-xs transition-colors",
                      isSelected
                        ? "bg-slate-100 font-semibold text-title"
                        : "text-title hover:bg-slate-50"
                    )}
                  >
                    <span className="flex w-10 shrink-0 items-center gap-1 font-medium text-title">
                      <span>{star}</span>
                      <Star className="h-3 w-3 shrink-0 fill-amber-400 text-amber-500" />
                    </span>

                    {/* Visual Progress Bar Track */}
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden relative">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-300",
                          count > 0 ? "bg-amber-400 group-hover:bg-amber-500" : "bg-transparent",
                          isSelected && "bg-title"
                        )}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    {/* Percentage & Count Badge */}
                    <div className="w-14 text-right shrink-0 flex items-center justify-end gap-1 text-[11px]">
                      <span className="font-medium text-title">{count}</span>
                      <span className="text-muted">({percentage}%)</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* 3. Filter Tabs Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <Tabs
          value={selectedFilter}
          onChange={setSelectedFilter}
          items={[
            { key: "all", label: "All", count: stats.total },
            { key: "needs-reply", label: "Needs reply", count: stats.needsReplyCount },
            { key: "replied", label: "Replied", count: stats.repliedCount },
          ]}
        />

        <Tabs
          value={selectedFilter}
          onChange={(key) => setSelectedFilter(key === selectedFilter ? "all" : key)}
          items={([5, 4, 3, 2, 1] as const).map((star) => ({
            key: `${star}-star` as FilterType,
            label: `${star}`,
            icon: Star,
          }))}
        />
      </div>

      {/* 4. Review Cards List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <Card className="rounded-xl border border-line/80 bg-white p-8 text-center">
            <p className="text-sm font-semibold text-title">No reviews match this filter.</p>
            <button
              type="button"
              onClick={() => setSelectedFilter("all")}
              className="mt-2 text-xs font-semibold text-primary hover:underline"
            >
              Reset to all reviews
            </button>
          </Card>
        ) : (
          filteredReviews.map((review) => {
            const isEditingThis = editingReplyId === review.id;
            const hasReply = Boolean(review.reply) && !isEditingThis;

            return (
              <Card
                key={review.id}
                className="rounded-xl border border-line/80 bg-white p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all duration-200"
              >
                {/* Review Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* User Avatar */}
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 font-display text-xs font-semibold text-slate-700 border border-slate-200/80">
                      {initials(review.author)}
                    </div>

                    <div>
                      <p className="font-display text-sm font-semibold text-title sm:text-base">
                        {review.author}
                      </p>
                      <p className="text-xs text-muted">
                        Austin, TX · {review.createdAt}
                      </p>
                    </div>
                  </div>

                  {/* Rating Stars & Numeric Value */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="font-display text-xs sm:text-sm font-bold text-title">
                      {review.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Review Body */}
                <div className="mt-3.5 pl-0 sm:pl-12">
                  <p className="font-sans text-sm sm:text-[15px] leading-relaxed text-copy">
                    &ldquo;{review.body}&rdquo;
                  </p>

                  {/* Public Response Thread */}
                  {hasReply ? (
                    <div className="mt-3.5 rounded-lg border-l-2 border-primary/40 bg-slate-50/70 p-3 sm:p-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="grid h-5 w-5 place-items-center rounded-md bg-primary text-white text-[10px] font-bold">
                            {proProfile?.contactName?.[0] || "L"}
                          </span>
                          <span className="font-display text-xs font-semibold text-title">
                            {proProfile?.contactName ?? "Luis Ortega"} (You)
                          </span>
                          <span className="text-[11px] text-muted">· Public response</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingReplyId(review.id);
                            setReplyDraft((prev) => ({ ...prev, [review.id]: review.reply || "" }));
                          }}
                          className="text-[11px] font-medium text-primary hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="font-sans text-xs sm:text-sm text-copy leading-relaxed pl-7">
                        {review.reply}
                      </p>
                    </div>
                  ) : (
                    /* Response Form (When Needs Reply or Editing) */
                    <div className="mt-3.5 rounded-xl border border-line/80 bg-slate-50/50 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-display text-xs font-semibold text-title flex items-center gap-1.5">
                          <MessageSquare className="h-3.5 w-3.5 text-primary" />
                          {isEditingThis ? "Edit your public response:" : "Reply to client feedback:"}
                        </span>
                        {isEditingThis && (
                          <button
                            type="button"
                            onClick={() => setEditingReplyId(null)}
                            className="text-xs text-muted hover:text-title cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>

                      {/* Quick Reply Chips */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="text-muted text-[10px] uppercase font-semibold">Quick insert:</span>
                        {quickTemplates.map((template, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() =>
                              setReplyDraft((prev) => ({
                                ...prev,
                                [review.id]: template,
                              }))
                            }
                            className="rounded-md border border-line/80 bg-white px-2 py-0.5 text-xs text-copy hover:border-primary hover:text-primary transition-colors cursor-pointer text-left truncate max-w-xs"
                          >
                            &ldquo;{template.slice(0, 32)}...&rdquo;
                          </button>
                        ))}
                      </div>

                      <TextArea
                        value={replyDraft[review.id] ?? ""}
                        onChange={(event) =>
                          setReplyDraft((prev) => ({ ...prev, [review.id]: event.target.value }))
                        }
                        placeholder={`Write a professional public response to ${review.author}...`}
                        className="min-h-[85px] bg-white text-xs sm:text-sm rounded-lg"
                      />

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-muted">
                          Your response is visible to all potential clients on your storefront.
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          disabled={!(replyDraft[review.id] ?? "").trim()}
                          onClick={() => handlePostReply(review.id)}
                          className="font-medium text-xs rounded-lg"
                        >
                          <Send className="h-3 w-3 mr-1.5" />
                          {isEditingThis ? "Update Response" : "Post Public Response"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* ============================================================ */}
      {/* MODAL: REQUEST A REVIEW INVITE                               */}
      {/* ============================================================ */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-[22px] border border-line bg-white p-6 shadow-xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-line pb-3.5">
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Star className="h-5 w-5 fill-primary text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-title">
                    Request a Client Review
                  </h3>
                  <p className="text-xs text-muted">Invite past Austin homeowners to review your work</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowRequestModal(false)}
                className="text-muted hover:text-title cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs sm:text-sm text-copy">
              <div>
                <label className="block text-xs font-semibold text-title mb-1.5">
                  Your Shareable Review Link
                </label>
                <div className="flex items-center gap-2">
                  <TextField
                    readOnly
                    value="https://localhomefix.com/review/ortega-plumbing"
                    className="font-mono text-xs bg-smoke"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleCopyReviewLink}
                    className="shrink-0 font-semibold text-xs"
                  >
                    <Copy className="h-3.5 w-3.5 mr-1" />
                    {linkCopied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>

              <div className="rounded-xl border border-line/70 bg-surface/50 p-3.5 space-y-2">
                <p className="text-xs font-semibold text-title flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-primary" />
                  Recommended SMS &amp; Email message:
                </p>
                <p className="text-xs text-muted italic bg-white p-3 rounded-lg border border-line/60 leading-relaxed">
                  &ldquo;Hi! Thanks for choosing Ortega Plumbing for your repair. If you have 30 seconds, sharing your review on LocalHomeFix helps our family business tremendously: https://localhomefix.com/review/ortega-plumbing&rdquo;
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-line/60">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRequestModal(false)}
                  className="text-xs"
                >
                  Close
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    dispatch(
                      addNotification({
                        title: "Review invite queued",
                        body: "Review invitation sent to recent client.",
                        href: "/pro/reviews",
                        createdAt: "Just now",
                        role: "pro",
                      })
                    );
                    setShowRequestModal(false);
                    showToast("Review invitation sent to client.");
                  }}
                  className="font-semibold text-xs"
                >
                  <Send className="h-3.5 w-3.5 mr-1.5" />
                  Send Invite to Recent Client
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

