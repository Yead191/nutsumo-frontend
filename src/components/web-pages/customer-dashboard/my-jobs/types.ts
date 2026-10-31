import type { IJobItem, JobStatus } from "@/helpers/next-fetch/apiActions/jobActions";

export type JobFilterTab = "ALL" | JobStatus;

export interface MyJobsManagerProps {
  initialJobs: IJobItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}
