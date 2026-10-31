export default function PostJobLoading() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-pulse">
      <div className="border-b border-line/70 pb-4 space-y-2">
        <div className="h-4 w-28 rounded bg-slate-200" />
        <div className="h-8 w-64 rounded-xl bg-slate-200" />
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 rounded-2xl bg-slate-100" />
        ))}
      </div>

      <div className="rounded-3xl border border-line bg-white p-8 space-y-6">
        <div className="h-6 w-48 rounded-lg bg-slate-200" />
        <div className="h-10 w-full rounded-xl bg-slate-100" />
        <div className="h-10 w-full rounded-xl bg-slate-100" />
        <div className="h-32 w-full rounded-xl bg-slate-100" />
      </div>
    </div>
  );
}
