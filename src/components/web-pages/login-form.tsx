"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useGoogleLogin } from "@react-oauth/google";
import { nextFetch } from "@/helpers/next-fetch/core/NextFetch";
import { loginWithGoogle } from "@/helpers/next-fetch/apiActions/authActions";
import { GoogleIcon } from "@/components/ui/google-icon";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect =
    searchParams.get("redirect") || searchParams.get("next") || "/";
  const redirectTo = rawRedirect.startsWith("/")
    ? rawRedirect
    : "/" + rawRedirect;

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await nextFetch("/auth/login", {
        method: "POST",
        body: { email, password },
      });

      // Handle unverified account
      if (
        !response?.success &&
        (response?.message?.includes("not verified") ||
          (response as any)?.suggestRoute?.includes("verify-email"))
      ) {
        toast.info("Please verify your email to activate your account.");
        router.push(
          "/verify-otp?email=" + encodeURIComponent(email) + "&flow=verify"
        );
        return;
      }

      if (!response?.success) {
        const errorMsg = response?.message || "Invalid email or password.";
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      // Successful login
      const accessToken =
        response.data?.accessToken ||
        response.data?.token ||
        response.data?.data?.accessToken;
      const role =
        response.data?.role ||
        response.data?.user?.role ||
        response.data?.data?.role ||
        "USER";

      if (accessToken) {
        Cookies.set("accessToken", accessToken, { expires: 7 });
      }
      if (role) {
        Cookies.set("role", role, { expires: 7 });
      }

      toast.success(response.message || "Welcome back to Nutsumo!");
      router.push(redirectTo);
      router.refresh();
    } catch (err: any) {
      console.error("Login error:", err);
      const msg = err?.message || "Something went wrong. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (tokenResponse: any) => {
    try {
      setIsGoogleLoading(true);
      const res = await loginWithGoogle(tokenResponse.access_token);
      if (res?.success) {
        const token = (res.data as any)?.createToken || (res.data as any)?.accessToken || (res.data as any)?.token;
        const role = res.data?.role || "USER";
        if (token) Cookies.set("accessToken", token, { expires: 7 });
        if (role) Cookies.set("role", role, { expires: 7 });

        toast.success(res.message || "Logged in with Google successfully!");
        router.push(redirectTo);
        router.refresh();
      } else {
        toast.error(res?.message || "Google login failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Google sign in failed");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => toast.error("Google login was cancelled or failed"),
  });

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand title */}
      <p className="text-sm font-bold text-slate-900 tracking-tight mb-2">Nutsumo</p>

      {/* Red Eyebrow */}
      <span className="block text-xs font-bold uppercase tracking-wider text-[#FE375D] mb-1.5">
        YOUR CUSTOMER ACCOUNT
      </span>

      {/* Main Headline */}
      <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-2">
        Welcome back.
      </h1>

      {/* Subtitle */}
      <p className="text-sm text-slate-500 mb-6">
        Log in to manage bookings, messages and saved Job Seekerss.
      </p>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 font-medium animate-in fade-in duration-200">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email or Phone */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-bold text-slate-800 mb-1.5"
          >
            Email address or Phone number
          </label>
          <input
            id="email"
            type="text"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email or phone number"
            className="h-12 w-full rounded-xl bg-[#FFF9FA]/60 border border-slate-200 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#FE375D] focus:ring-2 focus:ring-[#FE375D]/15 transition-all outline-none"
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-bold text-slate-800"
            >
              Password
            </label>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="h-12 w-full rounded-xl bg-[#FFF9FA]/60 border border-slate-200 pr-11 pl-4 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#FE375D] focus:ring-2 focus:ring-[#FE375D]/15 transition-all outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Forget Password link */}
        <div className="flex justify-end pt-0.5">
          <Link
            href="/forgot-password"
            className="text-xs sm:text-sm font-semibold text-[#FE375D] hover:underline"
          >
            Forget Password?
          </Link>
        </div>

        {/* Submit Button with White Circle Arrow */}
        <button
          type="submit"
          disabled={isLoading}
          className="h-12 sm:h-13 w-full rounded-xl bg-[#FE375D] hover:bg-[#e0284e] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(254,55,93,0.3)] transition-all group disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
              <span>Logging in...</span>
            </>
          ) : (
            <>
              <span>Login</span>
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-[#FE375D] transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
              </span>
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-5 flex items-center">
        <div className="w-full border-t border-slate-200" />
        <span className="bg-white px-3 text-xs text-slate-400 select-none">
          or
        </span>
        <div className="w-full border-t border-slate-200" />
      </div>

      {/* Google Login Button */}
      <button
        type="button"
        onClick={() => googleLogin()}
        disabled={isGoogleLoading}
        className="h-12 w-full rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center gap-3 text-sm font-semibold text-slate-700 shadow-2xs transition-colors cursor-pointer disabled:opacity-60"
      >
        {isGoogleLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
        ) : (
          <GoogleIcon className="h-4.5 w-4.5" />
        )}
        <span>Sign in with Google</span>
      </button>

      {/* Footer Register Link */}
      <p className="mt-6 text-center text-xs sm:text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-bold text-[#FE375D] hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
