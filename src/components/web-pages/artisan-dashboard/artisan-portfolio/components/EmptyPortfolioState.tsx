"use client";

import React from "react";
import { Sparkles, Plus, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyPortfolioStateProps {
  onOpenAdd: () => void;
}

export function EmptyPortfolioState({ onOpenAdd }: EmptyPortfolioStateProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-dashed border-line bg-gradient-to-b from-white to-slate-50/60 p-10 sm:p-16 text-center">
      <div className="pointer-events-none absolute -left-12 -top-12 h-44 w-44 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 -bottom-12 h-44 w-44 rounded-full bg-secondary/5 blur-3xl" />

      <div className="relative max-w-md mx-auto space-y-4">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-8 ring-primary/5 shadow-2xs">
          <Layers className="h-8 w-8" />
        </div>

        <div className="space-y-1.5">
          <h3 className="font-display text-lg sm:text-xl font-bold text-title">
            No Portfolio Projects Yet
          </h3>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            Showcase your completed craftsmanship, before & after transformations, and high-quality job photos to attract prospective clients.
          </p>
        </div>

        <div className="pt-2">
          <Button
            type="button"
            onClick={onOpenAdd}
            className="h-10 px-5 text-xs sm:text-sm font-bold shadow-sm inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add First Project
          </Button>
        </div>
      </div>
    </div>
  );
}
