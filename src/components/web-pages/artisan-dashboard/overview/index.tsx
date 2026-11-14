"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { withdrawWalletAction, type IArtisanWallet } from "@/helpers/next-fetch/apiActions/walletActions";

const money = (value: number) =>
  `GH₵ ${Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const entryLabel: Record<IArtisanWallet["ledger"][number]["entryType"], string> = {
  CREDIT_RELEASE: "Job released to balance",
  DEBIT_WITHDRAW: "Withdrawal",
  CREDIT_REVERSAL: "Withdrawal returned",
};

export function ArtisanOverview({ wallet }: { wallet: IArtisanWallet }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [amount, setAmount] = useState("");

  const refresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const withdraw = () => {
    const value = Number(amount);
    startTransition(async () => {
      const result = await withdrawWalletAction(value);
      if (!result.success) {
        toast.error(result.message || "Withdrawal could not be started");
        return;
      }
      toast.success(result.message || "Withdrawal requested");
      setAmount("");
      refresh();
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-line/70 pb-4">
        <h1 className="font-display text-[22px] font-bold tracking-tight text-title sm:text-[26px]">
          Overview
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Completed jobs land here after Nutsumo releases them. Withdraw sends the available balance to your connected Stripe account.
        </p>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        <article className="rounded-2xl border border-[#FE375D]/20 bg-[#fff7f8] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#d4234c]">Available</p>
          <p className="mt-2 font-display text-2xl font-bold text-title">{money(wallet.available)}</p>
          <p className="mt-1 text-xs text-muted">Ready to withdraw. Minimum {money(wallet.minimumWithdrawal)}.</p>
        </article>
        <article className="rounded-2xl border border-line bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">In escrow</p>
          <p className="mt-2 font-display text-2xl font-bold text-title">{money(wallet.inEscrow)}</p>
          <p className="mt-1 text-xs text-muted">
            {money(wallet.awaitingRelease)} already approved, waiting for release.
          </p>
        </article>
        <article className="rounded-2xl border border-line bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Paid out</p>
          <p className="mt-2 font-display text-2xl font-bold text-title">{money(wallet.lifetimeWithdrawn)}</p>
          <p className="mt-1 text-xs text-muted">
            {wallet.completedJobs} completed {wallet.completedJobs === 1 ? "job" : "jobs"}. Lifetime credited {money(wallet.lifetimeCredited)}.
          </p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-3 rounded-2xl border border-line bg-white p-4">
          <h2 className="font-display text-base font-bold text-title">Stripe</h2>
          <p className="text-sm text-muted">
            {wallet.stripeConnected
              ? "Your Stripe account is connected. Withdrawals go there."
              : "Connect Stripe on your profile before you can withdraw."}
          </p>
          <Button href="/pro/profile" size="sm" className="self-start">
            {wallet.stripeConnected ? "Login Stripe" : "Connect Stripe"}
          </Button>
        </div>

        <form
          className="space-y-3 rounded-2xl border border-line bg-white p-4"
          onSubmit={(event) => {
            event.preventDefault();
            withdraw();
          }}
        >
          <div>
            <h2 className="font-display text-base font-bold text-title">Withdraw</h2>
            <p className="mt-1 text-xs text-muted">
              The amount leaves your balance and is transferred to your connected Stripe account.
            </p>
          </div>
          <label className="block text-xs font-semibold text-title">
            Amount
            <input
              required
              type="number"
              min={wallet.minimumWithdrawal}
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder={wallet.minimumWithdrawal.toFixed(2)}
              className="mt-1 w-full rounded-xl border border-line px-3 py-2 text-sm"
            />
          </label>
          <Button type="submit" size="sm" disabled={isPending || !wallet.stripeConnected || wallet.available < wallet.minimumWithdrawal}>
            Withdraw
          </Button>
          <ul className="space-y-2 pt-2">
            {wallet.withdrawals.length === 0 ? (
              <li className="text-xs text-muted">No withdrawals yet.</li>
            ) : (
              wallet.withdrawals.map((item) => (
                <li key={item._id} className="flex items-center justify-between gap-3 text-sm">
                  <span>
                    <span className="font-semibold text-title">{money(item.amount)}</span>
                    <span className="ml-2 text-xs text-muted">{item.method}</span>
                  </span>
                  <span className="text-xs font-semibold text-muted">{item.status}</span>
                </li>
              ))
            )}
          </ul>
        </form>
      </section>

      <section className="rounded-2xl border border-line bg-white">
        <div className="border-b border-line px-4 py-3">
          <h2 className="font-display text-base font-bold text-title">Balance activity</h2>
        </div>
        {wallet.ledger.length === 0 ? (
          <p className="px-4 py-8 text-sm text-muted">Released job earnings will show up here.</p>
        ) : (
          <ul className="divide-y divide-line">
            {wallet.ledger.map((entry) => (
              <li key={entry._id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                <div>
                  <p className="font-medium text-title">{entryLabel[entry.entryType]}</p>
                  <p className="text-xs text-muted">
                    {new Date(entry.createdAt).toLocaleString()} · Balance {money(entry.balanceAfter)}
                  </p>
                </div>
                <p className={entry.entryType === "DEBIT_WITHDRAW" ? "font-semibold text-rose-700" : "font-semibold text-emerald-700"}>
                  {entry.entryType === "DEBIT_WITHDRAW" ? "−" : "+"}
                  {money(entry.amount)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
