"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";

function labelFor(description?: string) {
  const text = (description ?? "").toLowerCase();
  if (text.includes("trial")) return "Trial";
  if (text.includes("annual")) return "Annual";
  return "Monthly";
}

export default function TransactionsPage() {
  const items = useAppSelector((state) => state.features.invoices);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="border-b border-line/70 pb-4">
        <Link href="/pro/pricing" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
          <ChevronLeft className="h-4 w-4" />
          Billing
        </Link>
        <h1 className="mt-2 font-display text-[24px] font-semibold tracking-tight text-title">
          Transaction history
        </h1>
      </div>

      <ul className="divide-y divide-line rounded-xl border border-line bg-white">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-3 px-4 py-3.5">
            <div>
              <p className="text-sm font-semibold text-title">{labelFor(item.description)}</p>
              <p className="text-xs text-muted">{item.date}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-title">{item.amount}</p>
              <p className="text-xs text-muted">{item.status === "paid" ? "Paid" : "Upcoming"}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
