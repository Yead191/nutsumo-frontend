import { Suspense } from "react";
import { LoginForm } from "@/components/web-pages/login-form";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted">Loading sign in…</div>}>
      <LoginForm />
    </Suspense>
  );
}
