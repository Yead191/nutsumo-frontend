import { Suspense } from "react";
import { PageBanner } from "@/components/layout/page-banner";
import { photos } from "@/lib/media";
import { BrowseProsClient } from "./browse-pros-client";

export default function BrowseProsPage() {
  return (
    <>
      <PageBanner
        eyebrow="Find a Pro"
        title="Browse professionals"
        description="Browse professionals or post a job. You hire only after you accept a quotation. Pay the professional directly — HomeFix charges homeowners nothing."
        image={photos.banners.pros}
      />
      <Suspense fallback={<div className="container-site py-16 text-sm text-muted">Loading pros…</div>}>
        <BrowseProsClient />
      </Suspense>
    </>
  );
}
