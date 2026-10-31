import type { IJobItem, IJobCategory } from "@/helpers/next-fetch/apiActions/jobActions";

export type { IJobItem, IJobCategory };

export interface IMarketplaceFilterState {
  searchTerm: string;
  category: string; // Category _id
  sortBy: string;
  sortOrder: "asc" | "desc";
  page: number;
}

export interface IJobsMarketplaceProps {
  initialJobs: IJobItem[];
  categories: IJobCategory[];
  totalJobs?: number;
  initialParams?: {
    searchTerm?: string;
    category?: string;
    sortBy?: string;
  };
  currentUserRole?: string | null;
}
