import * as React from "react";

export function AuthSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto animate-pulse">
      {/* Brand title skeleton */}
      <div className="h-4 w-20 bg-slate-200 rounded-md mb-3" />

      {/* Eyebrow skeleton */}
      <div className="h-3.5 w-36 bg-[#FE375D]/20 rounded-md mb-2" />

      {/* Title skeleton */}
      <div className="h-9 w-60 bg-slate-200 rounded-xl mb-2" />

      {/* Subtitle skeleton */}
      <div className="h-4 w-72 bg-slate-100 rounded-md mb-7" />

      {/* Input skeletons */}
      <div className="space-y-4">
        <div>
          <div className="h-3 w-32 bg-slate-200 rounded mb-2" />
          <div className="h-12 w-full bg-slate-100 rounded-xl border border-slate-200/60" />
        </div>
        <div>
          <div className="h-3 w-24 bg-slate-200 rounded mb-2" />
          <div className="h-12 w-full bg-slate-100 rounded-xl border border-slate-200/60" />
        </div>
        <div className="h-12 w-full bg-[#FE375D]/40 rounded-xl mt-3" />
      </div>

      {/* Divider skeleton */}
      <div className="h-4 w-full bg-slate-100 rounded my-5" />

      {/* Google button skeleton */}
      <div className="h-12 w-full bg-slate-100 rounded-xl border border-slate-200/60" />
    </div>
  );
}
