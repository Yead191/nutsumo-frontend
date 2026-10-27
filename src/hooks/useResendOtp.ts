"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { nextFetch } from "@/helpers/next-fetch/core/NextFetch";

const RESEND_OTP_ENDPOINT = "/auth/forget-password";

export function useResendOtp(cooldownSeconds = 30) {
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setInterval(() => setResendIn((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => clearInterval(timer);
  }, [resendIn]);

  const resend = useCallback(
    async (email: string) => {
      if (!email) {
        toast.error("Please enter a valid email address.", { id: "resend-otp" });
        return false;
      }
      if (resendIn > 0) return false;

      setResendIn(cooldownSeconds);
      try {
        const res = await nextFetch(RESEND_OTP_ENDPOINT, {
          method: "POST",
          body: { email },
        });
        if (res?.success) {
          toast.success(res?.message || "Verification code sent to your email", { id: "resend-otp" });
          return true;
        }
        toast.error(res?.message || "Failed to resend code", { id: "resend-otp" });
        return false;
      } catch {
        toast.error("Something went wrong while resending OTP", { id: "resend-otp" });
        return false;
      }
    },
    [resendIn, cooldownSeconds]
  );

  return { resend, resendIn, isCoolingDown: resendIn > 0 };
}
