"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, ArrowRight, UserCheck, Wrench } from "lucide-react";
import { toast } from "sonner";
import { useGoogleLogin } from "@react-oauth/google";
import { nextFetch } from "@/helpers/next-fetch/core/NextFetch";
import { loginWithGoogle } from "@/helpers/next-fetch/apiActions/authActions";
import { GoogleIcon } from "@/components/ui/google-icon";
import Cookies from "js-cookie";
import { cn } from "@/lib/cn";

export function SignupForm() {
  const router = useRouter();
  const [role, setRole] = React.useState<"USER" | "ARTISAN">("USER");

  // Common fields
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  // Artisan specific fields
  const [company, setCompany] = React.useState("");
  const [jobTitle, setJobTitle] = React.useState("");
  const [yearsExperience, setYearsExperience] = React.useState("3-5 years");
  const [hourlyRate, setHourlyRate] = React.useState("45");
  const [bio, setBio] = React.useState("");

  const [isLoading, setIsLoading] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (role === "ARTISAN" && !company) {
      setError("Please enter your Company or Business Name.");
      return;
    }

    try {
      setIsLoading(true);

      if (role === "USER") {
        // Customer Registration
        const res = await nextFetch("/auth/register", {
          method: "POST",
          body: {
            name,
            email,
            password,
            phone: phone || undefined,
          },
        });

        if (
          !res?.success &&
          res?.message?.includes("Account is not verified")
        ) {
          toast.info("Account already created. Please verify your email.");
          router.push("/verify-otp?email=" + encodeURIComponent(email) + "&flow=verify");
          return;
        }

        if (!res?.success) {
          const msg = res?.message || "Registration failed. Please try again.";
          setError(msg);
          toast.error(msg);
          return;
        }

        toast.success(res.message || "Account created! Please check your email for the verification code.");
        router.push("/verify-otp?email=" + encodeURIComponent(email) + "&flow=verify");
      } else {
        // Artisan Registration
        const vendorProfile = JSON.stringify({
          jobTitle: jobTitle || "Artisan Specialist",
          contactNo: phone || "1234567890",
          bio: bio || ("Professional " + (jobTitle || "Artisan") + " registered on Nutsumo."),
          expertise: [jobTitle || "General Maintenance"],
          yearsExperience: yearsExperience || "3-5 years",
          degree: "Trade Qualification",
          hourlyRate: Number(hourlyRate) || 45,
          availability: "Full Time",
          consultationTypes: ["In-Person", "On-site Quote"],
        });

        const res = await nextFetch("/auth/register/vendor", {
          method: "POST",
          body: {
            name,
            email,
            password,
            company,
            vendorProfile,
          },
        });

        if (
          !res?.success &&
          res?.message?.includes("Account is not verified")
        ) {
          toast.info("Account already created. Please verify your email.");
          router.push("/verify-otp?email=" + encodeURIComponent(email) + "&flow=verify");
          return;
        }

        if (!res?.success) {
          const msg = res?.message || "Artisan registration failed. Please try again.";
          setError(msg);
          toast.error(msg);
          return;
        }

        toast.success(res.message || "Artisan account created! Please verify your email to continue.");
        router.push("/verify-otp?email=" + encodeURIComponent(email) + "&flow=verify");
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      const msg = err?.message || "Network error. Please try again.";
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
        const userRole = res.data?.role || "USER";
        if (token) Cookies.set("accessToken", token, { expires: 7 });
        if (userRole) Cookies.set("role", userRole, { expires: 7 });

        toast.success("Signed up with Google successfully!");
        router.push("/");
        router.refresh();
      } else {
        toast.error(res?.message || "Google sign up failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Google sign up failed");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => toast.error("Google signup was cancelled or failed"),
  });

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand title */}
      <p className="text-sm font-bold text-slate-900 tracking-tight mb-2">Nutsumo</p>

      {/* Role Toggle Tabs */}
      <div className="mb-4 grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200/80">
        <button
          type="button"
          onClick={() => {
            setRole("USER");
            setError("");
          }}
          className={cn(
            "flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer",
            role === "USER"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          )}
        >
          <UserCheck className="h-3.5 w-3.5 text-[#FE375D]" />
          <span>Customer</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setRole("ARTISAN");
            setError("");
          }}
          className={cn(
            "flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer",
            role === "ARTISAN"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          )}
        >
          <Wrench className="h-3.5 w-3.5 text-[#FE375D]" />
          <span>Artisan / Pro</span>
        </button>
      </div>

      {/* Red Eyebrow */}
      <span className="block text-xs font-bold uppercase tracking-wider text-[#FE375D] mb-1.5">
        {role === "USER" ? "YOUR CUSTOMER ACCOUNT" : "BECOME A VERIFIED ARTISAN"}
      </span>

      {/* Main Headline */}
      <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-2">
        {role === "USER" ? "Create your account." : "Join as an Artisan."}
      </h1>

      {/* Subtitle */}
      <p className="text-sm text-slate-500 mb-6">
        {role === "USER"
          ? "Join Nutsumo to hire verified artisans and manage your bookings."
          : "Grow your trade business and get matched with quality clients."}
      </p>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 font-medium animate-in fade-in duration-200">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Full Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-xs font-bold text-slate-800 mb-1"
          >
            Full Name *
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. John Doe"
            className="h-11 sm:h-12 w-full rounded-xl bg-[#FFF9FA]/60 border border-slate-200 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#FE375D] focus:ring-2 focus:ring-[#FE375D]/15 transition-all outline-none"
          />
        </div>

        {/* Email Address */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-bold text-slate-800 mb-1"
          >
            Email address *
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-11 sm:h-12 w-full rounded-xl bg-[#FFF9FA]/60 border border-slate-200 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#FE375D] focus:ring-2 focus:ring-[#FE375D]/15 transition-all outline-none"
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-xs font-bold text-slate-800 mb-1"
          >
            Phone number {role === "ARTISAN" ? "*" : "(optional)"}
          </label>
          <input
            id="phone"
            type="tel"
            required={role === "ARTISAN"}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="h-11 sm:h-12 w-full rounded-xl bg-[#FFF9FA]/60 border border-slate-200 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#FE375D] focus:ring-2 focus:ring-[#FE375D]/15 transition-all outline-none"
          />
        </div>

        {/* Artisan Specific Fields */}
        {role === "ARTISAN" && (
          <>
            <div>
              <label
                htmlFor="company"
                className="block text-xs font-bold text-slate-800 mb-1"
              >
                Business / Company Name *
              </label>
              <input
                id="company"
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Apex Plumbing & Electric Ltd"
                className="h-11 sm:h-12 w-full rounded-xl bg-[#FFF9FA]/60 border border-slate-200 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#FE375D] focus:ring-2 focus:ring-[#FE375D]/15 transition-all outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="jobTitle"
                  className="block text-xs font-bold text-slate-800 mb-1"
                >
                  Primary Trade *
                </label>
                <select
                  id="jobTitle"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="h-11 sm:h-12 w-full rounded-xl bg-[#FFF9FA]/60 border border-slate-200 px-3 text-sm text-slate-900 focus:bg-white focus:border-[#FE375D] focus:ring-2 focus:ring-[#FE375D]/15 transition-all outline-none"
                >
                  <option value="">Select Trade</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Painter & Decorator">Painter & Decorator</option>
                  <option value="HVAC Specialist">HVAC Specialist</option>
                  <option value="Mason / Builder">Mason / Builder</option>
                  <option value="Handyman">Handyman</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="hourlyRate"
                  className="block text-xs font-bold text-slate-800 mb-1"
                >
                  Hourly Rate ($)
                </label>
                <input
                  id="hourlyRate"
                  type="number"
                  min="1"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  placeholder="45"
                  className="h-11 sm:h-12 w-full rounded-xl bg-[#FFF9FA]/60 border border-slate-200 px-4 text-sm text-slate-900 focus:bg-white focus:border-[#FE375D] focus:ring-2 focus:ring-[#FE375D]/15 transition-all outline-none"
                />
              </div>
            </div>
          </>
        )}

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-xs font-bold text-slate-800 mb-1"
          >
            Password (min 8 characters) *
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 sm:h-12 w-full rounded-xl bg-[#FFF9FA]/60 border border-slate-200 pr-11 pl-4 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#FE375D] focus:ring-2 focus:ring-[#FE375D]/15 transition-all outline-none"
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
            className="block text-xs font-bold text-slate-800 mb-1"
          >
            Confirm Password *
          </label>
          <input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="h-11 sm:h-12 w-full rounded-xl bg-[#FFF9FA]/60 border border-slate-200 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#FE375D] focus:ring-2 focus:ring-[#FE375D]/15 transition-all outline-none"
          />
        </div>

        <p className="text-[11px] leading-relaxed text-slate-400 pt-1">
          By registering, you agree to Nutsumo&apos;s Terms of Service and Privacy Policy.
        </p>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="h-12 sm:h-13 w-full rounded-xl bg-[#FE375D] hover:bg-[#e0284e] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(254,55,93,0.3)] transition-all group disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>{role === "USER" ? "Create Account" : "Register as Artisan"}</span>
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-[#FE375D] transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
              </span>
            </>
          )}
        </button>
      </form>

      {/* Google Sign up for User */}
      {role === "USER" && (
        <>
          <div className="relative my-4 flex items-center">
            <div className="w-full border-t border-slate-200" />
            <span className="bg-white px-3 text-xs text-slate-400 select-none">
              or
            </span>
            <div className="w-full border-t border-slate-200" />
          </div>

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
            <span>Sign up with Google</span>
          </button>
        </>
      )}

      {/* Footer Login Link */}
      <p className="mt-5 text-center text-xs sm:text-sm text-slate-500">
        Already have an account?{" "}
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
