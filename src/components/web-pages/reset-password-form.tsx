"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { nextFetch } from "@/helpers/next-fetch/core/NextFetch";
import { RESET_TOKEN_KEY } from "@/components/web-pages/verify-otp-form";

export function ResetPasswordForm() {
  const router = useRouter();
  const [token, setToken] = React.useState<string | null>(null);
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const stored = sessionStorage.getItem(RESET_TOKEN_KEY);
    if (!stored) {
      toast.error("Your reset session has expired. Please restart the process.");
      router.replace("/forgot-password");
      return;
    }
    setToken(stored);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      toast.error("Missing reset token. Please request a new code.");
      router.replace("/forgot-password");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);

      const res = await nextFetch("/auth/reset-password", {
        method: "POST",
        token,
        body: {
          newPassword,
          confirmPassword,
        },
      });

      if (!res?.success) {
        const msg = res?.message || "Failed to reset password.";
        setError(msg);
        toast.error(msg);
        return;
      }

      sessionStorage.removeItem(RESET_TOKEN_KEY);
      toast.success(res.message || "Password reset successfully! Please sign in with your new password.");
      router.push("/login");
    } catch (err: any) {
      console.error("Reset password error:", err);
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
        SECURE YOUR ACCOUNT
      </span>

      {/* Main Headline */}
      <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-2">
        Set new password.
      </h1>

      {/* Subtitle */}
      <p className="text-sm text-slate-500 mb-6">
        Choose a strong new password for your Nutsumo account.
      </p>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 font-medium animate-in fade-in duration-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* New Password */}
        <div>
          <label
            htmlFor="newPassword"
            className="block text-xs font-bold text-slate-800 mb-1.5"
          >
            New Password (min 8 characters)
          </label>
          <div className="relative">
            <input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="h-12 w-full rounded-xl bg-[#FFF9FA]/60 border border-slate-200 pr-11 pl-4 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#FE375D] focus:ring-2 focus:ring-[#FE375D]/15 transition-all outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-xs font-bold text-slate-800 mb-1.5"
          >
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            className="h-12 w-full rounded-xl bg-[#FFF9FA]/60 border border-slate-200 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#FE375D] focus:ring-2 focus:ring-[#FE375D]/15 transition-all outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !token}
          className="h-12 sm:h-13 w-full rounded-xl bg-[#FE375D] hover:bg-[#e0284e] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(254,55,93,0.3)] transition-all group disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
              <span>Updating Password...</span>
            </>
          ) : (
            <>
              <span>Reset Password</span>
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-[#FE375D] transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
              </span>
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-xs sm:text-sm text-slate-500">
        Back to{" "}
        <Link
          href="/login"
          className="font-bold text-[#FE375D] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
