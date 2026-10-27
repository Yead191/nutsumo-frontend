"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { nextFetch } from "@/helpers/next-fetch/core/NextFetch";
import { useResendOtp } from "@/hooks/useResendOtp";
import { OtpInput } from "@/components/ui/otp-input";

export const RESET_TOKEN_KEY = "nutsumo:resetToken";
const OTP_LENGTH = 4;

export function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const flow = searchParams.get("flow") === "reset" ? "reset" : "verify";

  const [code, setCode] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { resend, resendIn, isCoolingDown } = useResendOtp();

  const handleVerify = React.useCallback(
    async (otpToSubmit: string) => {
      if (!email) {
        toast.error("Missing email address. Please start again.");
        return;
      }
      if (otpToSubmit.length !== OTP_LENGTH) {
        toast.error("Please enter the " + OTP_LENGTH + "-digit code.");
        return;
      }

      setIsSubmitting(true);
      try {
        const response = await nextFetch("/auth/verify-email", {
          method: "POST",
          body: {
            email,
            oneTimeCode: Number(otpToSubmit),
          },
        });

        if (!response?.success) {
          toast.error(response?.message || "Invalid or expired code.");
          setCode("");
          return;
        }

        toast.success(response?.message || "Email verified successfully!");

        if (flow === "reset") {
          const data = response.data;
          const token =
            typeof data === "string"
              ? data
              : (data?.createToken || data?.resetPasswordToken || data?.token);

          if (!token) {
            toast.error("Could not obtain reset authorization. Please try again.");
            return;
          }

          sessionStorage.setItem(RESET_TOKEN_KEY, token);
          router.push("/reset-password");
          return;
        }

        // Account verification flow
        toast.success("Account verified! You can now log in.");
        router.push("/login");
      } catch (err: any) {
        console.error("verify-otp error:", err);
        toast.error(err?.message || "Verification failed. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, flow, router]
  );

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand title */}
      <p className="text-sm font-bold text-slate-900 tracking-tight mb-2">Nutsumo</p>

      {/* Red Eyebrow */}
      <span className="block text-xs font-bold uppercase tracking-wider text-[#FE375D] mb-1.5">
        ACCOUNT SECURITY
      </span>

      {/* Main Headline */}
      <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-2">
        Verify your email.
      </h1>

      {/* Subtitle */}
      <p className="text-sm text-slate-500 mb-6">
        Enter the 4-digit code sent to{" "}
        <span className="font-semibold text-slate-800">{email || "your email"}</span>.
      </p>

      <div className="space-y-6">
        {/* OTP Input */}
        <OtpInput
          value={code}
          onChange={setCode}
          length={OTP_LENGTH}
          disabled={isSubmitting}
          onComplete={(full) => handleVerify(full)}
        />

        {/* Submit Button */}
        <button
          type="button"
          onClick={() => handleVerify(code)}
          disabled={isSubmitting || code.length !== OTP_LENGTH}
          className="h-12 sm:h-13 w-full rounded-xl bg-[#FE375D] hover:bg-[#e0284e] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(254,55,93,0.3)] transition-all group disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
              <span>Verifying Code...</span>
            </>
          ) : (
            <>
              <span>{flow === "reset" ? "Verify & Continue" : "Verify Email"}</span>
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-[#FE375D] transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
              </span>
            </>
          )}
        </button>

        {/* Resend OTP */}
        <p className="text-center text-xs text-slate-500">
          Didn&apos;t receive the code?{" "}
          <button
            type="button"
            onClick={() => resend(email)}
            disabled={isCoolingDown || !email}
            className="font-bold text-[#FE375D] hover:underline disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            {isCoolingDown ? ("Resend in " + resendIn + "s") : "Resend code"}
          </button>
        </p>

        {/* Back Link */}
        <div className="pt-2 text-center">
          <Link
            href="/login"
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            ← Back to Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
