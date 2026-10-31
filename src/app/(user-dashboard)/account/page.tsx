import type { Metadata } from "next";
import { getMyJobsAction } from "@/helpers/next-fetch/apiActions/jobActions";
import { MyJobsManager } from "@/components/web-pages/customer-dashboard/my-jobs";

export const metadata: Metadata = {
  title: "My Service Requests · Nutsumo",
  description:
    "View and manage your service requests, review artisan quotes, and confirm home repair bookings.",
};

export default async function AccountPage() {
  const res = await getMyJobsAction({ page: 1, limit: 20 });
  const initialJobs = res.success && Array.isArray(res.data) ? res.data : [];

  return (
    <MyJobsManager
      initialJobs={initialJobs}
      pagination={res.pagination}
    />
  );
}
