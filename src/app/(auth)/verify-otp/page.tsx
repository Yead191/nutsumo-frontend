import { Suspense } from "react";
import { VerifyOtpForm } from "@/components/web-pages/verify-otp-form";

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="text-sm text-slate-400">Loading verification…</div>}>
      <VerifyOtpForm />
    </Suspense>
  );
}
