import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getJobDetailsAction } from "@/helpers/next-fetch/apiActions/jobActions";
import getProfile from "@/helpers/next-fetch/core/getProfile";
import { JobDetailsView } from "@/components/web-pages/jobs-marketplace/components/JobDetailsView";

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: JobDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const res = await getJobDetailsAction(id);
  const job = res.success ? res.data : null;

  if (!job) {
    return {
      title: "Job Details · Nutsumo",
    };
  }

  return {
    title: `${job.title} · Nutsumo Job Board`,
    description: job.description.slice(0, 160),
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;

  const [jobRes, profileRes] = await Promise.all([
    getJobDetailsAction(id),
    getProfile(),
  ]);

  if (!jobRes.success || !jobRes.data) {
    notFound();
  }

  const job = jobRes.data;
  const currentUserRole = profileRes?.data?.role || profileRes?.role || null;
  const currentUserId = profileRes?.data?._id || profileRes?._id || null;

  return (
    <div className="container-site py-8 sm:py-12">
      <JobDetailsView
        job={job}
        currentUserRole={currentUserRole}
        currentUserId={currentUserId}
      />
    </div>
  );
}
