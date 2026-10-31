export default function BookingDetailsLoading() {
  return (
    <div className="space-y-6 max-w-4xl animate-pulse">
      <div className="space-y-3 border-b border-line/70 pb-5">
        <div className="h-4 w-36 rounded bg-slate-200" />
        <div className="flex justify-between items-center">
          <div className="h-8 w-60 rounded-xl bg-slate-200" />
          <div className="h-6 w-24 rounded-full bg-slate-200" />
        </div>
      </div>

      <div className="rounded-3xl border border-line bg-white p-6 space-y-4">
        <div className="h-5 w-48 rounded bg-slate-200" />
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-slate-200 shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-5 w-40 rounded bg-slate-200" />
            <div className="h-4 w-32 rounded bg-slate-100" />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-line bg-white p-6 space-y-4">
        <div className="h-5 w-40 rounded bg-slate-200" />
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-slate-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
