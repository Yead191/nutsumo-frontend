export default function AccountLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line/70 pb-5">
        <div className="space-y-2">
          <div className="h-8 w-56 rounded-xl bg-slate-200" />
          <div className="h-4 w-72 rounded-lg bg-slate-100" />
        </div>
        <div className="h-10 w-36 rounded-full bg-slate-200" />
      </div>

      <div className="flex gap-2">
        <div className="h-9 w-28 rounded-xl bg-slate-200" />
        <div className="h-9 w-32 rounded-xl bg-slate-100" />
        <div className="h-9 w-24 rounded-xl bg-slate-100" />
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-3xl border border-line/80 bg-white p-6 space-y-4"
          >
            <div className="flex justify-between">
              <div className="h-5 w-40 rounded-full bg-slate-200" />
              <div className="h-5 w-24 rounded-full bg-slate-200" />
            </div>
            <div className="h-6 w-3/4 rounded-lg bg-slate-200" />
            <div className="h-4 w-5/6 rounded-lg bg-slate-100" />
            <div className="h-4 w-1/2 rounded-lg bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
