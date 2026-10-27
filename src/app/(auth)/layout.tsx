import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/ui/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full relative bg-white flex flex-col lg:flex-row">
      {/* Left Column: Fixed 1/2 Screen on Large Displays */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-1/2 z-10 overflow-hidden bg-slate-900 select-none">
        <Image
          src="/images/auth/auth-img.png"
          alt="Nutsumo Artisans & Home Services"
          fill
          priority
          sizes="50vw"
          className="object-cover object-center"
        />

        {/* Ambient Subtle Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 25%, transparent 65%, rgba(0,0,0,0.65) 100%)",
          }}
        />

        {/* Top-Left Logo: Clearly Visible in High-Contrast White Pill Badge */}
        <div className="absolute top-8 left-8 xl:top-10 xl:left-12 z-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 rounded-2xl 
            transition-all duration-200"
            aria-label="Back to Nutsumo home"
          >
            <Image
              src="/logo.png"
              alt="Nutsumo"
              width={180}
              height={60}
              priority
              draggable={false}
              className={"w-40 h-fit object-contain"}
            />
          </Link>
        </div>

        {/* Bottom Feature Card */}
        <div className="absolute bottom-10 left-8 xl:left-12 right-8 z-20 max-w-lg">
          <div className="rounded-3xl bg-slate-950/70 backdrop-blur-xl p-7 border border-white/20 text-white shadow-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#FE375D]/25 text-[#FE375D] border border-[#FE375D]/30 mb-3">
              Verified Artisan Network
            </span>
            <h3 className="text-2xl font-bold font-display text-white mb-2 leading-tight">
              Trust is earned through good work.
            </h3>
            <p className="text-sm text-white/80 leading-relaxed font-sans">
              Connect with verified local specialists, compare itemized quotes,
              and manage your bookings with complete confidence.
            </p>
          </div>
        </div>
      </aside>

      {/* Right Column: Scrollable Content with Full Centering */}
      <main className="w-full lg:ml-[50%] lg:w-1/2 min-h-screen flex flex-col justify-center items-center px-6 py-10 sm:px-12 md:px-16 lg:px-12 xl:px-20 bg-white">
        {/* Mobile Logo View (Hidden on LG where fixed left half displays it) */}
        <div className="w-full max-w-md lg:hidden mb-6 flex items-center justify-between">
          <Link href="/" aria-label="Nutsumo Home">
            <Logo size="md" />
          </Link>
        </div>

        {/* Dynamic Form Content */}
        <div className="w-full max-w-md my-auto">{children}</div>
      </main>
    </div>
  );
}
