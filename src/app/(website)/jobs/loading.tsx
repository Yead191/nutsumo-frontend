export default function JobsLoading() {
  return (
    <div className="container-site py-8 sm:py-12 space-y-8 animate-pulse">
      {/* HERO SKELETON */}
      <div className="h-64 rounded-3xl bg-slate-200" />

      {/* SEARCH BAR SKELETON */}
      <div className="h-16 rounded-3xl bg-slate-100" />

      {/* PILLS SKELETON */}
      <div className="flex gap-2">
        <div className="h-8 w-24 rounded-full bg-slate-200" />
        <div className="h-8 w-28 rounded-full bg-slate-100" />
        <div className="h-8 w-32 rounded-full bg-slate-100" />
        <div className="h-8 w-20 rounded-full bg-slate-100" />
      </div>

      {/* CARDS GRID SKELETON */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-60 rounded-3xl border border-line bg-white p-6 space-y-4"
          >
            <div className="flex justify-between">
              <div className="h-5 w-24 rounded-full bg-slate-100" />
              <div className="h-5 w-20 rounded-full bg-slate-100" />
            </div>
            <div className="h-6 w-3/4 rounded-md bg-slate-200" />
            <div className="h-12 w-full rounded-md bg-slate-100" />
            <div className="flex justify-between pt-4 border-t border-line">
              <div className="h-6 w-24 rounded-md bg-slate-200" />
              <div className="h-8 w-24 rounded-full bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
