import type { IJobItem, IJobCategory } from "@/helpers/next-fetch/apiActions/jobActions";
import type { IPaginationData } from "@/components/shared/Pagination";

export type { IJobItem, IJobCategory, IPaginationData };

export interface IJobsMarketplaceProps {
  initialJobs: IJobItem[];
  categories: IJobCategory[];
  totalJobs?: number;
  pagination?: IPaginationData | null;
  initialParams?: {
    page?: number;
    searchTerm?: string;
    category?: string;
    service?: string;
  };
  currentUserRole?: string | null;
}
