export default function PortfolioLoading() {
  return (
    <div className="space-y-6 animate-pulse pb-16">
      {/* Simple Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6">
        <div className="space-y-1.5">
          <div className="h-7 w-56 rounded-lg bg-slate-200" />
          <div className="h-4 w-80 sm:w-96 rounded bg-slate-100" />
        </div>
        <div className="h-10 w-32 rounded-xl bg-slate-200 shrink-0" />
      </div>

      {/* Grid 2 Cards Skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="rounded-3xl border border-line bg-white overflow-hidden shadow-2xs space-y-4 pb-4"
          >
            {/* Multi-image preview box */}
            <div className="h-60 sm:h-64 w-full bg-slate-200" />

            {/* Content */}
            <div className="p-5 sm:p-6 space-y-3 pt-0">
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 rounded bg-slate-200" />
                <div className="h-4 w-16 rounded bg-slate-100" />
              </div>
              <div className="h-6 w-3/4 rounded bg-slate-200" />
              <div className="h-4 w-full rounded bg-slate-100" />
              <div className="h-4 w-2/3 rounded bg-slate-100" />

              <div className="pt-3 border-t border-line flex items-center justify-between">
                <div className="h-4 w-28 rounded bg-slate-200" />
                <div className="flex gap-2">
                  <div className="h-7 w-7 rounded-lg bg-slate-100" />
                  <div className="h-7 w-7 rounded-lg bg-slate-100" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
