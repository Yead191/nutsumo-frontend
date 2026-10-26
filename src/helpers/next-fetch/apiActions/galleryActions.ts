"use server";

import { nextFetch } from "../core/NextFetch";

export type FOLDER_STATUS = "Draft" | "Published" | "Archived";

export interface GalleryFolder {
  _id: string;
  id?: string;
  name: string;
  description?: string;
  image?: string;
  category?: string;
  location?: string;
  date?: string;
  status?: FOLDER_STATUS | string;
  featured?: boolean;
  galleryCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface FoldersResponse {
  success: boolean;
  message?: string;
  data: GalleryFolder[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface GalleryItem {
  _id: string;
  id?: string;
  folder?:
    | string
    | {
        _id: string;
        name: string;
        image?: string;
        category?: string;
        location?: string;
        date?: string;
        status?: FOLDER_STATUS | string;
        featured?: boolean;
      };
  image: string;
  caption?: string;
  title?: string;
  category?: string;
  location?: string;
  date?: string;
  featured?: boolean;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleriesResponse {
  success: boolean;
  message?: string;
  data: GalleryItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

/**
 * Fetch all public gallery albums / folders from backend API
 */
export async function getFolders({
  page = 1,
  limit = 50,
  searchTerm = "",
  category = "",
  featured,
  sort = "-featured -createdAt",
}: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  category?: string;
  featured?: boolean;
  sort?: string;
} = {}): Promise<FoldersResponse> {
  const params = new URLSearchParams();
  if (page) params.set("page", String(page));
  if (limit) params.set("limit", String(limit));
  if (searchTerm && searchTerm.trim())
    params.set("searchTerm", searchTerm.trim());
  if (category && category !== "All") params.set("category", category);
  if (typeof featured === "boolean") params.set("featured", String(featured));
  if (sort) params.set("sort", sort);

  try {
    const res = await nextFetch<GalleryFolder[]>(
      `/folder?${params.toString()}`,
      {
        next: {
          revalidate: 60,
          tags: ["folders"],
        },
      },
    );

    if (res.success && Array.isArray(res.data)) {
      return {
        success: true,
        data: res.data,
        pagination: res.pagination,
      };
    }

    return {
      success: false,
      message: res.message || "Failed to fetch folders",
      data: [],
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
      data: [],
    };
  }
}

/**
 * Fetch single folder by ID
 */
export async function getFolderById(id: string): Promise<{
  success: boolean;
  data: GalleryFolder | null;
  message?: string;
}> {
  try {
    const res = await nextFetch<GalleryFolder>(`/folder/${id}`, {
      next: {
        revalidate: 60,
        tags: ["folders", `folder-${id}`],
      },
    });

    if (res.success && res.data) {
      return { success: true, data: res.data };
    }

    return { success: false, data: null, message: res.message };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}

/**
 * Fetch published gallery items directly from backend API
 */
export async function getGalleries({
  page = 1,
  limit = 50,
  searchTerm = "",
  category = "",
  folder = "",
  featured,
  sort = "-createdAt",
}: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  category?: string;
  folder?: string;
  featured?: boolean;
  sort?: string;
} = {}): Promise<GalleriesResponse> {
  const params = new URLSearchParams();
  if (page) params.set("page", String(page));
  if (limit) params.set("limit", String(limit));
  if (searchTerm && searchTerm.trim())
    params.set("searchTerm", searchTerm.trim());
  if (category && category !== "All") params.set("category", category);
  if (folder && folder.trim()) params.set("folder", folder.trim());
  if (typeof featured === "boolean") params.set("featured", String(featured));
  if (sort) params.set("sort", sort);

  try {
    const tags = ["galleries"];
    if (folder) tags.push(`folder-${folder}`);

    const res = await nextFetch<GalleryItem[]>(
      `/gallery?${params.toString()}`,
      {
        next: {
          revalidate: 60,
          tags,
        },
      },
    );

    if (res.success && Array.isArray(res.data)) {
      return {
        success: true,
        data: res.data,
        pagination: res.pagination,
      };
    }

    return {
      success: false,
      message: res.message || "Failed to fetch galleries",
      data: [],
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
      data: [],
    };
  }
}

/**
 * Fetch single gallery item by MongoDB ID directly from backend API
 */
export async function getSingleGallery(id: string): Promise<{
  success: boolean;
  data: GalleryItem | null;
}> {
  try {
    const res = await nextFetch<GalleryItem>(`/gallery/${id}`, {
      next: {
        revalidate: 60,
      },
    });

    if (res.success && res.data) {
      return { success: true, data: res.data };
    }

    return { success: false, data: null };
  } catch {
    return { success: false, data: null };
  }
}
