import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfessionalProfileManager } from "@/components/web-pages/artisan-dashboard/artisan-profile";
import { getArtisanProfile } from "@/helpers/next-fetch/apiActions/artisanActions";
import {
  connectStripeAccountAction,
  syncStripeAccountAction,
} from "@/helpers/next-fetch/apiActions/walletActions";

export const metadata: Metadata = {
  title: "Professional Profile · Nutsumo",
  description:
    "Manage your professional artisan trade information, location, bio, and live availability.",
};

export default async function ProProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ stripe?: string }>;
}) {
  const { stripe } = await searchParams;

  if (stripe === "refresh") {
    const link = await connectStripeAccountAction();
    if (link.success && link.data?.url) redirect(link.data.url);
  }

  if (stripe === "return") {
    await syncStripeAccountAction();
  }

  const res = await getArtisanProfile();

  return <ProfessionalProfileManager user={res?.data} />;
}
