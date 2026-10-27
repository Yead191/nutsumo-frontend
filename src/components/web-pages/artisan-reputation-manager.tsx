"use client";

import React from "react";
import {
  ShieldCheck,
  Star,
  Sparkles,
  CheckCircle2,
  Award,
  Clock,
  TrendingUp,
  ThumbsUp,
  Lock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ArtisanReputationManager() {
  // Read-only mock reputation metrics
  const reputation = {
    identityStatus: "verified",
    rating: 4.95,
    reviewCount: 38,
    completedJobsCount: 42,
    onTimeRate: 100,
    repeatClientRate: 46,
    superArtisanStatus: true,
    reputationTier: "Top Rated Super Artisan",
    memberSince: "May 2024",
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="border-b border-line pb-6">
        <h1 className="font-display text-2xl font-black tracking-tight text-title flex items-center gap-2">
          Reputation & Trust Badges
          <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold">
            Verified Pro
          </span>
        </h1>
        <p className="text-xs text-muted mt-1">
          These verified metrics, trust badges, and reviews are generated from client transactions and platform background checks. (Read-only)
        </p>
      </div>

      {/* Super Artisan Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-200/80 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shrink-0">
              <Sparkles className="h-7 w-7 fill-white" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-bold text-title">
                  Super Artisan Status • Active
                </h2>
                <span className="rounded-md bg-amber-100 text-amber-800 px-2 py-0.5 text-[11px] font-bold">
                  Top 5% Platform Tier
                </span>
              </div>
              <p className="text-xs text-muted max-w-xl">
                Your profile is boosted with priority visibility in client searches, exclusive direct request leads, and the gold verified badge.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-bold text-amber-900 bg-amber-100/90 border border-amber-200 px-3 py-1.5 rounded-xl">
              Tier: {reputation.reputationTier}
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Rating */}
        <Card className="rounded-3xl border border-line/80 bg-white p-6 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-muted uppercase tracking-wider block">
            Customer Rating
          </span>
          <div className="flex items-center gap-2">
            <Star className="h-6 w-6 text-amber-500 fill-amber-400" />
            <span className="font-display text-3xl font-black text-title">
              {reputation.rating}
            </span>
          </div>
          <p className="text-xs text-muted">
            Based on <strong>{reputation.reviewCount}</strong> verified client reviews
          </p>
        </Card>

        {/* Completed Jobs */}
        <Card className="rounded-3xl border border-line/80 bg-white p-6 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-muted uppercase tracking-wider block">
            Verified Completed Jobs
          </span>
          <div className="flex items-center gap-2">
            <span className="font-display text-3xl font-black text-emerald-600">
              {reputation.completedJobsCount}
            </span>
          </div>
          <p className="text-xs text-muted">100% completed on schedule</p>
        </Card>

        {/* On-Time Arrival */}
        <Card className="rounded-3xl border border-line/80 bg-white p-6 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-muted uppercase tracking-wider block">
            On-Time Arrival Rate
          </span>
          <div className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            <span className="font-display text-3xl font-black text-title">
              {reputation.onTimeRate}%
            </span>
          </div>
          <p className="text-xs text-muted">Calculated from client confirmations</p>
        </Card>

        {/* Repeat Clients */}
        <Card className="rounded-3xl border border-line/80 bg-white p-6 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-muted uppercase tracking-wider block">
            Repeat Client Rate
          </span>
          <div className="flex items-center gap-2">
            <ThumbsUp className="h-6 w-6 text-blue-500" />
            <span className="font-display text-3xl font-black text-title">
              {reputation.repeatClientRate}%
            </span>
          </div>
          <p className="text-xs text-muted">Homeowners who re-hired you</p>
        </Card>
      </div>

      {/* Safety & Verification Checklist */}
      <Card className="rounded-3xl border border-line/80 bg-white p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <h3 className="font-display text-lg font-bold text-title flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              Platform Identity & Safety Status
            </h3>
            <p className="text-xs text-muted">
              Credentials confirmed by platform administrators for client safety.
            </p>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-muted">
            <Lock className="h-3.5 w-3.5" /> Managed by Platform Admins
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-start gap-3 p-4 rounded-2xl border border-emerald-100 bg-emerald-50/40">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-title">National ID Verified</h4>
              <p className="text-xs text-muted">
                Government photo ID card (front & back) confirmed.
              </p>
              <span className="inline-block mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                Verified ✓
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl border border-emerald-100 bg-emerald-50/40">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-title">Biometric Live Camera Selfie</h4>
              <p className="text-xs text-muted">
                Facial recognition biometric match confirmed against ID.
              </p>
              <span className="inline-block mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                Matched ✓
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl border border-emerald-100 bg-emerald-50/40">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-title">Background Check</h4>
              <p className="text-xs text-muted">
                Clean criminal background check on file.
              </p>
              <span className="inline-block mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                Cleared ✓
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted">
          <span>Need to update your legal name or submit a new ID document?</span>
          <Link
            href="/verify-identity"
            className="font-bold text-primary hover:underline self-start sm:self-auto"
          >
            Update Identity Verification →
          </Link>
        </div>
      </Card>
    </div>
  );
}
