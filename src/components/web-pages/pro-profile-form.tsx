"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Building2,
  CheckCircle2,
  Clock,
  Image as ImageIcon,
  Plus,
  ShieldCheck,
  Trash2,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { Field, NativeSelect, TextArea, TextField } from "@/components/ui/field";
import { defaultProProfile, demoProUser } from "@/Mockdata";
import type { ProServiceItem } from "@/types";
import { cn } from "@/lib/cn";
import {
  TIME_OPTIONS,
  WEEK_DAYS,
  allDaysMatch,
  applyHoursToDays,
  normalizeWeeklyHours,
  type DaySchedule,
  type Weekday,
} from "@/lib/business-hours";
import { CredentialAttachment } from "@/components/shared/credential-attachment";
import {
  defaultInsuranceDoc,
  defaultLicenseDoc,
  fileFromUpload,
  validateCredentialFile,
} from "@/lib/credential-file";

const PAYMENT_METHODS = [
  "Cash",
  "Check",
  "Credit or debit",
  "Zelle",
  "Venmo",
  "Apple Pay",
  "Google Pay",
  "Bank transfer",
  "PayPal",
] as const;

const PAYMENT_ALIASES: Record<string, (typeof PAYMENT_METHODS)[number]> = {
  "Credit/Debit Card": "Credit or debit",
  "Bank Transfer (ACH)": "Bank transfer",
  Stripe: "Credit or debit",
};

function normalizeAcceptedPayments(raw: string[]) {
  const next = new Set<(typeof PAYMENT_METHODS)[number]>();
  raw.forEach((value) => {
    const mapped = PAYMENT_ALIASES[value] ?? (PAYMENT_METHODS.includes(value as (typeof PAYMENT_METHODS)[number])
      ? (value as (typeof PAYMENT_METHODS)[number])
      : undefined);
    if (mapped) next.add(mapped);
  });
  return [...next];
}

export function ProProfileForm() {
  const user = demoProUser;
  const proProfile = defaultProProfile;

  const [activeTab, setActiveTab] = useState<
    "services" | "overview" | "hours" | "credentials" | "portfolio"
  >("services");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    ...proProfile,
    businessHours: normalizeWeeklyHours(proProfile.businessHours),
    licenseDoc: proProfile.licenseDoc ?? defaultLicenseDoc(),
    insuranceDoc: proProfile.insuranceDoc ?? defaultInsuranceDoc(),
    insuranceExpires: proProfile.insuranceExpires ?? "2027-09",
    insuranceCoverage: ["$500,000", "$1,000,000", "$2,000,000"].includes(proProfile.insuranceCoverage)
      ? proProfile.insuranceCoverage
      : "$1,000,000",
    acceptedPayments: normalizeAcceptedPayments(proProfile.acceptedPayments),
  });
  const [docErrors, setDocErrors] = useState<{ license?: string; insurance?: string }>({});
  const [hoursMode, setHoursMode] = useState<"all" | "custom">(() =>
    allDaysMatch(normalizeWeeklyHours(proProfile.businessHours)) ? "all" : "custom",
  );

  // Inline "Add Service" state
  const [newService, setNewService] = useState({
    name: "",
    price: 95,
    unit: "starting rate",
    description: "",
  });
  const [showAddService, setShowAddService] = useState(false);

  // Inline "Add Photo" state
  const [newPhoto, setNewPhoto] = useState({
    title: "",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
  });
  const [showAddPhoto, setShowAddPhoto] = useState(false);

  if (!user) return null;

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }

  function handleSaveAll() {
    showToast("Profile changes saved successfully!");
  }

  // Service helpers
  function handleAddService() {
    if (!newService.name.trim()) return;
    const item: ProServiceItem = {
      id: `srv-${Date.now()}`,
      name: newService.name.trim(),
      price: Number(newService.price) || 50,
      unit: newService.unit.trim() || "starting rate",
      description: newService.description.trim(),
    };
    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, item],
    }));
    setNewService({ name: "", price: 95, unit: "starting rate", description: "" });
    setShowAddService(false);
    showToast("Service added");
  }

  function handleRemoveService(id: string) {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.id !== id),
    }));
  }

  function cloneDay(day: DaySchedule): DaySchedule {
    return { status: day.status, slots: day.slots.map((slot) => ({ ...slot })) };
  }

  function writeDayHours(days: Weekday[], nextDay: DaySchedule) {
    setFormData((prev) => ({
      ...prev,
      businessHours: applyHoursToDays(nextDay, days, prev.businessHours),
    }));
  }

  function targetDays(day: Weekday): Weekday[] {
    return hoursMode === "all" ? WEEK_DAYS.map((item) => item.key) : [day];
  }

  function updateDayHours(day: Weekday, next: DaySchedule) {
    writeDayHours(targetDays(day), next);
  }

  function changeHoursMode(mode: "all" | "custom") {
    setHoursMode(mode);
    if (mode === "all") {
      writeDayHours(
        WEEK_DAYS.map((item) => item.key),
        cloneDay(formData.businessHours.monday),
      );
    }
  }

  function addBreak(day: Weekday) {
    const current = formData.businessHours[day];
    if (current.slots.length >= 2) return;
    const first = current.slots[0] ?? { open: "8:00 AM", close: "6:00 PM" };
    updateDayHours(day, {
      ...current,
      slots: [
        { open: first.open, close: "12:00 PM" },
        { open: "1:00 PM", close: first.close },
      ],
    });
  }

  function removeSlot(day: Weekday, index: number) {
    const current = formData.businessHours[day];
    if (current.slots.length <= 1) return;
    updateDayHours(day, {
      ...current,
      slots: current.slots.filter((_, slotIndex) => slotIndex !== index),
    });
  }

  function updateSlot(day: Weekday, index: number, field: "open" | "close", value: string) {
    const current = formData.businessHours[day];
    updateDayHours(day, {
      ...current,
      slots: current.slots.map((slot, slotIndex) =>
        slotIndex === index ? { ...slot, [field]: value } : slot,
      ),
    });
  }

  function handleCredentialUpload(kind: "license" | "insurance", file: File) {
    const message = validateCredentialFile(file);
    setDocErrors((prev) => ({ ...prev, [kind]: message ?? undefined }));
    if (message) return;

    const next = fileFromUpload(file);
    setFormData((prev) => {
      const key = kind === "license" ? "licenseDoc" : "insuranceDoc";
      const current = prev[key];
      if (current?.previewUrl) URL.revokeObjectURL(current.previewUrl);
      return { ...prev, [key]: next };
    });
    showToast(kind === "license" ? "License file sent for review" : "Insurance file sent for review");
  }


  // Payment methods toggle
  function togglePayment(payment: (typeof PAYMENT_METHODS)[number]) {
    setFormData((prev) => {
      const exists = prev.acceptedPayments.includes(payment);
      const next = exists
        ? prev.acceptedPayments.filter((item) => item !== payment)
        : [...prev.acceptedPayments, payment];
      return { ...prev, acceptedPayments: next };
    });
  }

  // Photo helpers
  function handleAddPhoto() {
    if (!newPhoto.title.trim()) return;
    setFormData((prev) => ({
      ...prev,
      portfolio: [
        ...prev.portfolio,
        {
          title: newPhoto.title.trim(),
          image: newPhoto.image.trim(),
        },
      ],
    }));
    setNewPhoto({
      title: "",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    });
    setShowAddPhoto(false);
    showToast("Photo added to portfolio");
  }

  function handleRemovePhoto(index: number) {
    setFormData((prev) => ({
      ...prev,
      portfolio: prev.portfolio.filter((_, i) => i !== index),
    }));
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-title px-5 py-3 text-white shadow-xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Banner & Live Profile Shortcut */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line/70 pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold text-title tracking-tight leading-tight">
            Business Profile
          </h1>
          <p className="mt-1 text-sm text-muted">What homeowners see on your listing.</p>
        </div>

        <Button
          type="button"
          onClick={handleSaveAll}
          className="shadow-xs text-sm font-semibold px-5 shrink-0"
        >
          Save Changes
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onChange={setActiveTab}
        items={[
          { key: "services", label: "Services & Rates", icon: Wrench, count: formData.services.length },
          { key: "overview", label: "Business Info", icon: Building2 },
          { key: "hours", label: "Hours & Payments", icon: Clock },
          { key: "credentials", label: "Licenses & Verification", icon: ShieldCheck },
          { key: "portfolio", label: "Project Photos", icon: ImageIcon, count: formData.portfolio.length },
        ]}
      />

      {/* ============================================================ */}
      {/* TAB 1: SERVICES & RATES                                      */}
      {/* ============================================================ */}
      {activeTab === "services" && (
        <div className="space-y-6">
          <Card className="rounded-2xl border border-line/80 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-bold text-title">
                  Services ({formData.services.length})
                </h3>
                <p className="text-xs text-muted">Lowest price is shown as your starting rate.</p>
              </div>

              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setShowAddService(!showAddService)}
                className="border border-line text-xs font-semibold"
              >
                <Plus className="h-3.5 w-3.5 mr-1 text-primary" />
                Add Service
              </Button>
            </div>

            {/* Inline Add Service Form */}
            {showAddService && (
              <div className="rounded-xl border border-primary/25 bg-smoke/60 p-4 space-y-3 animate-in fade-in">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                  New Service Item
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field label="Service Name" className="sm:col-span-2">
                    <TextField
                      value={newService.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewService({ ...newService, name: e.target.value })
                      }
                      placeholder="e.g. Tankless Water Heater Flush"
                    />
                  </Field>
                  <Field label="Price ($)">
                    <TextField
                      type="number"
                      value={newService.price}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewService({ ...newService, price: Number(e.target.value) || 0 })
                      }
                      placeholder="120"
                    />
                  </Field>
                  <Field label="Rate Type">
                    <TextField
                      value={newService.unit}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewService({ ...newService, unit: e.target.value })
                      }
                      placeholder="e.g. starting rate, per fixture"
                    />
                  </Field>
                  <Field label="Scope Description" className="sm:col-span-2">
                    <TextField
                      value={newService.description}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewService({ ...newService, description: e.target.value })
                      }
                      placeholder="e.g. Includes full system flush, diagnostic inspection, and seal verification."
                    />
                  </Field>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowAddService(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddService}
                    className="text-xs font-semibold"
                  >
                    Add Service
                  </Button>
                </div>
              </div>
            )}

            {/* Services List */}
            <div className="divide-y divide-line/50">
              {formData.services.map((srv) => (
                <div key={srv.id} className="py-3.5 flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className="font-display text-[15px] font-bold text-title">{srv.name}</p>
                      <span className="font-semibold text-primary text-xs bg-smoke px-2 py-0.5 rounded-md border border-primary/20">
                        ${srv.price}
                      </span>
                      <span className="text-xs text-muted">/ {srv.unit}</span>
                    </div>
                    {srv.description && (
                      <p className="text-xs text-copy">{srv.description}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveService(srv.id)}
                    className="text-muted hover:text-rose-600 transition p-1"
                    title="Remove Service"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: BUSINESS INFO                                         */}
      {/* ============================================================ */}
      {activeTab === "overview" && (
        <Card className="rounded-2xl border border-line/80 bg-white p-6 shadow-2xs space-y-5">
          <div>
            <h3 className="font-display text-base sm:text-[17px] font-bold text-title">Business Information</h3>
            <p className="text-xs text-muted">Name, contact, and where you work.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Business Name">
              <TextField
                value={formData.businessName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, businessName: e.target.value })
                }
                placeholder="Ortega Plumbing & Gas"
                required
              />
            </Field>

            <Field label="Contact Person Name">
              <TextField
                value={formData.contactName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, contactName: e.target.value })
                }
                placeholder="Luis Ortega"
                required
              />
            </Field>

            <Field label="Trade">
              <p className="flex min-h-[50px] items-center rounded-[10px] border border-line bg-smoke px-4 text-[16px] text-title">
                {formData.trade}
              </p>
            </Field>

            <Field label="Business Phone">
              <TextField
                value={formData.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="(512) 555-0198"
              />
            </Field>

            <Field label="Street Address">
              <TextField
                value={formData.street}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, street: e.target.value })
                }
                placeholder="2201 South Lamar Blvd"
              />
            </Field>

            <div className="grid grid-cols-3 gap-2">
              <Field label="City">
                <TextField
                  value={formData.city}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  placeholder="Austin"
                />
              </Field>
              <Field label="State">
                <TextField
                  value={formData.state}
                  maxLength={2}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  placeholder="TX"
                />
              </Field>
              <Field label="ZIP">
                <TextField
                  value={formData.zip}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, zip: e.target.value })
                  }
                  placeholder="78704"
                />
              </Field>
            </div>

            <Field label="Service Radius (Miles)">
              <TextField
                type="number"
                value={formData.radiusMiles}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, radiusMiles: Number(e.target.value) || 25 })
                }
                placeholder="25"
              />
            </Field>

            <Field label="Years in Business">
              <TextField
                value={formData.yearsInBusiness}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, yearsInBusiness: e.target.value })
                }
                placeholder="10+ years"
              />
            </Field>

            <Field label="About" className="sm:col-span-2">
              <TextArea
                value={formData.bio}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="min-h-[85px]"
                rows={3}
                placeholder="What you do and the area you cover."
              />
            </Field>
          </div>
        </Card>
      )}

      {/* ============================================================ */}
      {/* TAB 3: OPERATING HOURS & DIRECT PAYMENTS                     */}
      {/* ============================================================ */}
      {activeTab === "hours" && (
        <div className="space-y-6">
          <Card className="rounded-2xl border border-line/80 bg-white p-6 shadow-2xs space-y-4">
            <div>
              <h3 className="font-display text-base font-bold text-title">Business hours</h3>
              <p className="text-xs text-muted">
                Same hours every day, or customize each day. Closed days stay available to reopen.
              </p>
            </div>

            <Tabs
              value={hoursMode}
              onChange={changeHoursMode}
              items={[
                { key: "all", label: "All days" },
                { key: "custom", label: "Customize" },
              ]}
            />

            <div className="rounded-xl border border-line divide-y divide-line/70">
              {(hoursMode === "all" ? WEEK_DAYS.slice(0, 1) : WEEK_DAYS).map((day) => {
                const hours = formData.businessHours[day.key];
                const isOpen = hours.status === "open";
                return (
                  <div key={day.key} className="px-3 py-3 space-y-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-title">
                        {hoursMode === "all" ? "Every day" : day.label}
                      </p>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isOpen}
                        onClick={() =>
                          updateDayHours(day.key, {
                            ...hours,
                            status: isOpen ? "closed" : "open",
                          })
                        }
                        className="inline-flex items-center gap-2"
                      >
                        <span
                          className={cn(
                            "relative h-6 w-10 rounded-full transition-colors",
                            isOpen ? "bg-emerald-600" : "bg-slate-300",
                          )}
                        >
                          <span
                            className={cn(
                              "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                              isOpen && "translate-x-4",
                            )}
                          />
                        </span>
                        <span className={cn("text-xs font-semibold", isOpen ? "text-title" : "text-muted")}>
                          {isOpen ? "Open" : "Closed"}
                        </span>
                      </button>
                    </div>

                    {isOpen ? (
                      <div className="space-y-2">
                        {hours.slots.map((slot, index) => (
                          <div key={`${day.key}-${index}`} className="flex flex-wrap items-center gap-2">
                            <select
                              value={TIME_OPTIONS.includes(slot.open) ? slot.open : TIME_OPTIONS[0]}
                              onChange={(event) => updateSlot(day.key, index, "open", event.target.value)}
                              className="min-h-10 rounded-[10px] border border-line bg-white px-3 text-sm text-title outline-none focus:border-primary"
                            >
                              {TIME_OPTIONS.map((time) => (
                                <option key={`${day.key}-${index}-open-${time}`} value={time}>
                                  {time}
                                </option>
                              ))}
                            </select>
                            <span className="text-sm text-muted">to</span>
                            <select
                              value={
                                TIME_OPTIONS.includes(slot.close)
                                  ? slot.close
                                  : TIME_OPTIONS[TIME_OPTIONS.length - 1]
                              }
                              onChange={(event) => updateSlot(day.key, index, "close", event.target.value)}
                              className="min-h-10 rounded-[10px] border border-line bg-white px-3 text-sm text-title outline-none focus:border-primary"
                            >
                              {TIME_OPTIONS.map((time) => (
                                <option key={`${day.key}-${index}-close-${time}`} value={time}>
                                  {time}
                                </option>
                              ))}
                            </select>
                            {index > 0 ? (
                              <button
                                type="button"
                                onClick={() => removeSlot(day.key, index)}
                                className="text-xs font-semibold text-muted hover:text-title"
                              >
                                Remove
                              </button>
                            ) : null}
                          </div>
                        ))}
                        {hours.slots.length < 2 ? (
                          <button
                            type="button"
                            onClick={() => addBreak(day.key)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add break
                          </button>
                        ) : (
                          <p className="text-[11px] text-muted">Closed between these hours.</p>
                        )}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            {/* Emergency Toggle */}
            <div className="pt-3 border-t border-line/50">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.emergency}
                  onChange={(e) =>
                    setFormData({ ...formData, emergency: e.target.checked })
                  }
                  className="h-4 w-4 rounded accent-primary cursor-pointer"
                />
                <div>
                  <p className="text-sm font-semibold text-title">
                    24/7 Emergency Dispatch Available
                  </p>
                  <p className="text-xs text-muted">
                    Show an emergency badge to receive high-urgency water leak or electrical requests.
                  </p>
                </div>
              </label>
            </div>
          </Card>

          <Card className="rounded-2xl border border-line/80 bg-white p-6 shadow-2xs space-y-4">
            <div>
              <h3 className="font-display text-base font-bold text-title">Accepted payments</h3>
              <p className="text-xs text-muted">What homeowners can pay you with.</p>
            </div>

            <div className="grid gap-1 sm:grid-cols-2">
              {PAYMENT_METHODS.map((method) => {
                const selected = formData.acceptedPayments.includes(method);
                return (
                  <label
                    key={method}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => togglePayment(method)}
                      className="h-4 w-4 rounded accent-primary"
                    />
                    <span className="text-sm text-title">{method}</span>
                  </label>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: LICENSES & VERIFICATION                               */}
      {/* ============================================================ */}
      {activeTab === "credentials" && (
        <div className="space-y-4">
          <Card className="space-y-4 rounded-2xl border border-line/80 bg-white p-6 shadow-2xs">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-base font-bold text-title">Trade license</h3>
                <p className="text-xs text-muted">Number on the certificate. Attach the same file.</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="License number">
                <TextField
                  value={formData.licenseNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, licenseNumber: e.target.value })
                  }
                  placeholder="TX-M-42981"
                />
              </Field>
              <Field label="State">
                <TextField
                  value={formData.licenseState}
                  maxLength={2}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, licenseState: e.target.value.toUpperCase() })
                  }
                  placeholder="TX"
                />
              </Field>
            </div>
            <CredentialAttachment
              label="Certificate"
              file={formData.licenseDoc}
              error={docErrors.license}
              onUpload={(file) => handleCredentialUpload("license", file)}
            />
          </Card>

          <Card className="space-y-4 rounded-2xl border border-line/80 bg-white p-6 shadow-2xs">
            <div>
              <h3 className="font-display text-base font-bold text-title">Liability insurance</h3>
              <p className="text-xs text-muted">Current COI. Replace before it expires.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Carrier">
                <TextField
                  value={formData.insuranceCarrier}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, insuranceCarrier: e.target.value })
                  }
                  placeholder="Next Insurance"
                />
              </Field>
              <Field label="Coverage">
                <NativeSelect
                  value={formData.insuranceCoverage}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setFormData({ ...formData, insuranceCoverage: e.target.value })
                  }
                >
                  <option value="$500,000">$500,000</option>
                  <option value="$1,000,000">$1,000,000</option>
                  <option value="$2,000,000">$2,000,000</option>
                </NativeSelect>
              </Field>
              <Field label="Expires">
                <TextField
                  type="month"
                  value={formData.insuranceExpires}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, insuranceExpires: e.target.value })
                  }
                />
              </Field>
            </div>
            <CredentialAttachment
              label="Certificate of insurance"
              file={formData.insuranceDoc}
              error={docErrors.insurance}
              onUpload={(file) => handleCredentialUpload("insurance", file)}
            />
          </Card>

          <Card className="flex items-center justify-between gap-3 rounded-2xl border border-line/80 bg-white p-5 shadow-2xs">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />
              <div>
                <p className="text-sm font-semibold text-title">Background check</p>
                <p className="text-xs text-muted">Done at signup. No file to attach.</p>
              </div>
            </div>
            <Link href="/pro/application" className="text-xs font-semibold text-primary hover:underline">
              Verified
            </Link>
          </Card>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 5: PORTFOLIO PHOTOS                                      */}
      {/* ============================================================ */}
      {activeTab === "portfolio" && (
        <Card className="rounded-2xl border border-line/80 bg-white p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-base sm:text-[17px] font-bold text-title">
                Project Photos ({formData.portfolio.length})
              </h3>
              <p className="text-xs text-muted">
                Completed project photos displayed on your public storefront portfolio.
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setShowAddPhoto(!showAddPhoto)}
              className="border border-line text-xs font-semibold"
            >
              <Plus className="h-3.5 w-3.5 mr-1 text-primary" />
              Add Photo
            </Button>
          </div>

          {/* Add Photo Form */}
          {showAddPhoto && (
            <div className="rounded-xl border border-primary/25 bg-smoke/60 p-4 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                Add Project Photo
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Project Caption">
                  <TextField
                    value={newPhoto.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewPhoto({ ...newPhoto, title: e.target.value })
                    }
                    placeholder="e.g. Tankless water heater installation"
                  />
                </Field>
                <Field label="Image URL">
                  <TextField
                    value={newPhoto.image}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewPhoto({ ...newPhoto, image: e.target.value })
                    }
                    placeholder="https://images.unsplash.com/..."
                  />
                </Field>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowAddPhoto(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddPhoto}
                  className="text-xs font-semibold"
                >
                  Add Photo
                </Button>
              </div>
            </div>
          )}

          {/* Photos Grid */}
          <div className="grid gap-4 sm:grid-cols-3">
            {formData.portfolio.map((item, idx) => (
              <div
                key={idx}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-smoke border border-line shadow-2xs"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-between p-3 text-white">
                  <span className="text-xs font-medium truncate pr-2">{item.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="p-1 rounded-full bg-red-600/80 hover:bg-red-600 text-white shrink-0 transition"
                    title="Remove Photo"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

    </div>
  );
}
