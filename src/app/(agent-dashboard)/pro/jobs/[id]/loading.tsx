export default function ProJobDetailLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-6 w-36 rounded-md bg-slate-200" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-44 rounded-3xl border border-line bg-white p-6 space-y-4">
            <div className="h-5 w-24 rounded-full bg-slate-100" />
            <div className="h-8 w-3/4 rounded-md bg-slate-200" />
            <div className="h-4 w-1/2 rounded-md bg-slate-100" />
          </div>

          <div className="h-64 rounded-3xl border border-line bg-white p-6 space-y-3">
            <div className="h-6 w-48 rounded-md bg-slate-200" />
            <div className="h-4 w-full rounded-md bg-slate-100" />
            <div className="h-4 w-full rounded-md bg-slate-100" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="h-72 rounded-3xl border border-line bg-white p-6 space-y-4">
            <div className="h-4 w-24 rounded-md bg-slate-100" />
            <div className="h-10 w-36 rounded-md bg-slate-200" />
            <div className="h-10 w-full rounded-2xl bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
