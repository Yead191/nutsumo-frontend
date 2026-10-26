import { cn } from "@/lib/cn";
import { trackerSteps } from "@/lib/pro-extras";
import type { JobStatus } from "@/types";

export function StatusTracker({ status }: { status: JobStatus }) {
  if (status === "cancelled") {
    return <p className="text-xs font-semibold text-muted">Request closed</p>;
  }
  if (status === "disputed") {
    return <p className="text-xs font-semibold text-error">Dispute open</p>;
  }

  const currentIndex = trackerSteps.reduce((found, step, index) => {
    const active = (step.statuses as readonly string[]).includes(status);
    const current =
      active &&
      (index === trackerSteps.length - 1 ||
        !(trackerSteps[index + 1].statuses as readonly string[]).includes(status));
    return current ? index : found;
  }, 0);

  return (
    <div className="flex items-center gap-2.5">
      <ol className="flex items-center" aria-label="Request progress">
        {trackerSteps.map((step, index) => {
          const done = index < currentIndex;
          const current = index === currentIndex;
          return (
            <li key={step.key} className="flex items-center">
              {index > 0 ? (
                <span className={cn("h-px w-3 sm:w-4", done || current ? "bg-primary/50" : "bg-line")} />
              ) : null}
              <span
                className={cn(
                  "block h-1.5 w-1.5 rounded-full",
                  current && "h-2 w-2 bg-primary ring-2 ring-primary/20",
                  done && !current && "bg-title",
                  !done && !current && "bg-line",
                )}
                aria-current={current ? "step" : undefined}
                title={step.label}
              />
            </li>
          );
        })}
      </ol>
      <span className="text-xs font-semibold text-title">{trackerSteps[currentIndex]?.label}</span>
    </div>
  );
}
