"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, DollarSign, Clock, ShieldCheck, Lock, Briefcase } from "lucide-react";
import { PageBanner } from "@/components/layout/page-banner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { photos } from "@/lib/media";
import { loginHref } from "@/lib/role-access";
import { getCategory } from "@/Mockdata";
import { selectAllJobs } from "@/lib/marketplace";
import { useAppSelector } from "@/redux/hooks";

/** Public gate & preview — private job bidding and client contact live on /pro/jobs after clearance + membership. */
export default function BrowseJobsPage() {
  const user = useAppSelector((state) => state.auth.user);
  const allJobs = useAppSelector(selectAllJobs);
  const router = useRouter();

  useEffect(() => {
    if (user?.role === "pro") router.replace("/pro/jobs");
  }, [router, user]);

  const activeJobs = allJobs.slice(0, 4);

  return (
    <>
      <PageBanner
        eyebrow="For professionals"
        title="Austin Job Board"
        description="Direct repair requests from verified Austin homeowners. Join as an approved pro to submit quotes with 0% commission."
        image={photos.banners.jobs}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Austin Job Board" },
        ]}
      />

      <section className="bg-surface py-10 md:py-14">
        <div className="container-site space-y-10">
          {/* Top Quick Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line/70 pb-6">
            <div>
              <h2 className="font-display text-xl font-semibold tracking-tight text-title sm:text-2xl">
                Recent Homeowner Requests
              </h2>
              <p className="mt-1 text-sm text-muted">
                Showing live repair requests across the greater Austin metropolitan area.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              {user?.role === "pro" ? (
                <Button href="/pro/jobs">Open available jobs ↗</Button>
              ) : (
                <>
                  <Button href={loginHref({ role: "pro", next: "/pro/jobs" })}>
                    Pro sign in ↗
                  </Button>
                  <Button href="/pro-register" variant="ghost">
                    Apply as a pro ↗
                  </Button>
                </>
              )}
              <Button href="/browse-pros" variant="ghost">
                Browse pros ↗
              </Button>
            </div>
          </div>

          {/* Job Preview Grid */}
          <div className="grid gap-5 md:grid-cols-2">
            {activeJobs.map((job) => {
              const cat = getCategory(job.categorySlug);
              return (
                <Card key={job.id} className="relative flex flex-col justify-between p-6 transition-all hover:border-line hover:shadow-xs">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        <Briefcase className="h-3 w-3" />
                        {cat?.name ?? job.categorySlug}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-smoke px-2.5 py-0.5 text-[11px] font-medium text-muted">
                        <Clock className="h-3 w-3" />
                        {job.urgency === "asap" ? "Urgent (ASAP)" : "This week"}
                      </span>
                    </div>

                    <h3 className="mt-3.5 font-display text-base font-semibold text-title sm:text-lg">
                      {job.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-copy">
                      {job.description}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted">
                      <span className="flex items-center gap-1 font-medium text-title">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        {job.city}, TX {job.zip}
                      </span>
                      <span className="flex items-center gap-1 font-medium text-title">
                        <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                        Budget: {job.budget || "Itemized Quote"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-line/60 pt-4">
                    <span className="flex items-center gap-1.5 text-xs text-muted">
                      <Lock className="h-3.5 w-3.5 text-muted" />
                      Client contact locked
                    </span>
                    <Button
                      href={loginHref({ role: "pro", next: "/pro/jobs" })}
                      size="sm"
                      variant="ghost"
                      className="text-xs font-semibold"
                    >
                      Submit Quote ↗
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Pro Value Banner */}
          <div className="rounded-2xl border border-line/80 bg-white p-6 shadow-2xs sm:p-8">
            <div className="grid items-center gap-6 lg:grid-cols-[1.5fr_1fr]">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  0% Commission • Flat Monthly Membership
                </span>
                <h3 className="mt-3 font-display text-xl font-bold tracking-tight text-title sm:text-2xl">
                  Are you a licensed contractor or handyman in Austin?
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Join LocalHomeFix to receive real-time repair requests in your trade territory. Communicate directly with homeowners, set your own prices, and keep 100% of your earnings.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
                <Button href="/pro-register" size="lg" className="w-full sm:w-auto">
                  Apply for Pro Clearance ↗
                </Button>
                <Button
                  href={loginHref({ role: "pro", next: "/pro/jobs" })}
                  variant="ghost"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  Existing Pro Sign In ↗
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
