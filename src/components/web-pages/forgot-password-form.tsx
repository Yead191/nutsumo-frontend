"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { nextFetch } from "@/helpers/next-fetch/core/NextFetch";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const res = await nextFetch("/auth/forget-password", {
        method: "POST",
        body: { email },
      });

      if (!res?.success) {
        const msg = res?.message || "Failed to send reset code. Please check your email.";
        setError(msg);
        toast.error(msg);
        return;
      }

      toast.success(res.message || "Reset code sent! Please check your email inbox.");
      router.push("/verify-otp?email=" + encodeURIComponent(email) + "&flow=reset");
    } catch (err: any) {
      console.error("Forgot password error:", err);
      const msg = err?.message || "Something went wrong. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand title */}
      <p className="text-sm font-bold text-slate-900 tracking-tight mb-2">Nutsumo</p>

      {/* Red Eyebrow */}
      <span className="block text-xs font-bold uppercase tracking-wider text-[#FE375D] mb-1.5">
        ACCOUNT RECOVERY
      </span>

      {/* Main Headline */}
      <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-2">
        Forgot password?
      </h1>

      {/* Subtitle */}
      <p className="text-sm text-slate-500 mb-6">
        Enter your registered email address and we&apos;ll send you a 4-digit code to reset your password.
      </p>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 font-medium animate-in fade-in duration-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-bold text-slate-800 mb-1.5"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="h-12 w-full rounded-xl bg-[#FFF9FA]/60 border border-slate-200 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#FE375D] focus:ring-2 focus:ring-[#FE375D]/15 transition-all outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="h-12 sm:h-13 w-full rounded-xl bg-[#FE375D] hover:bg-[#e0284e] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(254,55,93,0.3)] transition-all group disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
              <span>Sending Code...</span>
            </>
          ) : (
            <>
              <span>Send Code</span>
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-[#FE375D] transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
              </span>
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-xs sm:text-sm text-slate-500">
        Remember your password?{" "}
        <Link
          href="/login"
          className="font-bold text-[#FE375D] hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
