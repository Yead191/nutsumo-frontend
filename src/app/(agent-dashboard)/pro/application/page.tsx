"use client";

import { Suspense, useState, useTransition, type ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Clock, FileText, FileUp, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AppliedBanner } from "@/components/web-pages/applied-banner";
import { defaultProProfile } from "@/Mockdata";

const statusConfig = {
  draft: { label: "Draft", icon: FileText, className: "text-muted" },
  submitted: { label: "In review", icon: Clock, className: "text-primary" },
  needs_info: { label: "Needs info", icon: AlertTriangle, className: "text-amber-800" },
  rejected: { label: "Rejected", icon: XCircle, className: "text-red-700" },
  cleared: { label: "Approved", icon: CheckCircle2, className: "text-emerald-700" },
} as const;

function DocRow({
  title,
  meta,
  action,
}: {
  title: string;
  meta?: string;
  action?: ReactNode;
}) {
  return (
    <li className="grid min-h-[76px] grid-cols-[minmax(0,1fr)_auto] items-center gap-6 px-6 py-5">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-title">{title}</p>
        {meta ? <p className="mt-1 truncate text-sm text-muted">{meta}</p> : null}
      </div>
      <div className="shrink-0">{action}</div>
    </li>
  );
}

export default function ProApplicationPage() {
  const [status, setStatus] = useState<"draft" | "submitted" | "needs_info" | "rejected" | "cleared">("cleared");
  const reason = "";
  const draft: Record<string, string> = {
    licenseFile: "TX-M-42981-Master-Plumber-Certificate.pdf",
    insuranceFile: "Next-General-Liability-COI-2026.pdf",
    backgroundCheck: "clear",
  };
  const proProfile = defaultProProfile;

  const [licenseFile, setLicenseFile] = useState(
    draft.licenseFile || "TX-M-42981-Master-Plumber-Certificate.pdf",
  );
  const [insuranceFile, setInsuranceFile] = useState(
    draft.insuranceFile || "Next-General-Liability-COI-2026.pdf",
  );
  const [, startTransition] = useTransition();

  const current = statusConfig[status] || statusConfig.draft;
  const canSubmit = status === "draft" || status === "needs_info" || status === "rejected";
  const backgroundClear =
    draft.backgroundCheck === "clear" || status === "cleared" || status === "submitted";

  function handleSubmit() {
    setStatus("submitted");
  }

  function handleFileUpload(
    type: "license" | "insurance",
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    if (!file) return;
    startTransition(() => {
      if (type === "license") setLicenseFile(file.name);
      else setInsuranceFile(file.name);
    });
  }

  function replaceControl(type: "license" | "insurance") {
    if (!canSubmit) return null;
    return (
      <label className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-primary">
        <FileUp className="h-4 w-4" />
        Replace
        <input
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(event) => handleFileUpload(type, event)}
        />
      </label>
    );
  }

  return (
    <div className="w-full max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/70 pb-4">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-title">
            Application
          </h1>
          <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${current.className}`}>
            <current.icon className="h-4 w-4" />
            {current.label}
          </span>
        </div>
        {status === "cleared" ? (
          <Button href="/pro/jobs" size="sm">
            Open jobs
          </Button>
        ) : canSubmit ? (
          <Button type="button" size="sm" onClick={handleSubmit}>
            {status === "draft" ? "Submit" : "Resubmit"}
          </Button>
        ) : null}
      </div>

      <Suspense fallback={null}>
        <AppliedBanner />
      </Suspense>

      {reason && canSubmit ? <p className="text-sm text-amber-800">{reason}</p> : null}

      <Card className="overflow-hidden rounded-xl p-0 hover:shadow-xs">
        <ul className="divide-y divide-line/70">
          <DocRow
            title="Background check"
            meta={backgroundClear ? "Clear" : "Not started"}
          />
          <DocRow
            title="Trade license"
            meta={licenseFile || proProfile?.licenseNumber || "Not uploaded"}
            action={replaceControl("license")}
          />
          <DocRow
            title="Liability insurance"
            meta={insuranceFile || proProfile?.insuranceCarrier || "Not uploaded"}
            action={replaceControl("insurance")}
          />
        </ul>
      </Card>
    </div>
  );
}
