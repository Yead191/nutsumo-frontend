"use client";

import React from "react";
import { Briefcase, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface EmptyServicesStateProps {
  onAddClick: () => void;
}

export function EmptyServicesState({ onAddClick }: EmptyServicesStateProps) {
  return (
    <Card className="rounded-3xl border border-dashed border-line bg-gradient-to-br from-slate-50/70 to-white p-12 text-center shadow-2xs space-y-4">
      <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-xs">
        <Briefcase className="h-8 w-8" />
      </div>
      <div className="space-y-1.5">
        <h3 className="font-display text-lg font-bold text-title">
          No Services Configured Yet
        </h3>
        <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
          You haven&apos;t added any services to your profile. Select catalog
          services from suggestions, configure your rates, and start receiving job
          requests.
        </p>
      </div>
      <div className="pt-2">
        <Button
          type="button"
          onClick={onAddClick}
          className="font-bold text-xs px-6 shadow-xs inline-flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Your First Service
        </Button>
      </div>
    </Card>
  );
}
