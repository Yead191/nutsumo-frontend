"use client";

import * as React from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import getProfile from "@/helpers/next-fetch/core/getProfile";

/**
 * SessionGuard is a silent client-side sentinel.
 * If a user is active in their browser and an admin blocks them or session expires,
 * this component automatically verifies their session on window focus or route transitions,
 * clears their cookies, and redirects them to login.
 */
export function SessionGuard() {
  const isCheckingRef = React.useRef(false);

  React.useEffect(() => {
    const checkActiveSession = async () => {
      const token = Cookies.get("accessToken");
      if (!token || isCheckingRef.current) return;

      try {
        isCheckingRef.current = true;
        const profile = await getProfile();

        if (!profile || profile?.status === "blocked") {
          Cookies.remove("accessToken", { path: "/" });
          Cookies.remove("role", { path: "/" });

          try {
            localStorage.removeItem("user");
          } catch {}

          toast.error("Your session is no longer active or your account has been blocked.", {
            duration: 6000,
          });

          window.location.href = "/login?blocked=1";
        }
      } catch {
        // Network glitches shouldn't log users out
      } finally {
        isCheckingRef.current = false;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkActiveSession();
      }
    };

    const handleFocus = () => {
      checkActiveSession();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const initialTimer = setTimeout(() => {
      checkActiveSession();
    }, 2000);

    return () => {
      clearTimeout(initialTimer);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
}

export default SessionGuard;
