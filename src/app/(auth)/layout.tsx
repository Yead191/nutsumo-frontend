import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/ui/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F6F7F9] flex items-center justify-center p-3 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl rounded-[28px] sm:rounded-[36px] bg-white border border-slate-200/80 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.07)] overflow-hidden grid lg:grid-cols-2">
        {/* Left Column: Visual Image with Logo at top-left */}
        <div className="relative hidden lg:block min-h-[640px] w-full bg-slate-100 overflow-hidden">
          <Image
            src="/images/auth/auth-img.png"
            alt="Nutsumo Verified Artisans"
            fill
            priority
            className="object-cover object-center select-none"
          />

          {/* Top-left Logo replacing back to homepage */}
          <div className="absolute top-6 left-6 z-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-2xl bg-white/95 backdrop-blur-md px-4 py-2.5 shadow-md border border-white/80 hover:bg-white hover:scale-[1.02] transition-all"
            >
              <Logo size="sm" />
            </Link>
          </div>
        </div>

        {/* Right Column: Form View */}
        <div className="flex flex-col justify-center px-6 py-8 sm:px-10 lg:px-12 xl:px-14 bg-white">
          <div className="mb-6 lg:hidden flex items-center justify-between">
            <Link href="/">
              <Logo size="md" />
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
