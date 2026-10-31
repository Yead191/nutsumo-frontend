export default function ProJobsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center pb-4 border-b border-line/70">
        <div className="h-8 w-48 rounded-md bg-slate-200" />
        <div className="h-9 w-32 rounded-full bg-slate-200" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-2xl border border-line bg-white p-4" />
        ))}
      </div>

      <div className="flex gap-4 border-b border-line pb-2">
        <div className="h-8 w-32 rounded-md bg-slate-200" />
        <div className="h-8 w-32 rounded-md bg-slate-100" />
        <div className="h-8 w-32 rounded-md bg-slate-100" />
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-36 rounded-3xl border border-line bg-white p-6" />
        ))}
      </div>
    </div>
  );
}
