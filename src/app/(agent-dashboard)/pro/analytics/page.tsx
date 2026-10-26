"use client";

import { Card } from "@/components/ui/card";
import { selectAllQuotes } from "@/lib/marketplace";
import { useAppSelector } from "@/redux/hooks";

export default function AnalyticsPage() {
  const quotes = useAppSelector(selectAllQuotes);
  const hired = Object.keys(useAppSelector((state) => state.marketplace.hiredByJob)).length;
  const mine = quotes.filter((quote) => quote.proId === "pro-1" || quote.id.startsWith("quote-local"));

  const rows = [
    { label: "Quotes sent", value: String(mine.length) },
    { label: "Hires recorded", value: String(hired) },
    { label: "Open quotes", value: String(Math.max(mine.length - hired, 0)) },
  ];

  return (
    <div>
      <h1 className="text-[28px]">Activity</h1>
      <p className="mt-1 text-sm text-copy">Counts from this demo session only. No invented conversion rates.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {rows.map((row) => (
          <Card key={row.label}>
            <p className="text-sm text-muted">{row.label}</p>
            <p className="mt-2 font-display text-3xl font-bold text-title">{row.value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
