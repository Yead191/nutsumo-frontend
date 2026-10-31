"use client";

import { BookingHeader } from "./components/BookingHeader";
import { HiredArtisanCard } from "./components/HiredArtisanCard";
import { BookingContractCard } from "./components/BookingContractCard";
import type { BookingDetailsViewProps } from "./types";

export function BookingDetailsView({ booking }: BookingDetailsViewProps) {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* 1. HEADER */}
      <BookingHeader booking={booking} />

      {/* 2. HIRED ARTISAN CONTACT */}
      <HiredArtisanCard artisan={booking.artisan} />

      {/* 3. CONTRACT & TERMS */}
      <BookingContractCard booking={booking} />
    </div>
  );
}
