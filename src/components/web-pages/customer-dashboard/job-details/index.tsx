"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  CheckCircle2,
  Inbox,
  ArrowRight,
} from "lucide-react";
import { subscribeToNotificationSocket } from "@/components/layout/Notification/notificationSocketManager";

import { JobHeroHeader } from "./components/JobHeroHeader";
import { JobSpecsCard } from "./components/JobSpecsCard";
import { ProposalCard } from "./components/ProposalCard";
import { AcceptProposalModal } from "./components/AcceptProposalModal";
import { RejectProposalModal } from "./components/RejectProposalModal";
import { CancelJobModal } from "./components/CancelJobModal";
import type { JobDetailsManagerProps } from "./types";
import type { IQuotationItem } from "@/helpers/next-fetch/apiActions/quotationActions";
import { refreshCustomerJobView } from "@/helpers/next-fetch/apiActions/jobActions";

export function JobDetailsManager({
  job,
  quotations,
}: JobDetailsManagerProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [proposalToAccept, setProposalToAccept] = useState<IQuotationItem | null>(null);
  const [proposalToReject, setProposalToReject] = useState<IQuotationItem | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  useEffect(() => {
    let userId: string | undefined;
    try {
      const rawUser = localStorage.getItem("user");
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        userId = parsed._id || parsed.id;
      }
    } catch {
      userId = undefined;
    }

    if (!userId) return;

    const unsubscribe = subscribeToNotificationSocket({
      userId,
      onNotify: () => {
        startTransition(async () => {
          await refreshCustomerJobView(job._id);
          router.refresh();
        });
      },
    });

    return () => {
      unsubscribe();
    };
  }, [job._id, router, startTransition]);

  const refreshFromServer = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const activeQuotations = quotations.filter((q) => q.status !== "WITHDRAWN");
  const acceptedQuotation = quotations.find((q) => q.status === "ACCEPTED");

  return (
    <div className="space-y-8 max-w-5xl">
      <JobHeroHeader
        job={job}
        onCancelJob={() => setIsCancelModalOpen(true)}
      />

      <JobSpecsCard job={job} />

      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line/70 pb-3">
          <div className="flex items-center gap-2.5">
            <h2 className="font-display text-xl font-bold text-title flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#FE375D]" />
              <span>Artisan Proposals</span>
            </h2>
            <span className="rounded-full bg-[#FE375D]/10 px-2.5 py-0.5 text-xs font-bold text-[#FE375D]">
              {activeQuotations.length} {activeQuotations.length === 1 ? "Offer" : "Offers"}
            </span>
          </div>

          {job.status === "OPEN" && activeQuotations.length > 0 && (
            <p className="text-xs text-muted">
              Select the best proposal to book and hire your artisan.
            </p>
          )}
        </div>

        {acceptedQuotation && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-sm font-bold text-emerald-950">
                  Proposal Accepted · Booking Confirmed!
                </p>
                <p className="text-xs text-emerald-800">
                  You have hired <strong>{acceptedQuotation.artisan?.name}</strong> for ${acceptedQuotation.proposedAmount}.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/account/bookings")}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 text-xs font-semibold shadow-xs self-start sm:self-auto cursor-pointer"
            >
              <span>View Bookings</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {activeQuotations.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-white p-12 text-center">
            <div className="relative mb-3.5 grid h-14 w-14 place-items-center rounded-2xl bg-smoke text-[#FE375D]">
              <Inbox className="h-7 w-7 stroke-[1.6]" />
            </div>
            <h3 className="font-display text-base font-bold text-title">
              Waiting for Artisan Proposals
            </h3>
            <p className="mx-auto mt-1 max-w-md text-xs sm:text-sm text-muted leading-relaxed">
              Your service request is active in the marketplace. We have automatically notified matching verified artisans in your area. Proposals typically arrive within 10 to 30 minutes.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeQuotations.map((quotation) => (
              <ProposalCard
                key={quotation._id}
                proposal={quotation}
                jobStatus={job.status}
                onAccept={(q) => setProposalToAccept(q)}
                onReject={(q) => setProposalToReject(q)}
              />
            ))}
          </div>
        )}
      </div>

      {proposalToAccept && (
        <AcceptProposalModal
          proposal={proposalToAccept}
          jobId={job._id}
          isOpen={Boolean(proposalToAccept)}
          onClose={() => setProposalToAccept(null)}
          onSuccess={(bookingId) => {
            setProposalToAccept(null);
            if (bookingId) {
              router.push(`/account/bookings/${bookingId}`);
            } else {
              router.push("/account/bookings");
            }
          }}
        />
      )}

      {proposalToReject && (
        <RejectProposalModal
          proposal={proposalToReject}
          jobId={job._id}
          isOpen={Boolean(proposalToReject)}
          onClose={() => setProposalToReject(null)}
          onSuccess={() => {
            setProposalToReject(null);
            refreshFromServer();
          }}
        />
      )}

      {isCancelModalOpen && (
        <CancelJobModal
          jobId={job._id}
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          onSuccess={() => {
            setIsCancelModalOpen(false);
            refreshFromServer();
          }}
        />
      )}
    </div>
  );
}
