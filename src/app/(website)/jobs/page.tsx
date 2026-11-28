import type { Metadata } from "next";
import { getActiveJobsMarketplaceAction } from "@/helpers/next-fetch/apiActions/jobActions";
import { getServiceCategories } from "@/helpers/next-fetch/apiActions/artisanActions";
import getProfile from "@/helpers/next-fetch/core/getProfile";
import { JobsMarketplaceContainer } from "@/components/web-pages/jobs-marketplace";

export const metadata: Metadata = {
  title: "Find Jobs & Opportunities in Ghana · Nutsumo",
  description:
    "Browse real-time jobs posted by verified clients in Ghana  domestic work, driving, catering, childcare, security, trades, office and creative roles. Submit quotes directly with zero commission.",
};

interface JobsPageProps {
  searchParams: Promise<{
    searchTerm?: string;
    category?: string;
    service?: string;
    page?: string;
  }>;
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const resolvedParams = await searchParams;
  const page = resolvedParams.page ? Number(resolvedParams.page) : 1;

  const [jobsRes, categoriesRes, profileRes] = await Promise.all([
    getActiveJobsMarketplaceAction({
      searchTerm: resolvedParams.searchTerm,
      category: resolvedParams.category,
      service: resolvedParams.service,
      page,
      limit: 10,
    }),
    getServiceCategories(),
    getProfile(),
  ]);

  const jobs =
    jobsRes.success && Array.isArray(jobsRes.data) ? jobsRes.data : [];
  const categories =
    categoriesRes.success && Array.isArray(categoriesRes.data)
      ? categoriesRes.data
      : [];

  const currentUserRole = profileRes?.data?.role || profileRes?.role || null;
  const pagination = jobsRes.pagination || null;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-6 sm:pb-28 lg:px-8">
      <JobsMarketplaceContainer
        initialJobs={jobs}
        categories={categories}
        totalJobs={jobs.length}
        pagination={pagination}
        initialParams={{
          searchTerm: resolvedParams.searchTerm,
          category: resolvedParams.category,
          service: resolvedParams.service,
          page,
        }}
        currentUserRole={currentUserRole}
      />
    </div>
  );
}
