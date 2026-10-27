import { Suspense } from "react";
import { ProfessionalProfileManager } from "@/components/web-pages/professional-profile-manager";
import { ProfessionalProfileSkeleton } from "@/components/web-pages/professional-profile-skeleton";
import { getArtisanProfile } from "@/helpers/next-fetch/apiActions/artisanActions";

export const metadata = {
  title: "Professional Profile | Nutsumo",
  description:
    "Manage your professional artisan trade information, location, bio, and live availability.",
};

async function ProfileDataFetcher() {
  const res = await getArtisanProfile();
  return <ProfessionalProfileManager user={res?.data} />;
}

export default function ProProfilePage() {
  return (
    <Suspense fallback={<ProfessionalProfileSkeleton />}>
      <ProfileDataFetcher />
    </Suspense>
  );
}
