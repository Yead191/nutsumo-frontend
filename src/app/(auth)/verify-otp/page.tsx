import { Suspense } from "react";
import { VerifyOtpForm } from "@/components/web-pages/verify-otp-form";
import { AuthSkeleton } from "@/components/auth/auth-skeleton";

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <VerifyOtpForm />
    </Suspense>
  );
}
