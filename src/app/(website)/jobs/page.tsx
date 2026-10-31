import type { Metadata } from "next";
import { getActiveJobsMarketplaceAction } from "@/helpers/next-fetch/apiActions/jobActions";
import { getServiceCategories } from "@/helpers/next-fetch/apiActions/artisanActions";
import getProfile from "@/helpers/next-fetch/core/getProfile";
import { JobsMarketplaceContainer } from "@/components/web-pages/jobs-marketplace";

export const metadata: Metadata = {
  title: "Find Jobs & Opportunities in Ghana · Nutsumo",
  description:
    "Browse real-time home repair, construction, and maintenance jobs posted by verified clients in Ghana. Submit quotes directly with zero commission.",
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
    <div className="container-site py-8 sm:py-12">
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
