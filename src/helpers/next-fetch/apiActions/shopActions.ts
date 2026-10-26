"use server";

import { nextFetch } from "../core/NextFetch";

export interface ProductCategory {
  _id: string;
  name: string;
  status: "active" | "inactive" | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductVariant {
  size: string;
  color: string;
  stock: number;
  isPreOrder: boolean;
  expectedAvailableDate?: string | null;
}

export interface ApparelProduct {
  _id: string;
  name: string;
  description: string; // HTML string from rich text editor
  category: ProductCategory | { _id: string; name: string };
  price: number;
  compareAtPrice?: number;
  images: string[];
  variants: ProductVariant[];
  gender: "men" | "women" | "unisex" | "kids" | string;
  tags: string[];
  status: "active" | "draft" | "inactive" | "archived" | string;
  featured: boolean;
  sold?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilterParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  category?: string;
  gender?: string;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

export interface ProductsResponse {
  success: boolean;
  message?: string;
  data: ApparelProduct[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface ProductCategoriesResponse {
  success: boolean;
  message?: string;
  data: ProductCategory[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface VariantAvailabilityResponse {
  success: boolean;
  data?: {
    available: boolean;
    isPreOrder: boolean;
    stock: number;
    expectedAvailableDate: string | null;
  };
  message?: string;
}

/**
 * Fetch all active product categories
 */
export async function getProductCategories(): Promise<ProductCategoriesResponse> {
  try {
    const res = await nextFetch<ProductCategory[]>(
      "/product-category?limit=100",
      {
        cache: "force-cache",
        next: {
          revalidate: 60 * 30,
          tags: ["product-category"],
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
      message: res.message || "Failed to fetch categories",
      data: [],
    };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Network error",
      data: [],
    };
  }
}

/**
 * Fetch apparel products with filtering, search, and pagination
 */
export async function getProducts({
  page = 1,
  limit = 12,
  searchTerm = "",
  category = "",
  gender = "",
  featured,
  minPrice,
  maxPrice,
  sort = "-createdAt",
}: ProductFilterParams = {}): Promise<ProductsResponse> {
  const params = new URLSearchParams();
  if (page) params.set("page", String(page));
  if (limit) params.set("limit", String(limit));
  if (searchTerm && searchTerm.trim())
    params.set("searchTerm", searchTerm.trim());
  if (category && category !== "all") params.set("category", category);
  if (gender && gender !== "all") params.set("gender", gender);
  if (typeof featured === "boolean") params.set("featured", String(featured));
  if (typeof minPrice === "number") params.set("minPrice", String(minPrice));
  if (typeof maxPrice === "number") params.set("maxPrice", String(maxPrice));
  if (sort) params.set("sort", sort);

  try {
    const res = await nextFetch<ApparelProduct[]>(
      `/product?${params.toString()}`,
      {
        cache: "force-cache",
        next: {
          revalidate: 60 * 30,
          tags: ["product"],
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
      message: res.message || "Failed to fetch products",
      data: [],
    };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Network error",
      data: [],
    };
  }
}

/**
 * Fetch single apparel product by ID
 */
export async function getSingleProduct(id: string): Promise<{
  success: boolean;
  data: ApparelProduct | null;
  message?: string;
}> {
  try {
    const res = await nextFetch<ApparelProduct>(`/product/${id}`, {
      next: {
        revalidate: 30,
        tags: [`product-${id}`],
      },
    });

    if (res.success && res.data) {
      return {
        success: true,
        data: res.data,
      };
    }

    return {
      success: false,
      data: null,
      message: res.message || "Product not found",
    };
  } catch (err) {
    return {
      success: false,
      data: null,
      message: err instanceof Error ? err.message : "Network error",
    };
  }
}

/**
 * Check real-time variant availability
 */
export async function checkVariantAvailability(
  productId: string,
  size: string,
  color: string,
  quantity = 1,
): Promise<VariantAvailabilityResponse> {
  const params = new URLSearchParams({
    size,
    color,
    quantity: String(quantity),
  });

  try {
    const res = await nextFetch<{
      available: boolean;
      isPreOrder: boolean;
      stock: number;
      expectedAvailableDate: string | null;
    }>(`/product/check-availability/${productId}?${params.toString()}`, {
      cache: "no-store",
    });

    if (res.success && res.data) {
      return {
        success: true,
        data: res.data,
      };
    }

    return {
      success: false,
      message: res.message || "Failed to check availability",
    };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Network error",
    };
  }
}
