/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { cookies } from "next/headers";
import { getAccessToken } from "./getAccessToken";

interface Pagination {
  total: number;
  limit: number;
  page: number;
  totalPage: number;
}
export interface FetchResponse<T = any> {
  success: boolean;
  statusCode?: number;
  isBlocked?: boolean;
  message?: string;
  data?: T;
  error?: string | null;
  pagination?: Pagination;
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface FetchOptions {
  method?: HttpMethod;
  body?: any;
  token?: string;
  headers?: Record<string, string>;
  cache?: RequestCache;
  tags?: string[];
  next?: NextFetchRequestConfig;
}
export const nextFetch = async <T = any>(
  url: string,
  {
    method = "GET",
    body,
    tags,
    token,
    headers = {},
    cache = "default",
    next = {}
  }: FetchOptions = {}
): Promise<FetchResponse<T>> => {
  const accessToken = await getAccessToken();
  const isFormData = body instanceof FormData;
  const hasBody = body !== undefined && method !== "GET";

  const reqHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(token ? { Authorization: `${token}` } : {}),
  };

  try {
    const res = await fetch(`${process.env.BASE_URL}${url}`, {
      method,
      headers: reqHeaders,
      ...(hasBody && {
        body: isFormData ? body : JSON.stringify(body),
      }),
      cache: method === "GET" ? cache : "no-store",
      next: {
        ...next,
        ...(tags && { tags }),
      },
    });
    const json = await res.json();

    if (!res.ok) {
      const isAuthError = res.status === 401 || res.status === 403;
      const isBlocked =
        res.status === 403 ||
        Boolean(json?.message && typeof json.message === "string" && json.message.toLowerCase().includes("blocked"));

      if (isAuthError) {
        try {
          const cookieStore = await cookies();
          cookieStore.delete("accessToken");
          cookieStore.delete("role");
        } catch {
          // Cookies cannot be modified during static render; client interceptor will catch and clear
        }
      }

      return {
        success: false,
        statusCode: res.status,
        isBlocked,
        message:
          json?.message ||
          (isBlocked
            ? "Your account has been blocked. Please contact support."
            : "Request failed"),
        error: json?.errorMessages || "Request failed",
      };
    }

    return {
      success: true,
      message: json?.message,
      data: json?.data,
      error: null,
      pagination: json?.pagination
    };
  } catch (err) {
    return {
      success: false,
      message: "Network error",
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
};
