import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getJobDetailsAction } from "@/helpers/next-fetch/apiActions/jobActions";
import { getJobQuotationsAction } from "@/helpers/next-fetch/apiActions/quotationActions";
import { JobDetailsManager } from "@/components/web-pages/customer-dashboard/job-details";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const res = await getJobDetailsAction(id);
  if (!res.success || !res.data) {
    return { title: "Job Details · Nutsumo" };
  }
  return {
    title: `${res.data.title} · Nutsumo`,
    description: res.data.description?.slice(0, 160),
  };
}

export default async function CustomerJobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Parallel fetch job details and proposals
  const [jobRes, quotesRes] = await Promise.allSettled([
    getJobDetailsAction(id),
    getJobQuotationsAction(id),
  ]);

  if (
    jobRes.status !== "fulfilled" ||
    !jobRes.value?.success ||
    !jobRes.value?.data
  ) {
    notFound();
  }

  const job = jobRes.value.data;
  const quotations =
    quotesRes.status === "fulfilled" &&
    quotesRes.value?.success &&
    Array.isArray(quotesRes.value.data)
      ? quotesRes.value.data
      : [];

  return <JobDetailsManager job={job} quotations={quotations} />;
}
