"use client";

import React, { useState, useEffect } from "react";
import {
  Camera,
  Briefcase,
  MapPin,
  Clock,
  Save,
  CheckCircle2,
  AlertCircle,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, TextField, TextArea } from "@/components/ui/field";
import { toast } from "sonner";
import { updateArtisanProfile } from "@/helpers/next-fetch/apiActions/artisanActions";
import { getImageUrl } from "@/lib/getImageUrl";

export function ProfessionalProfileManager({ user }: { user?: any }) {
  const [isSaving, setIsSaving] = useState(false);

  // Directly initialize form from the passed user response (Strictly no mock data)
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    image: user?.image || "",
    businessName: user?.businessName || "",
    trade: user?.trade || "",
    location: user?.location || "",
    phone: user?.phone || "",
    experienceYears: user?.experienceYears ?? 0,
    bio: user?.bio || "",
    availabilityStatus:
      (user?.availabilityStatus as "Available" | "Booked" | "Unavailable") ||
      "Available",
    identityStatus:
      (user?.identityStatus as
        | "not_submitted"
        | "pending"
        | "verified"
        | "needs_update") || "not_submitted",
  });

  // Sync state if user prop updates (No GET API call inside useEffect)
  useEffect(() => {
    if (user) {
      setForm({
        name: user?.name || "",
        email: user?.email || "",
        image: user?.image || "",
        businessName: user?.businessName || "",
        trade: user?.trade || "",
        location: user?.location || "",
        phone: user?.phone || "",
        experienceYears: user?.experienceYears ?? 0,
        bio: user?.bio || "",
        availabilityStatus: user?.availabilityStatus || "Available",
        identityStatus: user?.identityStatus || "not_submitted",
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await updateArtisanProfile({
        name: form.name,
        businessName: form.businessName,
        trade: form.trade,
        location: form.location,
        phone: form.phone,
        experienceYears: Number(form.experienceYears) || 0,
        bio: form.bio,
        availabilityStatus: form.availabilityStatus,
      });

      if (res?.success) {
        toast.success("Professional profile saved successfully!");
      } else {
        toast.error(res?.message || "Failed to save profile");
      }
    } catch {
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvailabilityChange = async (
    status: "Available" | "Booked" | "Unavailable",
  ) => {
    setForm((prev) => ({ ...prev, availabilityStatus: status }));
    try {
      const res = await updateArtisanProfile({ availabilityStatus: status });
      if (res?.success) {
        toast.success(`Availability status updated to ${status}`);
      } else {
        toast.error(res?.message || "Failed to update availability status");
      }
    } catch {
      toast.error("Failed to update availability status");
    }
  };

  const displayImage = form.image ? getImageUrl(form.image) || form.image : "";

  return (
    <div className="space-y-8 pb-16">
      {/* Top Hero / Identity Header */}
      <div className="relative overflow-hidden rounded-3xl border border-line/80 bg-gradient-to-br from-white via-white to-slate-50 p-6 sm:p-8 shadow-xs">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative group shrink-0">
              <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl overflow-hidden ring-4 ring-white shadow-md bg-smoke flex items-center justify-center">
                {displayImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={displayImage}
                    alt={form.name || "Artisan"}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <User className="h-12 w-12 text-muted opacity-40" />
                )}
              </div>
              <button
                type="button"
                className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-primary text-white shadow-sm hover:scale-105 transition"
                title="Profile Photo"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-xl sm:text-2xl font-black tracking-tight text-title">
                  {form.businessName || form.name || "Artisan Profile"}
                </h1>
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
              </div>

              <p className="text-sm font-semibold text-primary flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 shrink-0" />
                {form.trade || "No trade specified"} •{" "}
                {form.experienceYears || 0} Years Experience
              </p>

              <p className="text-xs text-muted flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-muted" />
                  {form.location || "Location not set"}
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
                        onClick={() => handleAvailabilityChange(status)}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                          isActive
                            ? status === "Available"
                              ? "bg-emerald-600 text-white shadow-2xs"
                              : status === "Booked"
                                ? "bg-amber-500 text-white shadow-2xs"
                                : "bg-rose-500 text-white shadow-2xs"
                            : "text-muted hover:text-title"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            isActive
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
              onClick={handleSave}
              disabled={isSaving}
              className="h-10 px-5 text-sm font-bold shadow-sm mt-5 sm:mt-5 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Profile Form */}
      <Card className="rounded-3xl border border-line/80 bg-white p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="border-b border-line pb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-title">
              Professional & Business Information
            </h2>
            <p className="text-xs text-muted">
              Configure your artisan identity, business contact details, and
              customer bio.
            </p>
          </div>
          <span className="text-xs text-muted">
            Status:{" "}
            <strong className="text-title">{form.availabilityStatus}</strong>
          </span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full Name">
            <TextField
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. John Doe"
            />
          </Field>

          <Field label="Business / Trading Name">
            <TextField
              value={form.businessName}
              onChange={(e) =>
                setForm({ ...form, businessName: e.target.value })
              }
              placeholder="e.g. Acme Premier Crafts"
            />
          </Field>

          <Field label="Primary Trade / Specialty">
            <TextField
              value={form.trade}
              onChange={(e) => setForm({ ...form, trade: e.target.value })}
              placeholder="e.g. Master Plumber, Finish Carpenter"
            />
          </Field>

          <Field label="Service Location / Coverage Area">
            <TextField
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Austin, TX Metro"
            />
          </Field>

          <Field label="Direct Phone Number">
            <TextField
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="(512) 555-0198"
            />
          </Field>

          <Field label="Email Address (Login)">
            <TextField
              value={form.email}
              disabled
              className="bg-slate-50 text-muted cursor-not-allowed"
            />
          </Field>

          <Field label="Years of Experience">
            <TextField
              type="number"
              min={0}
              value={form.experienceYears}
              onChange={(e) =>
                setForm({
                  ...form,
                  experienceYears: Number(e.target.value) || 0,
                })
              }
              placeholder="5"
            />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Professional Bio & Craftsmanship Statement">
              <TextArea
                rows={4}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Describe your background, specialty skills, and client standards..."
              />
            </Field>
          </div>
        </div>

        <div className="pt-4 border-t border-line flex items-center justify-between">
          <p className="text-xs text-muted">
            Profile details update live across your artisan storefront and client
            quotes.
          </p>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 font-bold text-xs"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
