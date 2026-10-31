"use server";

import { nextFetch, type FetchResponse } from "../core/NextFetch";
import { revalidateTags } from "../core/revalidateTags";
import { revalidatePath } from "next/cache";

export type JobStatus =
  | "OPEN"
  | "BOOKED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface IJobCategory {
  _id: string;
  name: string;
  slug?: string;
  image?: string;
}

export interface IJobService {
  _id: string;
  name: string;
  slug?: string;
  category?: string;
}

export interface IJobCustomer {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  image?: string;
}

export interface IJobItem {
  _id: string;
  customer?: IJobCustomer | string;
  title: string;
  description: string;
  category?: IJobCategory | string;
  service?: IJobService | string;
  customServiceName?: string;
  location: string;
  postCode?: string;
  budget: number;
  preferredDate?: string;
  status: JobStatus;
  images?: string[];
  selectedQuotation?: string;
  selectedArtisan?: string;
  quotationsCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface IGetJobsParams {
  page?: number;
  limit?: number;
  status?: string;
  searchTerm?: string;
  category?: string;
  service?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * GET /job — Fetch public/active marketplace jobs with search, category ID, service ID, sorting & pagination
 */
export async function getActiveJobsMarketplaceAction(
  params?: IGetJobsParams,
): Promise<FetchResponse<IJobItem[]>> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.searchTerm?.trim())
    query.set("searchTerm", params.searchTerm.trim());
  if (params?.category) query.set("category", params.category);
  if (params?.service) query.set("service", params.service);
  // if (params?.sortBy) query.set("sortBy", params.sortBy);
  // if (params?.sortOrder) query.set("sortOrder", params.sortOrder);

  const qs = query.toString();
  const path = qs ? `?${qs}` : "";

  return nextFetch<IJobItem[]>(`/job${path}`, {
    method: "GET",
    cache: "no-store",
    tags: ["jobs", "marketplace-jobs"],
  });
}

/**
 * POST /job — Create a new service job request (multipart/form-data or json)
 */
export async function createJobAction(
  formData: FormData,
): Promise<FetchResponse<IJobItem>> {
  const result = await nextFetch<IJobItem>("/job", {
    method: "POST",
    body: formData,
  });

  if (result.success) {
    await revalidateTags(["jobs", "my-jobs"]);
    revalidatePath("/account");
    revalidatePath("/pro/jobs");
  }

  return result;
}

/**
 * GET /job/my-jobs — Fetch authenticated customer's posted jobs
 */
export async function getMyJobsAction(
  params?: IGetJobsParams,
): Promise<FetchResponse<IJobItem[]>> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.status && params.status !== "ALL")
    query.set("status", params.status);
  if (params?.searchTerm?.trim())
    query.set("searchTerm", params.searchTerm.trim());
  if (params?.category) query.set("category", params.category);

  const qs = query.toString();
  const path = qs ? `?${qs}` : "";

  return nextFetch<IJobItem[]>(`/job/my-jobs${path}`, {
    method: "GET",
    cache: "no-store",
    tags: ["my-jobs", "jobs"],
  });
}

/**
 * GET /job/:id — Fetch single job details
 */
export async function getJobDetailsAction(
  id: string,
): Promise<FetchResponse<IJobItem>> {
  return nextFetch<IJobItem>(`/job/${id}`, {
    method: "GET",
    cache: "no-store",
    tags: ["jobs", `job-${id}`],
  });
}

/**
 * PATCH /job/:id/cancel — Customer cancels an open job
 */
export async function cancelJobAction(
  id: string,
): Promise<FetchResponse<IJobItem>> {
  const result = await nextFetch<IJobItem>(`/job/${id}/cancel`, {
    method: "PATCH",
  });

  if (result.success) {
    await revalidateTags(["jobs", "my-jobs", `job-${id}`, "quotations"]);
    revalidatePath("/account");
    revalidatePath(`/account/jobs/${id}`);
  }

  return result;
}
