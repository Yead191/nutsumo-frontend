import { Suspense } from "react";
import { ForgotPasswordForm } from "@/components/web-pages/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="text-sm text-slate-400">Loading...</div>}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
