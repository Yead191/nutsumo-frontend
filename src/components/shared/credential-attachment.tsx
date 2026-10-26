"use client";

import { useRef } from "react";
import { CheckCircle2, Clock, FileText, FileUp, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import type { CredentialFile, DocReviewStatus } from "@/lib/credential-file";

function StatusMark({ status }: { status: DocReviewStatus }) {
  if (status === "verified") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Verified
      </span>
    );
  }
  if (status === "review") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
        <Clock className="h-3.5 w-3.5" />
        In review
      </span>
    );
  }
  return <span className="text-xs font-semibold text-amber-800">Upload needed</span>;
}

export function CredentialAttachment({
  file,
  label,
  error,
  onUpload,
}: {
  file: CredentialFile | null;
  label: string;
  error?: string | null;
  onUpload: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const status = file?.status ?? "needed";

  function pick(fileList: FileList | null) {
    const next = fileList?.[0];
    if (next) onUpload(next);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-muted">{label}</p>
        <StatusMark status={status} />
      </div>

      {file ? (
        <div className="flex items-center gap-3 rounded-xl border border-line bg-smoke/50 px-3 py-2.5">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-line bg-white text-primary">
            {file.kind === "image" ? <ImageIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-title">{file.name}</p>
            <p className="text-xs text-muted">
              {file.kind === "pdf" ? "PDF" : "Image"} · {file.sizeLabel} · {file.uploadedAt}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {file.previewUrl ? (
              <a
                href={file.previewUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-primary hover:underline"
              >
                View
              </a>
            ) : null}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-xs font-semibold text-title hover:underline"
            >
              Replace
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-smoke/40 px-3 py-4 text-sm font-medium text-title hover:border-primary/40 hover:bg-smoke",
          )}
        >
          <FileUp className="h-4 w-4 text-primary" />
          Upload PDF or photo
        </button>
      )}

      {error ? <p className="text-xs text-error">{error}</p> : null}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => pick(event.target.files)}
      />
    </div>
  );
}
