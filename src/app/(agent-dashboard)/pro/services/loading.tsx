import { Card } from "@/components/ui/card";

export default function ServicesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6">
        <div className="space-y-2">
          <div className="h-7 w-64 rounded-lg bg-slate-200" />
          <div className="h-4 w-96 rounded bg-slate-100" />
        </div>
        <div className="h-10 w-36 rounded-xl bg-slate-200" />
      </div>

      {/* Services List Skeletons */}
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <Card
            key={n}
            className="rounded-2xl border border-line bg-white p-6 shadow-2xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-28 rounded-md bg-slate-200" />
                  <div className="h-4 w-20 rounded-md bg-slate-100" />
                </div>
                <div className="h-6 w-56 rounded-md bg-slate-200" />
                <div className="h-4 w-3/4 rounded bg-slate-100" />
              </div>

              <div className="flex items-center gap-4">
                <div className="space-y-1 text-right">
                  <div className="h-3 w-16 rounded bg-slate-100 ml-auto" />
                  <div className="h-7 w-24 rounded bg-slate-200" />
                </div>
                <div className="h-9 w-20 rounded-xl bg-slate-100" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
