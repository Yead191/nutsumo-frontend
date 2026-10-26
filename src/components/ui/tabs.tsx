"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export interface TabItem<T extends string = string> {
  key: T;
  label: string;
  count?: number;
  icon?: LucideIcon;
}

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  className,
}: {
  items: TabItem<T>[];
  value: T;
  onChange: (key: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {items.map((item) => {
        const active = value === item.key;
        const Icon = item.icon;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={cn(
              "inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-all",
              active
                ? "bg-title font-medium text-white"
                : "border border-line/80 bg-white text-muted hover:bg-slate-50 hover:text-title",
            )}
          >
            {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
            {item.label}
            {item.count != null ? (
              <span
                className={cn(
                  "rounded-md px-1.5 py-0.5 text-[10px]",
                  active ? "bg-white/15 text-white" : "bg-slate-100 text-muted",
                )}
              >
                {item.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
