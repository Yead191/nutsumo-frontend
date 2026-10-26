import { Badge } from "@/components/ui/badge";
import { statusLabels } from "@/Mockdata";
import type { JobStatus } from "@/types";

const tones: Record<JobStatus, "blue" | "green" | "amber" | "slate" | "orange"> = {
  draft: "slate",
  active: "green",
  getting_quotes: "blue",
  quotes_in: "blue",
  hired: "orange",
  scheduled: "amber",
  en_route: "orange",
  in_progress: "amber",
  awaiting_confirm: "amber",
  completed: "green",
  cancelled: "slate",
  disputed: "orange",
};

export function StatusBadge({ status }: { status: JobStatus }) {
  return <Badge tone={tones[status]}>{statusLabels[status]}</Badge>;
}
