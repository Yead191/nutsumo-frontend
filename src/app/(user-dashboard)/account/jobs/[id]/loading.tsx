export default function JobDetailsLoading() {
  return (
    <div className="space-y-8 max-w-5xl animate-pulse">
      <div className="space-y-3 border-b border-line/70 pb-5">
        <div className="h-4 w-36 rounded-md bg-slate-200" />
        <div className="flex justify-between items-center">
          <div className="h-8 w-2/3 rounded-xl bg-slate-200" />
          <div className="h-7 w-24 rounded-full bg-slate-200" />
        </div>
        <div className="flex gap-4">
          <div className="h-4 w-32 rounded bg-slate-100" />
          <div className="h-4 w-40 rounded bg-slate-100" />
          <div className="h-4 w-28 rounded bg-slate-100" />
        </div>
      </div>

      <div className="rounded-3xl border border-line bg-white p-6 space-y-5">
        <div className="h-6 w-48 rounded-lg bg-slate-200" />
        <div className="h-20 w-full rounded-2xl bg-slate-100" />
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-slate-100" />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-7 w-52 rounded-lg bg-slate-200" />
        {[1, 2].map((i) => (
          <div key={i} className="rounded-3xl border border-line bg-white p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <div className="h-12 w-12 rounded-2xl bg-slate-200" />
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded bg-slate-200" />
                  <div className="h-3 w-24 rounded bg-slate-100" />
                </div>
              </div>
              <div className="h-8 w-24 rounded-xl bg-slate-200" />
            </div>
            <div className="h-14 rounded-2xl bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
