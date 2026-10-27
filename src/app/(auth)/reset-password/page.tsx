import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/web-pages/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-sm text-slate-400">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
