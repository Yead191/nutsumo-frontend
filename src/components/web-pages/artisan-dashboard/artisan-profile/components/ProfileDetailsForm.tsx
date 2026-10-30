"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Field, TextField, TextArea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import type { ProfileFormState } from "../types";

interface ProfileDetailsFormProps {
  form: ProfileFormState;
  isSaving: boolean;
  onChange: <K extends keyof ProfileFormState>(
    key: K,
    value: ProfileFormState[K],
  ) => void;
  onSave: () => void;
}

export function ProfileDetailsForm({
  form,
  isSaving,
  onChange,
  onSave,
}: ProfileDetailsFormProps) {
  return (
    <Card className="rounded-3xl border border-line/80 bg-white p-6 sm:p-8 shadow-2xs space-y-6">
      <div className="border-b border-line pb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-title">
            Professional & Business Information
          </h2>
          <p className="text-xs text-muted">
            Configure your artisan identity, business contact details, and customer bio.
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
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="e.g. John Doe"
          />
        </Field>

        <Field label="Business / Trading Name">
          <TextField
            value={form.businessName}
            onChange={(e) => onChange("businessName", e.target.value)}
            placeholder="e.g. Acme Premier Crafts"
          />
        </Field>

        <Field label="Primary Trade / Specialty">
          <TextField
            value={form.trade}
            onChange={(e) => onChange("trade", e.target.value)}
            placeholder="e.g. Master Plumber, Finish Carpenter"
          />
        </Field>

        <Field label="Years of Experience">
          <TextField
            type="number"
            min={0}
            value={form.experienceYears}
            onChange={(e) =>
              onChange("experienceYears", Number(e.target.value) || 0)
            }
            placeholder="5"
          />
        </Field>

        <Field label="Service Location / Coverage Area">
          <TextField
            value={form.location}
            onChange={(e) => onChange("location", e.target.value)}
            placeholder="e.g. Austin, TX Metro"
          />
        </Field>

        <Field label="Post Code">
          <TextField
            value={form.postCode}
            onChange={(e) => onChange("postCode", e.target.value)}
            placeholder="e.g. 78701 or SW1A 1AA"
          />
        </Field>

        <Field label="Direct Phone Number">
          <TextField
            value={form.phone}
            onChange={(e) => onChange("phone", e.target.value)}
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

        <div className="sm:col-span-2">
          <Field label="Professional Bio & Craftsmanship Statement">
            <TextArea
              rows={4}
              value={form.bio}
              onChange={(e) => onChange("bio", e.target.value)}
              placeholder="Describe your background, specialty skills, and client standards..."
            />
          </Field>
        </div>
      </div>

      <div className="pt-4 border-t border-line flex items-center justify-between">
        <p className="text-xs text-muted">
          Profile details update live across your artisan storefront and client quotes.
        </p>
        <Button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="px-6 font-bold text-xs flex items-center gap-2"
        >
          {isSaving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </Card>
  );
}
