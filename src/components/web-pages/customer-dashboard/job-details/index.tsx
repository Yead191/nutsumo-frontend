"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Inbox,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { io, type Socket } from "socket.io-client";

import { JobHeroHeader } from "./components/JobHeroHeader";
import { JobSpecsCard } from "./components/JobSpecsCard";
import { ProposalCard } from "./components/ProposalCard";
import { AcceptProposalModal } from "./components/AcceptProposalModal";
import { RejectProposalModal } from "./components/RejectProposalModal";
import { CancelJobModal } from "./components/CancelJobModal";
import type { JobDetailsManagerProps } from "./types";
import type { IQuotationItem } from "@/helpers/next-fetch/apiActions/quotationActions";
import { getJobQuotationsAction } from "@/helpers/next-fetch/apiActions/quotationActions";
import { getJobDetailsAction } from "@/helpers/next-fetch/apiActions/jobActions";

export function JobDetailsManager({
  job: initialJob,
  quotations: initialQuotations,
}: JobDetailsManagerProps) {
  const router = useRouter();

  const [job, setJob] = useState(initialJob);
  const [quotations, setQuotations] = useState<IQuotationItem[]>(initialQuotations);

  // Modals state
  const [proposalToAccept, setProposalToAccept] = useState<IQuotationItem | null>(null);
  const [proposalToReject, setProposalToReject] = useState<IQuotationItem | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // Refresh data helper
  const refreshData = async () => {
    try {
      const [jobRes, quotesRes] = await Promise.all([
        getJobDetailsAction(job._id),
        getJobQuotationsAction(job._id),
      ]);
      if (jobRes.success && jobRes.data) {
        setJob(jobRes.data);
      }
      if (quotesRes.success && Array.isArray(quotesRes.data)) {
        setQuotations(quotesRes.data);
      }
    } catch {}
  };

  // Real-time socket updates for new quotations
  useEffect(() => {
    let userId: string | undefined;
    try {
      const rawUser = localStorage.getItem("user");
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        userId = parsed._id || parsed.id;
      }
    } catch {}

    if (!userId) return;

    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://10.10.26.173:5005";

    const token = Cookies.get("accessToken");
    const socket: Socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      auth: token ? { token } : undefined,
    });

    const onNotify = (notif?: any) => {
      void refreshData();
      if (notif?.title) {
        toast.info(notif.title, {
          description: notif.message,
        });
      }
    };

    socket.on(`getNotification::${userId}`, onNotify);
    socket.on(`get-notification::${userId}`, onNotify);

    return () => {
      socket.off(`getNotification::${userId}`, onNotify);
      socket.off(`get-notification::${userId}`, onNotify);
      socket.disconnect();
    };
  }, [job._id]);

  const activeQuotations = quotations.filter((q) => q.status !== "WITHDRAWN");
  const acceptedQuotation = quotations.find((q) => q.status === "ACCEPTED");

  return (
    <div className="space-y-8 max-w-5xl">
      {/* 1. HERO HEADER */}
      <JobHeroHeader
        job={job}
        onCancelJob={() => setIsCancelModalOpen(true)}
      />

      {/* 2. JOB DETAILS & PHOTOS */}
      <JobSpecsCard job={job} />

      {/* 3. PROPOSALS SECTION */}
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

        {/* If a proposal has been accepted, show success highlight */}
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

        {/* PROPOSALS LIST / EMPTY STATE */}
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

      {/* MODAL 1: ACCEPT PROPOSAL */}
      {proposalToAccept && (
        <AcceptProposalModal
          proposal={proposalToAccept}
          jobId={job._id}
          isOpen={Boolean(proposalToAccept)}
          onClose={() => setProposalToAccept(null)}
          onSuccess={(bookingId) => {
            setProposalToAccept(null);
            void refreshData();
            if (bookingId) {
              router.push(`/account/bookings/${bookingId}`);
            } else {
              router.push("/account/bookings");
            }
          }}
        />
      )}

      {/* MODAL 2: REJECT PROPOSAL */}
      {proposalToReject && (
        <RejectProposalModal
          proposal={proposalToReject}
          jobId={job._id}
          isOpen={Boolean(proposalToReject)}
          onClose={() => setProposalToReject(null)}
          onSuccess={() => {
            setProposalToReject(null);
            void refreshData();
          }}
        />
      )}

      {/* MODAL 3: CANCEL JOB */}
      {isCancelModalOpen && (
        <CancelJobModal
          jobId={job._id}
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          onSuccess={() => {
            setIsCancelModalOpen(false);
            void refreshData();
          }}
        />
      )}
    </div>
  );
}
