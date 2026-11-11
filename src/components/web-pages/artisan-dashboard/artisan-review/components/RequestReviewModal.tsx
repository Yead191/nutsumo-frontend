"use client";

import { useState } from "react";
import { Star, X, Copy, Check, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/field";
import { toast } from "sonner";
import type { ArtisanUserProfile } from "../types";

interface RequestReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: ArtisanUserProfile | null;
}

export function RequestReviewModal({
  isOpen,
  onClose,
  profile,
}: RequestReviewModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const artisanName = profile?.businessName || profile?.name || "our team";
  const getReviewUrl = () => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      const identifier = profile?.slug || profile?._id || profile?.id;
      return identifier
        ? `${origin}/pro/${identifier}#reviews`
        : `${origin}/pro/profile`;
    }
    return "https://nutsumo.com/pro/reviews";
  };

  const reviewUrl = getReviewUrl();

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(reviewUrl);
        setCopied(true);
        toast.success("Review invite link copied!");
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const sampleMessage = `Hi! Thanks for choosing ${artisanName} for your recent service. If you have 30 seconds, sharing your honest feedback helps us tremendously: ${reviewUrl}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-line bg-white p-6 shadow-xl animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-line pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
              <Star className="h-5 w-5 fill-primary text-primary" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-title">
                Request a Client Review
              </h3>
              <p className="text-xs text-muted">
                Invite past homeowners &amp; clients to review your work
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted hover:text-title cursor-pointer p-1 rounded-lg hover:bg-slate-100 transition-colors"
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
                value={reviewUrl}
                className="font-mono text-xs bg-smoke"
              />
              <Button
                type="button"
                size="sm"
                onClick={handleCopyLink}
                className="shrink-0 font-semibold text-xs rounded-xl"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 mr-1 text-white" />
                ) : (
                  <Copy className="h-3.5 w-3.5 mr-1" />
                )}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-line/70 bg-slate-50/60 p-3.5 space-y-2">
            <p className="text-xs font-semibold text-title flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-primary" />
              Recommended SMS &amp; Email message:
            </p>
            <p className="text-xs text-muted italic bg-white p-3 rounded-lg border border-line/60 leading-relaxed font-sans">
              &ldquo;{sampleMessage}&rdquo;
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-line/60">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-xs rounded-xl"
            >
              Close
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                handleCopyLink();
                onClose();
              }}
              className="font-semibold text-xs rounded-xl"
            >
              <Send className="h-3.5 w-3.5 mr-1.5" />
              Copy &amp; Finish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
