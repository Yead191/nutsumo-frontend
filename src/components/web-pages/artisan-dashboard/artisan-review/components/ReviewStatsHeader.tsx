"use client";

import { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { ArtisanUserProfile } from "../types";

interface ReviewStatsHeaderProps {
  profile?: ArtisanUserProfile | null;
  onRequestReview: () => void;
}

export function ReviewStatsHeader({
  profile,
  onRequestReview,
}: ReviewStatsHeaderProps) {
  const [copied, setCopied] = useState(false);

  const getProfileLink = () => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      const identifier = profile?.slug || profile?._id || profile?.id;
      return identifier
        ? `${origin}/pro/${identifier}#reviews`
        : `${origin}/pro/profile`;
    }
    return "https://nutsumo.com/pro/reviews";
  };

  const handleCopyLink = async () => {
    const link = getProfileLink();
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(link);
        setCopied(true);
        toast.success("Direct review invite link copied to clipboard!");
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line/70 pb-4 pt-1">
      <div>
        <h1 className="font-display text-[22px] sm:text-[24px] font-semibold tracking-tight text-title">
          Client Reviews &amp; Feedback
        </h1>
        <p className="text-xs text-muted mt-0.5">
          Monitor your customer reputation, view feedback metrics, and publish
          verified replies.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCopyLink}
          className="shadow-2xs text-xs font-semibold rounded-xl bg-white hover:bg-smoke border border-line/70 transition-all"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
          ) : (
            <Copy className="h-3.5 w-3.5 mr-1.5" />
          )}
          {copied ? "Link Copied!" : "Copy Review Link"}
        </Button>

        <Button
          type="button"
          size="sm"
          onClick={onRequestReview}
          className="shadow-xs text-xs font-semibold rounded-xl"
        >
          <Share2 className="h-3.5 w-3.5 mr-1.5" />
          Request a Review
        </Button>
      </div>
    </div>
  );
}
