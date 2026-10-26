"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Filter,
  Layers,
  MapPin,
  MessageSquare,
  Receipt,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Wrench,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { JobCard } from "@/components/shared/job-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { categories, getCategory, getPro, urgencyLabels } from "@/Mockdata";
import { isProEligibleForJob } from "@/lib/matching";
import {
  jobCardSummary,
  paymentMethodLabels,
  selectBooking,
  selectCompletion,
  selectHiredQuoteId,
  selectProJobsGrouped,
  selectQuotesForJob,
} from "@/lib/marketplace";
import { useRoleAccess } from "@/hooks/use-role-access";
import { setJobStatus, setLeadAction, addNotification } from "@/redux/slices/featuresSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { cn } from "@/lib/cn";
import type { Job, JobStatus } from "@/types";

type MainTab = "direct" | "leads" | "active" | "completed";
type SortKey = "newest" | "budget-high" | "urgent";

export default function ProJobsPage() {
  const dispatch = useAppDispatch();
  const { access } = useRoleAccess();
  const myProId = "pro-1";
  const myPro = getPro(myProId);

  const [activeTab, setActiveTab] = useState<MainTab>("direct");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [activeSubFilter, setActiveSubFilter] = useState<"all" | "scheduled" | "in_progress" | "awaiting_confirm">("all");

  const state = useAppSelector((state) => state);
  const grouped = useMemo(() => selectProJobsGrouped(state, myProId), [state, myProId]);
  const bookings = state.marketplace.bookings;
  const quotes = state.marketplace.extraQuotes;

  // Tabs count configuration
  const tabCounts = {
    direct: grouped.totalDirect,
    leads: grouped.totalLeads,
    active: grouped.totalActive,
    completed: grouped.totalCompleted,
  };

  // Determine current active list based on selected tab
  const currentList = useMemo(() => {
    let list: Job[] = [];
    if (activeTab === "direct") list = grouped.directInquiries;
    else if (activeTab === "leads") list = grouped.marketplaceLeads;
    else if (activeTab === "active") {
      list = grouped.activeJobs;
      if (activeSubFilter !== "all") {
        list = list.filter((j) => {
          if (activeSubFilter === "scheduled") return j.status === "scheduled" || j.status === "hired";
          if (activeSubFilter === "in_progress") return j.status === "in_progress" || j.status === "en_route";
          if (activeSubFilter === "awaiting_confirm") return j.status === "awaiting_confirm";
          return true;
        });
      }
    } else if (activeTab === "completed") {
      list = grouped.completedJobs;
    }

    return list
      .filter((job) => {
        if (selectedCategory !== "all" && job.categorySlug !== selectedCategory) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const categoryName = getCategory(job.categorySlug)?.name.toLowerCase() ?? "";
          const haystack = `${job.title} ${job.description} ${job.city} ${job.zip} ${job.homeownerName} ${categoryName}`.toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "urgent") {
          const order = { asap: 1, this_week: 2, two_weeks: 3, flexible: 4 };
          return (order[a.urgency] ?? 9) - (order[b.urgency] ?? 9);
        }
        if (sortBy === "budget-high") {
          const val = (budget?: string) => {
            if (!budget) return 0;
            if (budget.includes("3,000")) return 3000;
            if (budget.includes("1,000")) return 1000;
            if (budget.includes("500")) return 500;
            return 100;
          };
          return val(b.budget) - val(a.budget);
        }
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
      });
  }, [activeTab, grouped, activeSubFilter, selectedCategory, searchQuery, sortBy]);

  function handlePass(jobId: string) {
    dispatch(setLeadAction({ jobId, action: "declined" }));
  }

  return (
    <div className="w-full max-w-5xl space-y-6">
      {/* 1. Page Header with Title & Operational Mode */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-line/70 pb-4 pt-1">
        <div>
          <h1 className="font-display text-[22px] sm:text-[26px] font-bold text-title tracking-tight">
            Job &amp; Schedule Center
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-muted">
            Manage your exclusive direct requests, browse marketplace leads, and track confirmed active jobs.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary shadow-2xs self-start sm:self-auto">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span>Austin Metro Service Area</span>
        </div>
      </div>

      {/* 2. Primary Tab Switcher */}
      <div className="border-b border-line/70">
        <nav className="flex space-x-1 sm:space-x-2" aria-label="Job categories">
          <button
            type="button"
            onClick={() => setActiveTab("direct")}
            className={cn(
              "flex items-center gap-2 border-b-2 py-3 px-3 text-xs sm:text-sm font-semibold transition-colors",
              activeTab === "direct"
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-title",
            )}
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Direct Requests</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-bold",
                activeTab === "direct" ? "bg-primary text-white" : "bg-smoke text-muted",
              )}
            >
              {tabCounts.direct}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("active")}
            className={cn(
              "flex items-center gap-2 border-b-2 py-3 px-3 text-xs sm:text-sm font-semibold transition-colors",
              activeTab === "active"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-muted hover:text-title",
            )}
          >
            <Wrench className="h-4 w-4 text-emerald-600" />
            <span>Active &amp; Booked</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-bold",
                activeTab === "active" ? "bg-emerald-600 text-white" : "bg-smoke text-muted",
              )}
            >
              {tabCounts.active}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("leads")}
            className={cn(
              "flex items-center gap-2 border-b-2 py-3 px-3 text-xs sm:text-sm font-semibold transition-colors",
              activeTab === "leads"
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-title",
            )}
          >
            <Layers className="h-4 w-4 text-primary" />
            <span>Marketplace Leads</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-bold",
                activeTab === "leads" ? "bg-primary text-white" : "bg-smoke text-muted",
              )}
            >
              {tabCounts.leads}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("completed")}
            className={cn(
              "flex items-center gap-2 border-b-2 py-3 px-3 text-xs sm:text-sm font-semibold transition-colors",
              activeTab === "completed"
                ? "border-title text-title"
                : "border-transparent text-muted hover:text-title",
            )}
          >
            <CheckCircle2 className="h-4 w-4 text-stone-600" />
            <span>History</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-bold",
                activeTab === "completed" ? "bg-title text-white" : "bg-smoke text-muted",
              )}
            >
              {tabCounts.completed}
            </span>
          </button>
        </nav>
      </div>

      {/* 3. Sub-filters for Active Bookings (Only when active tab is selected) */}
      {activeTab === "active" && grouped.activeJobs.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs font-medium text-muted mr-1">Status:</span>
          {(
            [
              { id: "all", label: "All" },
              { id: "scheduled", label: "Scheduled" },
              { id: "in_progress", label: "On-Site" },
              { id: "awaiting_confirm", label: "Awaiting Settle" },
            ] as const
          ).map((sub) => (
            <button
              key={sub.id}
              type="button"
              onClick={() => setActiveSubFilter(sub.id)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer",
                activeSubFilter === sub.id
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "bg-smoke/80 text-muted hover:text-title border border-line/60",
              )}
            >
              {sub.label}
            </button>
          ))}
        </div>
      )}

      {/* 5. Search & Filter Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client, title, keyword or zip…"
            className="w-full rounded-xl border border-line/80 bg-white py-2 pl-9 pr-3 text-xs sm:text-sm text-title outline-none focus:border-primary shadow-2xs"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-xl border border-line/80 bg-white px-3 py-2 text-xs sm:text-sm text-title outline-none shadow-2xs"
        >
          <option value="all">All trades</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortKey)}
          className="rounded-xl border border-line/80 bg-white px-3 py-2 text-xs sm:text-sm text-title outline-none shadow-2xs"
        >
          <option value="newest">Newest first</option>
          <option value="urgent">Urgent first</option>
          <option value="budget-high">Highest budget</option>
        </select>
      </div>

      {/* 6. Main List Rendering */}
      {!access.canSeeJobBoard ? (
        <EmptyState
          title="Clearance required"
          description="Finish application review to see the job board."
          actionLabel="Open application"
          href="/pro/application"
        />
      ) : currentList.length === 0 ? (
        <Card className="rounded-[22px] border border-line/80 bg-white p-10 text-center">
          <Filter className="mx-auto mb-3 h-8 w-8 text-muted/60" />
          <p className="font-display text-base font-bold text-title">
            {activeTab === "direct"
              ? "No direct requests waiting right now"
              : activeTab === "active"
              ? "No active jobs in this filter"
              : activeTab === "completed"
              ? "No completed jobs yet"
              : "No matching marketplace leads"}
          </p>
          <p className="mt-1 text-xs text-muted max-w-sm mx-auto">
            {activeTab === "direct"
              ? "When homeowners view your profile and click 'Request Quote', their direct requests will appear here with zero competition."
              : activeTab === "active"
              ? "When a homeowner accepts your quote, the job moves here with live schedule tracking."
              : "Try resetting your search or trade filter to see more results."}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-4 rounded-full border border-line"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setActiveSubFilter("all");
            }}
          >
            Reset Filters
          </Button>
        </Card>
      ) : (
        <div className="space-y-3.5">
          {currentList.map((job) => {
            const booking = bookings[job.id];
            const isDirect = job.requestedProId === myProId || job.visibility === "direct";
            const isHiredForThisPro = booking?.proId === myProId || state.marketplace.hiredByJob[job.id];

            return (
              <Card
                key={job.id}
                className={cn(
                  "group relative rounded-[20px] border bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                  isDirect && activeTab === "direct"
                    ? "border-primary/40 ring-1 ring-primary/20"
                    : isHiredForThisPro && activeTab === "active"
                    ? "border-emerald-300 ring-1 ring-emerald-400/20"
                    : "border-line/80",
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    {/* Badges Bar */}
                    <div className="flex flex-wrap items-center gap-2">
                      {isDirect && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                          <Sparkles className="h-3 w-3" /> Direct Request
                        </span>
                      )}

                      <span className="rounded-md bg-smoke px-2 py-0.5 text-[11px] font-medium text-title/80">
                        {getCategory(job.categorySlug)?.name}
                      </span>

                      <StatusBadge status={job.status} />

                      {job.urgency === "asap" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                          <Zap className="h-2.5 w-2.5 fill-red-500" /> Urgent / ASAP
                        </span>
                      ) : null}
                    </div>

                    {/* Headline */}
                    <Link
                      href={`/pro/jobs/${job.id}`}
                      className="block mt-2 font-display text-lg sm:text-xl font-bold text-title hover:text-primary transition-colors"
                    >
                      {job.title}
                    </Link>

                    {/* Facts / Summary */}
                    <p className="mt-1.5 text-xs sm:text-[13px] text-stone-600 line-clamp-2 leading-relaxed">
                      {jobCardSummary(job) || job.description}
                    </p>

                    {/* Operational Details Grid */}
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted border-t border-line/50 pt-2.5">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-muted" />
                        {job.city}, {job.state} {job.zip}
                      </span>
                      <span>•</span>
                      <span>Client: <strong className="text-title font-semibold">{job.homeownerName}</strong></span>
                      {booking?.agreedPrice ? (
                        <>
                          <span>•</span>
                          <span className="font-semibold text-emerald-700">
                            Agreed: ${booking.agreedPrice}
                          </span>
                        </>
                      ) : job.budget ? (
                        <>
                          <span>•</span>
                          <span>Budget: <strong className="text-title">{job.budget}</strong></span>
                        </>
                      ) : null}
                      {booking?.scheduledDate ? (
                        <>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1 text-title font-medium">
                            <Calendar className="h-3.5 w-3.5 text-primary" />
                            {booking.scheduledDate} ({booking.arrivalWindow || booking.scheduledTime})
                          </span>
                        </>
                      ) : null}
                    </div>
                  </div>

                  {/* Right Actions Column */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 border-line/60 pt-3 sm:pt-0 shrink-0">
                    {activeTab === "active" ? (
                      <div className="flex flex-wrap items-center gap-2">
                        {job.status === "scheduled" ? (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                              dispatch(setJobStatus({ jobId: job.id, status: "en_route" }));
                              dispatch(
                                addNotification({
                                  title: "Contractor en route",
                                  body: "Contractor has departed and is on the way to your location.",
                                  href: `/account/jobs/${job.id}`,
                                  createdAt: "Just now",
                                  role: "homeowner",
                                }),
                              );
                            }}
                            className="rounded-full gap-1.5 text-xs font-semibold"
                          >
                            <Truck className="h-3.5 w-3.5" />
                            En Route ↗
                          </Button>
                        ) : job.status === "en_route" ? (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                              dispatch(setJobStatus({ jobId: job.id, status: "in_progress" }));
                              dispatch(
                                addNotification({
                                  title: "Work started on-site",
                                  body: "Contractor arrived on site and started work.",
                                  href: `/account/jobs/${job.id}`,
                                  createdAt: "Just now",
                                  role: "homeowner",
                                }),
                              );
                            }}
                            className="rounded-full gap-1.5 text-xs font-semibold"
                          >
                            <Wrench className="h-3.5 w-3.5" />
                            Start Work
                          </Button>
                        ) : null}

                        <Button
                          href={`/pro/jobs/${job.id}`}
                          variant="ghost"
                          size="sm"
                          className="rounded-full border border-line text-xs font-semibold"
                        >
                          View Work Order ↗
                        </Button>
                      </div>
                    ) : activeTab === "direct" ? (
                      <div className="flex items-center gap-2">
                        <Button
                          href={`/pro/jobs/${job.id}`}
                          size="sm"
                          className="rounded-full text-xs font-semibold shadow-xs"
                        >
                          Send Custom Proposal ↗
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePass(job.id)}
                          className="rounded-full text-xs text-muted"
                        >
                          Pass
                        </Button>
                      </div>
                    ) : activeTab === "completed" ? (
                      <div className="flex items-center gap-2">
                        <Button
                          href={`/pro/jobs/${job.id}`}
                          variant="ghost"
                          size="sm"
                          className="rounded-full border border-line text-xs font-semibold"
                        >
                          <Receipt className="h-3.5 w-3.5 mr-1 text-primary" />
                          View Receipt &amp; Review ↗
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button
                          href={`/pro/jobs/${job.id}`}
                          size="sm"
                          className="rounded-full text-xs font-semibold"
                        >
                          Send Quotation ↗
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePass(job.id)}
                          className="rounded-full text-xs text-muted"
                        >
                          Pass
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
