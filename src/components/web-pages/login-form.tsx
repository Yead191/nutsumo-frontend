"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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
      if (!response?.success && response?.message?.includes("not verified")) {
        toast.info("Please verify your email address to continue.");
        router.push(
          "/verify-otp?email=" + encodeURIComponent(email) + "&flow=verify",
        );
        return;
      }

      if (response?.success) {
        if (response?.data?.createToken) {
          Cookies.set("accessToken", response.data.createToken, {
            expires: 7,
            path: "/",
          });
        }
        if (response?.data?.role) {
          Cookies.set("role", response?.data?.role, { expires: 7, path: "/" });
        }
        toast.success(response?.message || "Welcome back to Nutsumo!");
        router.replace(redirectTo);
        router.refresh();
        return;
      }

      setError(response?.message || "Invalid email or password.");
      toast.error(response?.message || "Login failed");
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsGoogleLoading(true);
        const res = await loginWithGoogle(tokenResponse.access_token || "");
        if (res?.success) {
          if (res?.data?.createToken) {
            Cookies.set("accessToken", res.data.createToken, {
              expires: 7,
              path: "/",
            });
          }
          if (res?.data?.role) {
            Cookies.set("role", res?.data?.role, { expires: 7, path: "/" });
          }
          toast.success("Signed in with Google successfully!");
          router.replace(redirectTo);
          router.refresh();
        } else {
          toast.error(res?.message || "Google sign in failed");
        }
      } catch (err: any) {
        toast.error("Google sign in failed. Please try again.");
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      toast.error("Google sign in was cancelled or failed");
    },
  });

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Welcome to Nutsumo
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Sign in to access your jobs, quotes, and artisan services.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs text-red-600 font-medium">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-[#FE375D] focus:ring-1 focus:ring-[#FE375D] focus:outline-none transition-colors"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-[#FE375D] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:border-[#FE375D] focus:ring-1 focus:ring-[#FE375D] focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FE375D] hover:bg-[#e0284e] text-white py-3 text-sm font-semibold shadow-md transition-all disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
              Or continue with
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => googleLogin()}
          disabled={isGoogleLoading}
          className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors disabled:opacity-60 cursor-pointer"
        >
          {isGoogleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
          ) : (
            <GoogleIcon className="h-4 w-4" />
          )}
          <span>Continue with Google</span>
        </button>
      </form>

      <p className="mt-8 text-center text-xs text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-[#FE375D] hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
