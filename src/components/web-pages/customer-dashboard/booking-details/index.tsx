"use client";

import { BookingHeader } from "./components/BookingHeader";
import { BookingEscrowTracker } from "./components/BookingEscrowTracker";
import { CustomerEscrowActionCard } from "./components/CustomerEscrowActionCard";
import { HiredArtisanCard } from "./components/HiredArtisanCard";
import { BookingContractCard } from "./components/BookingContractCard";
import type { BookingDetailsViewProps } from "./types";

export function BookingDetailsView({ booking }: BookingDetailsViewProps) {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* 1. HEADER */}
      <BookingHeader booking={booking} />

      {/* 2. ESCROW LIFECYCLE TRACKER */}
      <BookingEscrowTracker booking={booking} />

      {/* 3. ESCROW ACTION CARD (PAYMENT / DELIVERY INSPECTION / COMPLETED) */}
      <CustomerEscrowActionCard booking={booking} />

      {/* 4. HIRED ARTISAN CONTACT */}
      <HiredArtisanCard artisan={booking.artisan} />

      {/* 5. CONTRACT & TERMS */}
      <BookingContractCard booking={booking} />
    </div>
  );
}
