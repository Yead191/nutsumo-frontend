"use client";

import Cookies from "js-cookie";
import { toast } from "sonner";
import type { FetchResponse } from "@/helpers/next-fetch/core/NextFetch";

/**
 * Universal client-side auth error interceptor.
 * Checks if a response indicates a blocked or unauthorized session,
 * destroys the client cookies and storage, displays the backend rejection reason,
 * and forces a clean redirect to the login screen.
 */
export function handleAuthError(
  res?:
    | FetchResponse
    | {
        statusCode?: number;
        isBlocked?: boolean;
        message?: string;
        success?: boolean;
      }
    | null,
): boolean {
  if (!res) return false;

  const isBlocked =
    res.isBlocked ||
    res.statusCode === 403 ||
    (typeof res.message === "string" &&
      res.message.toLowerCase().includes("blocked"));

  const isUnauthorized = res.statusCode === 401;

  if (isBlocked || isUnauthorized) {
    // 1. Wipe cookies from the browser
    Cookies.remove("accessToken", { path: "/" });
    Cookies.remove("role", { path: "/" });

    // 2. Clear any local or session storage
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("user");
        sessionStorage.clear();
      } catch {
        // Storage access might be restricted in some browser privacy modes
      }

      // 3. Notify user with the live rejection reason from the backend
      const alertMsg =
        res.message ||
        (isBlocked
          ? "Your account has been blocked. Please contact support for assistance."
          : "Your session has expired. Please sign in again.");

      toast.error(alertMsg, {
        duration: 6000,
      });

      // 4. Redirect immediately to the login page
      const currentPath = window.location.pathname;
      const redirectParam =
        currentPath !== "/" && !currentPath.includes("/login")
          ? `?redirect=${encodeURIComponent(currentPath)}&blocked=${isBlocked ? "1" : "0"}`
          : isBlocked
            ? "?blocked=1"
            : "";

      window.location.href = `/login${redirectParam}`;
    }

    return true;
  }

  return false;
}

export default handleAuthError;
