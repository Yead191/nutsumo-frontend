"use client";

import React, { useRef } from "react";
import {
  Camera,
  Briefcase,
  MapPin,
  Clock,
  Save,
  CheckCircle2,
  AlertCircle,
  User,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/getImageUrl";
import type { ProfileFormState, AvailabilityStatus } from "../types";
import Image from "next/image";

interface ProfileHeroCardProps {
  form: ProfileFormState;
  previewUrl: string | null;
  hasNewImage: boolean;
  isSaving: boolean;
  onImagePick: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetImage: () => void;
  onAvailabilityChange: (status: AvailabilityStatus) => void;
  onSave: () => void;
}

export function ProfileHeroCard({
  form,
  previewUrl,
  hasNewImage,
  isSaving,
  onImagePick,
  onResetImage,
  onAvailabilityChange,
  onSave,
}: ProfileHeroCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine active display image
  const displayImage =
    previewUrl || (form.image ? getImageUrl(form.image) || form.image : "");

  return (
    <div className="relative overflow-hidden rounded-3xl border border-line/80 bg-linear-to-br from-white via-white to-slate-50 p-6 sm:p-8 shadow-xs">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg,image/webp"
        onChange={onImagePick}
        className="hidden"
      />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar and Change Photo */}
          <div className="relative group shrink-0">
            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl overflow-hidden ring-4 ring-white shadow-md bg-smoke flex items-center justify-center relative">
              {displayImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <Image
                  src={displayImage}
                  alt={form.name || "Artisan"}
                  width={300}
                  height={300}
                  draggable={false}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              ) : (
                <User className="h-12 w-12 text-muted opacity-40" />
              )}

              {/* Hover overlay hint */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer"
              >
                <Camera className="h-5 w-5 mb-0.5" />
                Change
              </div>
            </div>

            {/* Quick Camera Trigger Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-primary text-white shadow-sm hover:scale-110 active:scale-95 transition-all"
              title="Upload new profile photo"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-xl sm:text-2xl font-black tracking-tight text-title">
                {form.name || form.businessName || "Artisan Profile"}
              </h1>

              {/* Identity Verification Badges */}
              {form.identityStatus === "verified" ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 text-xs font-bold text-emerald-700 shadow-2xs">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Verified Artisan
                </span>
              ) : form.identityStatus === "pending" ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 text-xs font-bold text-amber-700 shadow-2xs">
                  <Clock className="h-3.5 w-3.5 text-amber-600" />
                  Verification Pending
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-xs font-bold text-slate-700 shadow-2xs">
                  <AlertCircle className="h-3.5 w-3.5 text-slate-500" />
                  Unverified
                </span>
              )}

              {/* New Image Indicator with Reset */}
              {hasNewImage && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[11px] font-bold text-primary">
                  New Photo Selected
                  <button
                    type="button"
                    onClick={onResetImage}
                    className="p-0.5 hover:text-rose-600 transition"
                    title="Reset to previous photo"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>

            <p className="text-sm font-semibold text-primary flex items-center gap-1.5">
              <Briefcase className="h-4 w-4 shrink-0" />
              {form.trade || "No trade specified"} • {form.experienceYears || 0}{" "}
              Years Experience
            </p>

            <p className="text-xs text-muted flex items-center gap-2">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-muted" />
                {form.location
                  ? `${form.location}${form.postCode ? ` (${form.postCode})` : ""}`
                  : form.postCode || "Location not set"}
              </span>
              {form.phone && (
                <>
                  <span>•</span>
                  <span>{form.phone}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Live Availability Selector & Save Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2 md:pt-0">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted block mb-1">
              Live Availability
            </label>
            <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-line">
              {(["Available", "Booked", "Unavailable"] as const).map(
                (status) => {
                  const isActive = form.availabilityStatus === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => onAvailabilityChange(status)}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${isActive
                          ? status === "Available"
                            ? "bg-emerald-600 text-white shadow-2xs"
                            : status === "Booked"
                              ? "bg-amber-500 text-white shadow-2xs"
                              : "bg-rose-500 text-white shadow-2xs"
                          : "text-muted hover:text-title"
                        }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${isActive
                            ? "bg-white animate-pulse"
                            : status === "Available"
                              ? "bg-emerald-500"
                              : status === "Booked"
                                ? "bg-amber-500"
                                : "bg-rose-500"
                          }`}
                      />
                      {status}
                    </button>
                  );
                },
              )}
            </div>
          </div>

          <Button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className=" text-sm font-bold shadow-sm mt-5 sm:mt-5 flex items-center gap-2"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-8 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
