"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { PasswordField } from "@/components/ui/password-field";
import { cn } from "@/lib/cn";

export function AccountPasswordForm() {
  const pathname = usePathname();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const profileHref = pathname.startsWith("/pro") ? "/pro/profile" : "/account/profile";

  // Real-time requirement checks
  const hasMinLength = next.length >= 8;
  const hasNumber = /\d/.test(next);
  const passwordsMatch = next.length > 0 && next === confirm;

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (current.length < 6) {
      setError("Please enter your current account password.");
      setSaved(false);
      return;
    }
    if (next.length < 8) {
      setError("New password must be at least 8 characters long.");
      setSaved(false);
      return;
    }
    if (!hasNumber) {
      setError("New password must include at least one number.");
      setSaved(false);
      return;
    }
    if (next !== confirm) {
      setError("New password and confirmation do not match.");
      setSaved(false);
      return;
    }

    setError("");
    setSaved(true);
    setCurrent("");
    setNext("");
    setConfirm("");
    setTimeout(() => setSaved(false), 5000);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Top Header */}
      <div className="border-b border-line/70 pb-4 pt-1">
        <Link
          href={profileHref}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mb-2.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Profile</span>
        </Link>
        <h1 className="font-display text-[22px] sm:text-[26px] font-semibold tracking-tight text-title">
          Change Password
        </h1>
        <p className="mt-1 text-sm text-muted">
          Update your password to keep your account secure.
        </p>
      </div>

      {saved && (
        <div className="flex items-center gap-2.5 rounded-[14px] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-semibold">Password updated successfully.</p>
            <p className="text-xs text-emerald-700 mt-0.5">
              Your new password is now active for all future sign-ins.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2.5 rounded-[14px] border border-red-200 bg-red-50 p-4 text-sm text-error animate-in fade-in">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Password Card */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-line/70 pb-4">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-[17px] font-bold text-title">
              Password Credentials
            </h2>
            <p className="text-xs text-muted">Enter your existing password and choose a new one</p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={submit}>
          <Field label="Current Password">
            <PasswordField
              name="current"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="Enter current password"
              autoComplete="current-password"
              required
            />
          </Field>

          <Field label="New Password">
            <PasswordField
              name="next"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              required
            />
          </Field>

          <Field label="Confirm New Password">
            <PasswordField
              name="confirm"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-type new password"
              autoComplete="new-password"
              required
            />
          </Field>

          {/* Password Strength Checklist */}
          {next.length > 0 && (
            <div className="rounded-[12px] bg-smoke/60 p-3.5 space-y-2 border border-line/50 text-xs">
              <p className="font-display font-semibold text-title text-[11.5px] uppercase tracking-wider">
                Password Requirements
              </p>
              <div className="grid gap-2 sm:grid-cols-3">
                <div
                  className={cn(
                    "flex items-center gap-1.5 font-medium transition-colors",
                    hasMinLength ? "text-emerald-600" : "text-muted",
                  )}
                >
                  <Check
                    className={cn(
                      "h-3.5 w-3.5 stroke-[2.5]",
                      hasMinLength ? "text-emerald-600" : "text-muted/40",
                    )}
                  />
                  <span>8+ characters</span>
                </div>

                <div
                  className={cn(
                    "flex items-center gap-1.5 font-medium transition-colors",
                    hasNumber ? "text-emerald-600" : "text-muted",
                  )}
                >
                  <Check
                    className={cn(
                      "h-3.5 w-3.5 stroke-[2.5]",
                      hasNumber ? "text-emerald-600" : "text-muted/40",
                    )}
                  />
                  <span>1+ number</span>
                </div>

                <div
                  className={cn(
                    "flex items-center gap-1.5 font-medium transition-colors",
                    passwordsMatch ? "text-emerald-600" : "text-muted",
                  )}
                >
                  <Check
                    className={cn(
                      "h-3.5 w-3.5 stroke-[2.5]",
                      passwordsMatch ? "text-emerald-600" : "text-muted/40",
                    )}
                  />
                  <span>Passwords match</span>
                </div>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-line/60 flex items-center justify-between gap-3">
            <Button type="submit" size="sm">
              Save New Password
            </Button>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
