"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setBudget } from "@/redux/slices/filterSlice";
import { cn } from "@/lib/cn";

export function BudgetDropdownFilter({ className }: { className?: string }) {
  const dispatch = useAppDispatch();
  const { minPrice, maxPrice, budgetTier } = useAppSelector((state) => state.filters);

  const [open, setOpen] = useState(false);
  const [tempTier, setTempTier] = useState(budgetTier || "");
  const [tempCustom, setTempCustom] = useState(budgetTier === "custom" ? maxPrice : "");
  const rootRef = useRef<HTMLDivElement>(null);

  // Sync state when opening
  function handleToggle() {
    if (!open) {
      setTempTier(budgetTier || "");
      setTempCustom(budgetTier === "custom" ? maxPrice : "");
    }
    setOpen((prev) => !prev);
  }

  // Click outside to close
  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", onPointer);
      document.addEventListener("keydown", onKey);
    }
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function handleApply() {
    if (tempTier === "value") {
      dispatch(setBudget({ minPrice: "", maxPrice: "85", budgetTier: "value" }));
    } else if (tempTier === "mid_range") {
      dispatch(setBudget({ minPrice: "85", maxPrice: "130", budgetTier: "mid_range" }));
    } else if (tempTier === "high_end") {
      dispatch(setBudget({ minPrice: "130", maxPrice: "", budgetTier: "high_end" }));
    } else if (tempTier === "custom") {
      dispatch(
        setBudget({
          minPrice: "",
          maxPrice: tempCustom.trim(),
          budgetTier: tempCustom.trim() ? "custom" : "",
        }),
      );
    } else {
      dispatch(setBudget({ minPrice: "", maxPrice: "", budgetTier: "" }));
    }
    setOpen(false);
  }

  function handleClear() {
    setTempTier("");
    setTempCustom("");
    dispatch(setBudget({ minPrice: "", maxPrice: "", budgetTier: "" }));
    setOpen(false);
  }

  // Label text on the trigger button
  const triggerLabel = useMemoLabel(budgetTier, minPrice, maxPrice);
  const isActive = Boolean(budgetTier || minPrice || maxPrice);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={cn(
          "flex min-h-[50px] w-full items-center justify-between rounded-[10px] border px-4 font-sans text-[16px] transition-colors outline-none",
          isActive
            ? "border-primary bg-primary/[0.04] text-primary font-semibold shadow-xs ring-1 ring-primary/20"
            : "border-line bg-white text-title hover:border-primary/50",
          open && "border-primary ring-2 ring-primary/20",
        )}
      >
        <span className="truncate">{triggerLabel}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-200 ml-1.5",
            isActive ? "text-primary" : "text-muted",
            open && "rotate-180 text-primary",
          )}
        />
      </button>

      {/* Popover Dropdown */}
      {open && (
        <div
          role="dialog"
          aria-label="Filter by Budget"
          className="absolute left-0 top-[calc(100%+6px)] z-50 w-[290px] sm:w-[320px] rounded-[16px] border border-line bg-white p-4 shadow-xl animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <h4 className="font-display text-sm font-bold text-title tracking-tight">
              Budget Filter
            </h4>
            <span className="font-sans text-xs text-muted">Starting rate</span>
          </div>

          {/* Radio Options */}
          <div className="py-2.5 space-y-1">
            {/* Value */}
            <label
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-[12px] cursor-pointer transition-colors",
                tempTier === "value" ? "bg-smoke" : "hover:bg-smoke/60",
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "grid h-4 w-4 place-items-center rounded-full border transition-all shrink-0",
                    tempTier === "value"
                      ? "border-primary bg-primary"
                      : "border-line bg-white hover:border-primary/50",
                  )}
                >
                  {tempTier === "value" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </span>
                <span className="font-display text-sm font-semibold text-title">Value</span>
              </div>
              <span className="font-sans text-sm text-muted">Under $85</span>
              <input
                type="radio"
                name="budget_tier"
                value="value"
                checked={tempTier === "value"}
                onChange={() => setTempTier("value")}
                className="sr-only"
              />
            </label>

            {/* Mid-range */}
            <label
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-[12px] cursor-pointer transition-colors",
                tempTier === "mid_range" ? "bg-smoke" : "hover:bg-smoke/60",
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "grid h-4 w-4 place-items-center rounded-full border transition-all shrink-0",
                    tempTier === "mid_range"
                      ? "border-primary bg-primary"
                      : "border-line bg-white hover:border-primary/50",
                  )}
                >
                  {tempTier === "mid_range" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </span>
                <span className="font-display text-sm font-semibold text-title">Mid-range</span>
              </div>
              <span className="font-sans text-sm text-muted">$85 – $130</span>
              <input
                type="radio"
                name="budget_tier"
                value="mid_range"
                checked={tempTier === "mid_range"}
                onChange={() => setTempTier("mid_range")}
                className="sr-only"
              />
            </label>

            {/* High-end */}
            <label
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-[12px] cursor-pointer transition-colors",
                tempTier === "high_end" ? "bg-smoke" : "hover:bg-smoke/60",
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "grid h-4 w-4 place-items-center rounded-full border transition-all shrink-0",
                    tempTier === "high_end"
                      ? "border-primary bg-primary"
                      : "border-line bg-white hover:border-primary/50",
                  )}
                >
                  {tempTier === "high_end" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </span>
                <span className="font-display text-sm font-semibold text-title">High-end</span>
              </div>
              <span className="font-sans text-sm text-muted">$130 &amp; Above</span>
              <input
                type="radio"
                name="budget_tier"
                value="high_end"
                checked={tempTier === "high_end"}
                onChange={() => setTempTier("high_end")}
                className="sr-only"
              />
            </label>

            {/* Custom */}
            <div
              className={cn(
                "rounded-[12px] px-3 py-2.5 transition-colors",
                tempTier === "custom" ? "bg-smoke" : "hover:bg-smoke/60",
              )}
            >
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "grid h-4 w-4 place-items-center rounded-full border transition-all shrink-0",
                      tempTier === "custom"
                        ? "border-primary bg-primary"
                        : "border-line bg-white hover:border-primary/50",
                    )}
                  >
                    {tempTier === "custom" && (
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </span>
                  <span className="font-display text-sm font-semibold text-title">Custom</span>
                </div>
                <span className="font-sans text-xs text-muted">Set max</span>
                <input
                  type="radio"
                  name="budget_tier"
                  value="custom"
                  checked={tempTier === "custom"}
                  onChange={() => setTempTier("custom")}
                  className="sr-only"
                />
              </label>

              {/* Custom input box */}
              {tempTier === "custom" && (
                <div className="mt-2.5 pt-2 border-t border-line/60">
                  <label className="block mb-1.5 font-sans text-xs font-medium text-muted">
                    Max starting rate ($/hr)
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 font-sans text-sm font-semibold text-muted select-none">
                      $
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={tempCustom}
                      onChange={(e) => setTempCustom(e.target.value)}
                      placeholder="e.g. 150"
                      className="w-full rounded-[10px] border border-line bg-white pl-7 pr-3 py-2 font-sans text-sm font-medium text-title outline-none transition-colors placeholder:text-muted/60 focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs"
                      autoFocus
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-line">
            <button
              type="button"
              onClick={handleClear}
              className="font-sans text-xs font-semibold text-muted hover:text-title hover:underline transition-colors cursor-pointer"
            >
              Clear all
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="inline-flex items-center justify-center rounded-[10px] bg-primary hover:bg-primary-hover text-white px-5 py-2 font-display text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function useMemoLabel(budgetTier: string, minPrice: string, maxPrice: string) {
  if (budgetTier === "value") return "Value (<$85)";
  if (budgetTier === "mid_range") return "$85 – $130";
  if (budgetTier === "high_end") return "$130 & Above";
  if (budgetTier === "custom" && maxPrice) return `Up to $${maxPrice}`;
  if (maxPrice && !minPrice) return `Up to $${maxPrice}`;
  if (minPrice && !maxPrice) return `From $${minPrice}`;
  if (minPrice && maxPrice) return `$${minPrice} – $${maxPrice}`;
  return "Budget";
}
