"use client";

import { Phone, TriangleAlert } from "lucide-react";

const HOTLINES = [
  { label: "Emergency", number: "911" },
  { label: "Gas leak (National Grid)", number: "1-800-233-5325" },
  { label: "Red Cross", number: "1-800-733-2767" },
] as const;

export function EmergencyBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="emergency-title"
      aria-describedby="emergency-desc"
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg rounded-2xl bg-[#dc2626] p-6 text-white shadow-2xl">
        <div className="flex items-start gap-3">
          <TriangleAlert className="mt-0.5 h-6 w-6 shrink-0 text-white" aria-hidden="true" />
          <div>
            <h2 id="emergency-title" className="text-xl font-bold">
              This sounds like an emergency
            </h2>
            <p id="emergency-desc" className="mt-1 text-sm leading-6 text-white/90">
              Do not use the website to get help right now. Call emergency services immediately if you suspect an active gas leak, fire, or immediate structural danger.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          {HOTLINES.map((h) => (
            <a
              key={h.number}
              href={`tel:${h.number}`}
              className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3 font-semibold transition hover:bg-white/20"
            >
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4" aria-hidden="true" />
                {h.label}
              </span>
              <span className="font-mono text-sm underline">{h.number}</span>
            </a>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-lg border border-white/40 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-white hover:text-[#dc2626]"
          >
            I am safe, continue
          </button>
        </div>
      </div>
    </div>
  );
}