import { Suspense } from "react";
import { ArtisanIdentityFlow } from "@/components/web-pages/artisan-identity-flow";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Verify Identity - Nutsumo Artisan",
  description: "Verify your National ID Card and Live Selfie to start offering services as a verified Nutsumo artisan.",
};

export default function VerifyIdentityPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#FE375D]" />
        </div>
      }
    >
      <ArtisanIdentityFlow />
    </Suspense>
  );
}
