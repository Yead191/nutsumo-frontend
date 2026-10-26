"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, TextField } from "@/components/ui/field";
import { PasswordField } from "@/components/ui/password-field";
import { AuthLinks } from "@/components/web-pages/auth-links";
import { cn } from "@/lib/cn";

const OTP_LEN = 6;

type Step = "email" | "otp" | "password" | "done";

function maskEmail(value: string) {
  const [local, domain] = value.split("@");
  if (!local || !domain) return value;
  const keep = local.slice(0, 1);
  return `${keep}${"•".repeat(Math.max(local.length - 1, 2))}@${domain}`;
}

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LEN).fill(""));
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (step === "otp") inputs.current[0]?.focus();
  }, [step]);

  async function requestCode(isResend = false) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return false;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!response.ok || !data?.ok) {
        setError(data?.error || "We could not send a code. Try again.");
        return false;
      }
      setOtp(Array(OTP_LEN).fill(""));
      setResent(isResend);
      setStep("otp");
      return true;
    } catch {
      setError("We could not send a code. Try again.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  function sendCode(event: React.FormEvent) {
    event.preventDefault();
    void requestCode(false);
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

  async function verifyOtp(event: React.FormEvent) {
    event.preventDefault();
    const code = otp.join("");
    if (code.length < OTP_LEN) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!response.ok || !data?.ok) {
        setError(data?.error || "That code is incorrect or expired.");
        return;
      }
      setStep("password");
    } catch {
      setError("That code is incorrect or expired.");
    } finally {
      setBusy(false);
    }
  }

  function updatePassword(event: React.FormEvent) {
    event.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setStep("done");
  }

  return (
    <div>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
        {step === "done" ? "Account Recovery" : `Step ${step === "email" ? 1 : step === "otp" ? 2 : 3} of 3`}
      </span>

      {step === "email" ? (
        <>
          <h1 className="mt-3 font-display text-[22px] sm:text-[26px] font-semibold leading-snug tracking-tight text-title">
            Forgot password
          </h1>
          <p className="mt-2 text-sm leading-6 text-copy">
            Enter the email on the account. We will send a 6-digit code to reset your password.
          </p>
          <form className="mt-6 space-y-5" onSubmit={sendCode}>
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
            {error ? <p className="text-sm text-error">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Sending code…" : "Send code ↗"}
            </Button>
          </form>
        </>
      ) : null}

      {step === "otp" ? (
        <>
          <h1 className="mt-3 font-display text-[22px] sm:text-[26px] font-semibold leading-snug tracking-tight text-title">
            Check your email
          </h1>
          <p className="mt-2 text-sm leading-6 text-copy">
            We sent a 6-digit code to{" "}
            <span className="font-semibold text-title">{maskEmail(email)}</span>. Enter it here to reset your password.
          </p>
          <form className="mt-6 space-y-5" onSubmit={verifyOtp}>
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
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Checking…" : "Verify code ↗"}
            </Button>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <button
                type="button"
                className="font-semibold text-muted hover:text-title"
                disabled={busy}
                onClick={() => {
                  setStep("email");
                  setError("");
                }}
              >
                ← Edit email
              </button>
              <button
                type="button"
                className="font-semibold text-primary"
                disabled={busy}
                onClick={() => {
                  void requestCode(true);
                }}
              >
                {resent ? "Code resent" : "Resend code"}
              </button>
            </div>
          </form>
        </>
      ) : null}

      {step === "password" ? (
        <>
          <h1 className="mt-3 font-display text-[22px] sm:text-[26px] font-semibold leading-snug tracking-tight text-title">
            Set a new password
          </h1>
          <p className="mt-2 text-sm leading-6 text-copy">Choose a password you do not use elsewhere.</p>
          <form className="mt-6 space-y-5" onSubmit={updatePassword}>
            <Field label="New password">
              <PasswordField
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                placeholder="Min 6 characters"
              />
            </Field>
            <Field label="Confirm password">
              <PasswordField
                required
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
                autoComplete="new-password"
                placeholder="Repeat password"
              />
            </Field>
            {error ? <p className="text-sm text-error">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={busy}>
              Update password ↗
            </Button>
          </form>
        </>
      ) : null}

      {step === "done" ? (
        <>
          <h1 className="mt-3 font-display text-[22px] sm:text-[26px] font-semibold leading-snug tracking-tight text-title">
            Password updated
          </h1>
          <p className="mt-2 text-sm leading-6 text-copy">
            You can sign in with your new password for {maskEmail(email)}.
          </p>
          <div className="mt-6">
            <Button href="/login" className="w-full">
              Sign in ↗
            </Button>
          </div>
        </>
      ) : null}

      <AuthLinks prompt="Remembered it?" href="/login" label="Sign in" />
    </div>
  );
}
