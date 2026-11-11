"use client";

import { Star } from "lucide-react";
import { Tabs } from "@/components/ui/tabs";
import type { FilterType, ReviewStats } from "../types";

interface ReviewFilterTabsProps {
  stats: ReviewStats;
  selectedFilter: FilterType;
  onSelectFilter: (filter: FilterType) => void;
}

export function ReviewFilterTabs({
  stats,
  selectedFilter,
  onSelectFilter,
}: ReviewFilterTabsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
      <Tabs<FilterType>
        value={selectedFilter}
        onChange={onSelectFilter}
        items={[
          { key: "all", label: "All Reviews", count: stats.total },
          {
            key: "needs-reply",
            label: "Needs Reply",
            count: stats.needsReplyCount,
          },
          { key: "replied", label: "Replied", count: stats.repliedCount },
        ]}
      />

      <Tabs<FilterType>
        value={selectedFilter}
        onChange={(key) => onSelectFilter(key === selectedFilter ? "all" : key)}
        items={([5, 4, 3, 2, 1] as const).map((star) => ({
          key: `${star}-star` as FilterType,
          label: `${star}`,
          icon: Star,
        }))}
      />
    </div>
  );
}
