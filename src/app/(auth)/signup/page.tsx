import { Suspense } from "react";
import { SignupForm } from "@/components/web-pages/signup-form";
import { AuthSkeleton } from "@/components/auth/auth-skeleton";

export default function SignupPage() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <SignupForm />
    </Suspense>
  );
}
