"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, TextField } from "@/components/ui/field";
import { PasswordField } from "@/components/ui/password-field";
import { GoogleIcon } from "@/components/ui/google-icon";
import { AuthLinks } from "@/components/web-pages/auth-links";
import { loginAs } from "@/redux/slices/authSlice";
import { setEmailVerified, setPhoneVerified } from "@/redux/slices/featuresSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { cn } from "@/lib/cn";

const DEMO_OTP = "123456";
const OTP_LEN = 6;

export function SignupForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const search = useSearchParams();
  const nextPath = search.get("next");
  const needsAccountForRequest = Boolean(nextPath?.includes("/account/post-job"));
  const draft = useAppSelector((state) => state.intake.draft);
  const user = useAppSelector((state) => state.auth.user);

  const [role, setRole] = useState<"homeowner" | "pro">("homeowner");
  const [step, setStep] = useState<"details" | "otp">("details");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState(draft.zip || "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LEN).fill(""));
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (user) {
      if (nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")) {
        router.replace(nextPath);
      } else {
        router.replace(user.role === "pro" ? "/pro" : "/account");
      }
    }
  }, [user, nextPath, router]);

  useEffect(() => {
    if (step === "otp") inputs.current[0]?.focus();
  }, [step]);

  useEffect(() => {
    if (role === "pro") router.push("/pro-register");
  }, [role, router]);

  function finishSignup() {
    dispatch(
      loginAs({
        role: "homeowner",
        profile: {
          name: name.trim() || "Alex Mercer",
          email: email.trim() || "alex@example.com",
          phone: phone.trim() || "(512) 555-0199",
          zip: zip.trim() || "78701",
          city: "Austin",
          state: "TX",
        },
      }),
    );
    dispatch(setEmailVerified(true));
    dispatch(setPhoneVerified(true));
    if (nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")) {
      router.push(nextPath);
      return;
    }
    router.push(draft.summary ? "/account/post-job" : "/account");
  }

  function handleGoogleSignUp() {
    setError("");
    dispatch(
      loginAs({
        role: "homeowner",
        profile: {
          name: "Alex Mercer",
          email: "alex.mercer@gmail.com",
          phone: "(512) 555-0199",
          zip: draft.zip || "78701",
          city: "Austin",
          state: "TX",
        },
      }),
    );
    dispatch(setEmailVerified(true));
    dispatch(setPhoneVerified(true));
    if (nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")) {
      router.push(nextPath);
      return;
    }
    router.push(draft.summary ? "/account/post-job" : "/account");
  }

  function submitDetails(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    finishSignup();
  }

  function submitOtp(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    finishSignup();
  }

  function onOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setError("");
    if (digit && index < OTP_LEN - 1) inputs.current[index + 1]?.focus();
  }

  function onOtpKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  function onOtpPaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LEN);
    if (!pasted) return;
    const next = Array(OTP_LEN).fill("");
    pasted.split("").forEach((char, i) => {
      next[i] = char;
    });
    setOtp(next);
    inputs.current[Math.min(pasted.length, OTP_LEN) - 1]?.focus();
  }

  const maskedPhone = phone.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");

  if (step === "otp") {
    return (
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
          Step 2 of 2
        </span>
        <h1 className="mt-3 font-display text-[22px] sm:text-[24px] font-semibold leading-snug tracking-tight text-title">
          Verify your phone
        </h1>
        <p className="mt-1.5 font-sans text-sm leading-relaxed text-[#757575]">
          Enter the 6-digit code sent to <span className="font-semibold text-title">{maskedPhone || phone}</span>.
        </p>
        <p className="mt-1 font-sans text-xs text-[#757575]/80">Demo code: {DEMO_OTP}</p>

        <form className="mt-6 space-y-4" onSubmit={submitOtp}>
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                maxLength={1}
                value={digit}
                onChange={(event) => onOtpChange(index, event.target.value)}
                onKeyDown={(event) => onOtpKeyDown(index, event)}
                onPaste={onOtpPaste}
                className={cn(
                  "h-12 w-10 rounded-[10px] border border-line bg-white text-center font-display text-lg font-bold text-title outline-none focus:border-primary sm:h-14 sm:w-12",
                )}
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>
          {error ? <p className="text-sm text-error">{error}</p> : null}
          <Button type="submit" className="w-full">
            Verify and create account ↗
          </Button>
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <button
              type="button"
              className="font-semibold text-muted hover:text-title"
              onClick={() => {
                setStep("details");
                setError("");
              }}
            >
              ← Edit details
            </button>
            <button
              type="button"
              className="font-semibold text-primary"
              onClick={() => {
                setResent(true);
                setError("");
              }}
            >
              {resent ? "Code resent" : "Resend code"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
        Step 1 of 2
      </span>
      <h1 className="mt-3 font-display text-[22px] sm:text-[26px] font-semibold leading-snug tracking-tight text-title">
        Create a free account
      </h1>
      <p className="mt-2 font-sans text-sm leading-relaxed text-[#757575]">
        {needsAccountForRequest
          ? "You need a homeowner account to create a request. Signup is free."
          : "Choose your role. Homeowners are free. Pros apply for review."}
      </p>

      <div
        role="tablist"
        aria-label="Account type"
        className="mt-6 grid grid-cols-2 rounded-full border border-line bg-smoke p-1"
      >
        {(
          [
            ["homeowner", "Homeowner"],
            ["pro", "Professional"],
          ] as const
        ).map(([value, label]) => {
          const active = role === value;
          return (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setRole(value)}
              className={cn(
                "min-h-[44px] rounded-full font-display text-sm font-bold transition-colors",
                active
                  ? "bg-primary text-white shadow-sm"
                  : "bg-transparent text-title hover:text-primary",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      <form className="mt-7 space-y-5" onSubmit={submitDetails}>
        <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-[1.5fr_1fr]">
          <Field label="Full name">
            <TextField
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Jane Smith"
              autoComplete="name"
            />
          </Field>
          <Field label="Home ZIP">
            <TextField
              required
              value={zip}
              onChange={(event) => setZip(event.target.value)}
              placeholder="78701"
              inputMode="numeric"
              autoComplete="postal-code"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
          <Field label="Email">
            <TextField
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@email.com"
              autoComplete="email"
            />
          </Field>
          <Field label="Mobile phone">
            <TextField
              required
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="(512) 555-0100"
              autoComplete="tel"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
          <Field label="Password">
            <PasswordField
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Min 6 characters"
              autoComplete="new-password"
            />
          </Field>
          <Field label="Confirm password">
            <PasswordField
              required
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              placeholder="Repeat password"
              autoComplete="new-password"
            />
          </Field>
        </div>

        <label className="flex items-start gap-2.5 pt-1 text-sm leading-6 text-copy">
          <input type="checkbox" required className="mt-0.5 h-4 w-4 rounded accent-primary" />
          <span>
            I agree to the{" "}
            <Link href="/terms" className="font-semibold text-primary hover:underline">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-semibold text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {error ? <p className="text-xs font-medium text-error">{error}</p> : null}
        <Button type="submit" className="w-full">
          Continue to OTP ↗
        </Button>
      </form>

      {/* Or Divider */}
      <div className="relative my-6 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-line/80" />
        </div>
        <span className="relative bg-white px-3 font-display text-xs font-medium uppercase tracking-wider text-muted">
          Or
        </span>
      </div>

      {/* Google Sign Up Button */}
      <button
        type="button"
        onClick={handleGoogleSignUp}
        className="flex w-full items-center justify-center gap-2.5 rounded-full border border-line bg-white px-5 py-3 font-display text-sm font-semibold text-title shadow-2xs transition-all duration-200 hover:bg-smoke/70 hover:border-line hover:shadow-xs active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary cursor-pointer"
      >
        <GoogleIcon className="h-4.5 w-4.5" />
        <span>Continue with Google ↗</span>
      </button>

      <AuthLinks
        prompt="Already have an account?"
        href={nextPath ? `/login?next=${encodeURIComponent(nextPath)}` : "/login"}
        label="Sign in ↗"
      />
    </div>
  );
}
