"use client";

import React from "react";
import { Library, PenLine, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyServicesStateProps {
  onAddClick: () => void;
}

const steps = [
  {
    icon: Library,
    title: "Pick or name it",
    copy: "Use an official service, or add a specialty the catalog does not list yet.",
  },
  {
    icon: PenLine,
    title: "Set your rate",
    copy: "Hourly or daily. Clients see the number before they request a quote.",
  },
  {
    icon: BellRing,
    title: "Get the matching jobs",
    copy: "A similar request notifies you, even when the admin has no category for it.",
  },
];

export function EmptyServicesState({ onAddClick }: EmptyServicesStateProps) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-line/80 bg-white shadow-xs">
      <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
            Nothing live yet
          </p>
          <h2 className="max-w-md font-display text-3xl font-semibold tracking-tight text-title">
            Put the work you actually do on your profile.
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-muted">
            Clients hire from this list. Add at least one service so quotes, search, and job alerts have something to match.
          </p>
          <Button
            type="button"
            onClick={onAddClick}
            className="h-11 rounded-2xl px-5 text-sm font-semibold"
          >
            Add your first service
          </Button>
        </div>

        <ol className="space-y-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                className="flex gap-3 rounded-2xl border border-line/80 bg-slate-50/80 p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-2xs">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                    0{index + 1}
                  </p>
                  <p className="font-display text-base font-semibold text-title">
                    {step.title}
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted">{step.copy}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
