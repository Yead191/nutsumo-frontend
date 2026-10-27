import { Suspense } from "react";
import { ForgotPasswordForm } from "@/components/web-pages/forgot-password-form";
import { AuthSkeleton } from "@/components/auth/auth-skeleton";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
