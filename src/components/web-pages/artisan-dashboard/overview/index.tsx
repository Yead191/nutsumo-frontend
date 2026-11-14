import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/getImageUrl";
import type { IArtisanDashboard } from "@/helpers/next-fetch/apiActions/walletActions";
import { StripeAccountButton } from "./StripeAccountButton";

const money = (value: number) =>
  `GH₵ ${Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const statusLabel: Record<string, string> = {
  AWAITING_PAYMENT: "Awaiting payment",
  CONFIRMED: "Confirmed",
  IN_PROGRESS: "In progress",
  DELIVERED: "Delivered",
  REVISION_REQUESTED: "Revision",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  DISPUTED: "Disputed",
  PENDING: "Pending",
  APPROVED: "Approved",
  RELEASED: "Released",
  REJECTED: "Rejected",
};

const replyLabel = (minutes: number, samples: number) => {
  if (samples < 3 || !minutes) return "Not enough replies yet";
  if (minutes < 60) return `${Math.round(minutes)} min`;
  if (minutes < 60 * 24) return `${Math.round(minutes / 60)} hr`;
  return `${(minutes / (60 * 24)).toFixed(1)} days`;
};

const jobOf = (job?: { _id?: string; title?: string } | string) =>
  !job || typeof job === "string" ? null : job;

export function ArtisanOverview({
  user,
  dashboard,
}: {
  user: {
    name?: string;
    trade?: string;
    image?: string;
    location?: string;
    postCode?: string;
    availabilityStatus?: string;
    stripeAccountInfo?: {
      accountId?: string;
      details_submitted?: boolean;
      payouts_enabled?: boolean;
      loginUrl?: string;
    };
  } | null;
  dashboard: IArtisanDashboard;
}) {
  const stripe = user?.stripeAccountInfo;
  const stripeConnected = Boolean(
    stripe?.accountId &&
      (stripe.details_submitted || stripe.payouts_enabled || stripe.loginUrl),
  );
  const photo = getImageUrl(user?.image);
  const maxEarned = Math.max(...dashboard.monthly.map((point) => point.earned), 1);
  const yearEarned = dashboard.monthly.reduce((sum, point) => sum + point.earned, 0);
  const yearJobs = dashboard.monthly.reduce((sum, point) => sum + point.jobs, 0);
  const acceptPercent = Math.round((dashboard.reputation.acceptRate || 0) * 100);
  const presence = dashboard.presence ?? {
    liveServices: 0,
    servicesInReview: 0,
    portfolioItems: 0,
    unreadNotifications: 0,
  };
  const sent = dashboard.work.quotesSent || 0;
  const acceptedShare = sent ? Math.round((dashboard.work.acceptedQuotes / sent) * 100) : 0;
  const place = [user?.location, user?.postCode].filter(Boolean).join(" · ");

  const funnel = [
    { label: "Quotes sent", value: sent, width: 100 },
    { label: "Accepted", value: dashboard.work.acceptedQuotes, width: acceptedShare },
    {
      label: "Active jobs",
      value: dashboard.work.activeBookings,
      width: sent ? Math.min(100, Math.round((dashboard.work.activeBookings / sent) * 100)) : 0,
    },
    {
      label: "Completed",
      value: dashboard.work.completed,
      width: sent ? Math.min(100, Math.round((dashboard.work.completed / sent) * 100)) : 0,
    },
  ];

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-3xl border border-line bg-white">
        <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#fff1f3] text-lg font-bold text-[#d4234c]">
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt="" className="h-full w-full object-cover" />
              ) : (
                (user?.name || "A").slice(0, 1)
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#d4234c]">
                {user?.trade || "Artisan"}
                {user?.availabilityStatus ? ` · ${user.availabilityStatus}` : ""}
              </p>
              <h1 className="truncate font-display text-[24px] font-bold tracking-tight text-title sm:text-[28px]">
                {user?.name || "Overview"}
              </h1>
              {place ? <p className="mt-0.5 text-sm text-muted">{place}</p> : null}
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface px-4 py-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Payouts</p>
              <p className="text-sm font-semibold text-title">
                {stripeConnected ? "Stripe connected" : "Stripe not connected"}
              </p>
            </div>
            <StripeAccountButton connected={stripeConnected} />
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-[#FE375D]/25 bg-[#fff7f8] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#d4234c]">Wallet</p>
          <p className="mt-2 font-display text-[28px] font-bold leading-none text-title">
            {money(dashboard.balance.available)}
          </p>
          <p className="mt-2 text-xs text-muted">Available to withdraw</p>
        </article>
        <MoneyCard
          label="In escrow"
          value={money(dashboard.balance.inEscrow)}
          note={`${money(dashboard.balance.awaitingRelease)} approved, waiting for release`}
        />
        <MoneyCard
          label="Credited"
          value={money(dashboard.balance.lifetimeCredited)}
          note={`${money(dashboard.balance.lifetimeWithdrawn)} already paid out`}
        />
        <MoneyCard
          label="Completed jobs"
          value={String(dashboard.work.completed)}
          note={`${dashboard.work.activeBookings} active · ${dashboard.work.delivered} delivered`}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-2xl border border-line bg-white p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-title">Released earnings</h2>
              <p className="text-xs text-muted">Net paid into your wallet, last 12 months</p>
            </div>
            <div className="text-right">
              <p className="font-display text-lg font-bold text-title">{money(yearEarned)}</p>
              <p className="text-xs text-muted">{yearJobs} released jobs</p>
            </div>
          </div>
          <div className="mt-6 flex h-44 items-end gap-1.5 sm:gap-2">
            {dashboard.monthly.map((point, index) => {
              const height = Math.max(point.earned > 0 ? 8 : 3, (point.earned / maxEarned) * 100);
              const current = index === dashboard.monthly.length - 1;
              return (
                <div key={`${point.label}-${index}`} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                  <div className="flex h-36 w-full items-end">
                    <div
                      className={`w-full rounded-t-md ${current ? "bg-[#FE375D]" : "bg-[#FE375D]/55"}`}
                      style={{ height: `${height}%` }}
                      title={`${point.label}: ${money(point.earned)} · ${point.jobs} jobs`}
                    />
                  </div>
                  <span className={`text-[10px] ${current ? "font-semibold text-title" : "text-muted"}`}>
                    {point.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-5">
          <h2 className="font-display text-lg font-bold text-title">Quote conversion</h2>
          <p className="text-xs text-muted">{acceptPercent}% of quotes were accepted</p>
          <div className="mt-5 space-y-3">
            {funnel.map((row) => (
              <div key={row.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-muted">{row.label}</span>
                  <span className="font-semibold text-title">{row.value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-smoke">
                  <div
                    className="h-full rounded-full bg-[#FE375D]"
                    style={{ width: `${Math.max(row.value > 0 ? 6 : 0, row.width)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted">
            <p>Waiting on client: {dashboard.work.pendingQuotes}</p>
            <p>Rejected: {dashboard.work.quotesRejected || 0}</p>
            <p>Withdrawn: {dashboard.work.quotesWithdrawn || 0}</p>
            <p>Disputed jobs: {dashboard.work.disputed}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Rating" value={dashboard.reputation.rating ? dashboard.reputation.rating.toFixed(1) : "—"} note={`${dashboard.reputation.reviewsCount} reviews`} href="/pro/reviews" />
        <StatTile
          label="Reply time"
          value={replyLabel(dashboard.reputation.responseTimeMinutes, dashboard.reputation.responseSamples)}
          note={`${dashboard.reputation.responseSamples} measured replies`}
          href="/pro/reputation"
        />
        <StatTile
          label="Live services"
          value={String(presence.liveServices)}
          note={
            presence.servicesInReview
              ? `${presence.servicesInReview} still in review`
              : "Published on your profile"
          }
          href="/pro/services"
        />
        <StatTile
          label="Inbox"
          value={String(presence.unreadNotifications)}
          note={`${presence.portfolioItems} portfolio pieces`}
          href="/pro/notifications"
        />
      </section>

      <section className="overflow-hidden rounded-2xl border border-line bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h2 className="font-display text-lg font-bold text-title">Recent bookings</h2>
            <p className="text-xs text-muted">
              {dashboard.work.awaitingPayment} waiting for client payment
            </p>
          </div>
          <Button href="/pro/wallet" variant="ghost" size="sm">
            Open wallet
          </Button>
        </div>
        {dashboard.recentBookings.length === 0 ? (
          <p className="px-5 py-10 text-sm text-muted">Bookings will show up here once a client accepts a quote.</p>
        ) : (
          <ul className="divide-y divide-line">
            {dashboard.recentBookings.map((booking) => {
              const job = jobOf(booking.job);
              const href = job?._id ? `/pro/jobs/${job._id}` : "/pro/jobs";
              return (
                <li key={booking._id}>
                  <Link href={href} className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-smoke/50">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-title">{job?.title || "Booking"}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        {booking.bookingNumber || booking._id.slice(-6)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="hidden rounded-full bg-smoke px-2.5 py-1 text-[11px] font-semibold text-title sm:inline">
                        {statusLabel[booking.status] || booking.status}
                      </span>
                      {booking.payoutStatus ? (
                        <span className="hidden rounded-full bg-[#fff1f3] px-2.5 py-1 text-[11px] font-semibold text-[#d4234c] md:inline">
                          {statusLabel[booking.payoutStatus] || booking.payoutStatus}
                        </span>
                      ) : null}
                      <p className="font-semibold text-title">{money(booking.artisanPayoutAmount || 0)}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function MoneyCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <article className="rounded-2xl border border-line bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-2 font-display text-[28px] font-bold leading-none text-title">{value}</p>
      <p className="mt-2 text-xs text-muted">{note}</p>
    </article>
  );
}

function StatTile({
  label,
  value,
  note,
  href,
}: {
  label: string;
  value: string;
  note: string;
  href: string;
}) {
  return (
    <Link href={href} className="rounded-2xl border border-line bg-white p-4 transition-colors hover:border-[#FE375D]/40">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-2 font-display text-xl font-bold text-title">{value}</p>
      <p className="mt-1 text-xs text-muted">{note}</p>
    </Link>
  );
}
