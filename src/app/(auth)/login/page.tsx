import { Suspense } from "react";
import { LoginForm } from "@/components/web-pages/login-form";
import { AuthSkeleton } from "@/components/auth/auth-skeleton";

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}
