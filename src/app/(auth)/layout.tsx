import { Logo } from "@/components/ui/logo";
import { photos } from "@/lib/media";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen bg-surface lg:grid-cols-[42%_1fr] xl:grid-cols-[45%_1fr] 2xl:grid-cols-[47%_1fr]">
      <aside className="auth-panel relative hidden overflow-hidden bg-ink text-white lg:flex lg:flex-col lg:justify-between lg:p-8 xl:p-12 2xl:p-14">
        <div
          className="absolute inset-0 bg-cover bg-[center_30%]"
          style={{ backgroundImage: `url(${photos.auth})` }}
        />
        <div className="auth-wash absolute inset-0" />
        <div className="relative">
          <Logo variant="dark" size="lg" />
        </div>
        <div className="relative max-w-[420px] xl:max-w-[460px]">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.14em] !text-white/80 backdrop-blur-md">
            Direct & Transparent
          </span>
          <h2 className="mt-4 font-display text-[22px] xl:text-[25px] font-medium leading-[1.25] tracking-tight !text-white">
            Browse free. Account only when you need to act.
          </h2>
          <p className="mt-3 font-sans text-[13px] xl:text-sm leading-relaxed !text-white/80">
            Sign in to post a request, compare quotes, or manage jobs. New here? You can create a free account in 30 seconds.
          </p>
        </div>
      </aside>

      <div className="flex flex-col bg-surface px-5 py-10 sm:px-8 lg:px-8 xl:px-14 2xl:px-20">
        <div className="mb-8 lg:hidden">
          <Logo size="md" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[580px] rounded-[28px] border border-line/70 bg-white px-6 py-8 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:px-9 sm:py-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
