import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/web-pages/reset-password-form";
import { AuthSkeleton } from "@/components/auth/auth-skeleton";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
