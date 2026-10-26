import { Suspense } from "react";
import { SignupForm } from "@/components/web-pages/signup-form";

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted">Loading signup…</div>}>
      <SignupForm />
    </Suspense>
  );
}
