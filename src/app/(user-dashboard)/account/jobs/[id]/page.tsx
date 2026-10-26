import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PostedBanner } from "@/components/web-pages/posted-banner";
import { RequestDetail } from "@/components/web-pages/request-detail";
import { getJob } from "@/Mockdata";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id.startsWith("job-local-") && !getJob(id)) notFound();

  return (
    <div className="space-y-4">
      <Suspense fallback={null}>
        <PostedBanner />
      </Suspense>
      <RequestDetail
        id={id}
        backHref="/account"
        backLabel="Your requests"
        inboxHref="/account/messages"
        canHire
        viewer="homeowner"
      />
    </div>
  );
}
