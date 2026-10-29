import type { Metadata } from "next";
import { ProfessionalProfileManager } from "@/components/web-pages/artisan-dashboard/artisan-profile";
import { getArtisanProfile } from "@/helpers/next-fetch/apiActions/artisanActions";

export const metadata: Metadata = {
  title: "Professional Profile · Nutsumo",
  description:
    "Manage your professional artisan trade information, location, bio, and live availability.",
};

export default async function ProProfilePage() {
  const res = await getArtisanProfile();

  return <ProfessionalProfileManager user={res?.data} />;
}
