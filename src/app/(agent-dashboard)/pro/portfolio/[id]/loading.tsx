export default function PortfolioItemLoading() {
  return (
    <div className="space-y-8 animate-pulse pb-16">
      {/* Back button & Action buttons skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-4 w-32 rounded bg-slate-200" />
        <div className="flex gap-2">
          <div className="h-9 w-24 rounded-xl bg-slate-200" />
          <div className="h-9 w-9 rounded-xl bg-slate-100" />
        </div>
      </div>

      {/* Header skeleton */}
      <div className="space-y-3 border-b border-line pb-6">
        <div className="flex items-center gap-2">
          <div className="h-6 w-24 rounded-full bg-slate-200" />
          <div className="h-6 w-24 rounded-full bg-slate-100" />
        </div>
        <div className="h-10 w-3/4 rounded-lg bg-slate-200" />
        <div className="h-4 w-40 rounded bg-slate-100" />
      </div>

      {/* Hero Visual Showcase skeleton */}
      <div className="aspect-[16/9] w-full rounded-3xl bg-slate-200" />

      {/* Details 2-column skeleton */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl border border-line bg-white p-6 space-y-4">
          <div className="h-6 w-48 rounded bg-slate-200" />
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-4 w-5/6 rounded bg-slate-100" />
          <div className="h-4 w-4/6 rounded bg-slate-100" />
        </div>
        <div className="rounded-3xl border border-line bg-white p-6 space-y-4">
          <div className="h-5 w-32 rounded bg-slate-200" />
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-slate-200 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-28 rounded bg-slate-200" />
              <div className="h-3 w-20 rounded bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
