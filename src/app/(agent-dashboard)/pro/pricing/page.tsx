"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Play,
  ShieldCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, TextField } from "@/components/ui/field";
import { startMembership } from "@/redux/slices/marketplaceSlice";
import {
  setMembershipCancelled,
  setMembershipPaused,
  setSubscriptionPlan,
  updatePaymentMethod,
  unlockContact,
} from "@/redux/slices/featuresSlice";
import { useRoleAccess } from "@/hooks/use-role-access";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { cn } from "@/lib/cn";

export default function PricingPage() {
  const dispatch = useAppDispatch();
  const { applicationStatus } = useRoleAccess();
  const active = useAppSelector((state) => state.marketplace.membershipActive);
  const cancelled = useAppSelector((state) => state.features.membershipCancelled);
  const trialDaysLeft = useAppSelector((state) => state.features.trialDaysLeft ?? 67);
  const currentPlan = useAppSelector(
    (state) => state.features.subscriptionPlan ?? "trial"
  );
  const currentRenewalDate = useAppSelector(
    (state) => state.features.renewalDate ?? "Jan 10, 2027"
  );
  const paymentMethod = useAppSelector(
    (state) =>
      state.features.paymentMethod ?? {
        brand: "Visa",
        last4: "4242",
        exp: "08/29",
      }
  );

  const [billingPreference, setBillingPreference] = useState<"annual" | "monthly">("annual");
  const [showCardModal, setShowCardModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [cardForm, setCardForm] = useState({
    number: "•••• •••• •••• 4242",
    exp: paymentMethod?.exp ?? "08/29",
    cvc: "•••",
    name: "Luis Ortega",
    zip: "78704",
  });

  const isTrialActive = active && !cancelled && currentPlan === "trial";
  const isPaidActive = active && !cancelled && currentPlan !== "trial";
  const isCancelled = cancelled;

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  }

  function handleStartTrial() {
    dispatch(startMembership());
    dispatch(setMembershipPaused(false));
    dispatch(setMembershipCancelled(false));
    dispatch(
      setSubscriptionPlan({
        plan: "trial",
        billingCycle: billingPreference,
        renewalDate: "Jan 10, 2027",
      })
    );
    if (applicationStatus === "cleared") dispatch(unlockContact());
    showToast("3-Month Free Trial started successfully. Enjoy zero platform fees!");
  }

  function handleSelectPlan(plan: "monthly" | "annual", immediate = false) {
    dispatch(
      setSubscriptionPlan({
        plan,
        billingCycle: plan,
        renewalDate: immediate ? "Nov 20, 2026" : currentRenewalDate,
      })
    );
    if (immediate) {
      showToast(
        `Upgraded to Pro ${plan === "annual" ? "Annual" : "Monthly"}. Your subscription is active.`
      );
    } else {
      showToast(
        `Auto-renewal preference set to Pro ${
          plan === "annual" ? "Annual ($14.99/mo · Save 25%)" : "Monthly ($19.99/mo)"
        }. Your card will renew on ${currentRenewalDate}.`
      );
    }
  }

  function handleCancelAutoRenew() {
    dispatch(setMembershipCancelled(true));
    showToast("Auto-renewal cancelled. You will not be charged when your trial expires.");
  }

  function handleUpdateCard(e: React.FormEvent) {
    e.preventDefault();
    const cleanNumber = cardForm.number.replace(/\D/g, "");
    const last4 = cleanNumber.length >= 4 ? cleanNumber.slice(-4) : "4242";
    dispatch(
      updatePaymentMethod({
        brand: cleanNumber.startsWith("3") ? "Amex" : cleanNumber.startsWith("5") ? "Mastercard" : "Visa",
        last4,
        exp: cardForm.exp || "08/29",
      })
    );
    setShowCardModal(false);
    showToast("Payment method updated successfully.");
  }

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-line/70 pb-4 pt-1">
        <div>
          <h1 className="font-display text-[24px] font-semibold tracking-tight text-title">
            Billing
          </h1>
          <p className="mt-1 text-sm text-muted">Plan and card.</p>
        </div>

        {/* Global Action indicator */}
        <div className="flex items-center gap-2">
          {isTrialActive ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Trial Active ({trialDaysLeft} days left)
            </span>
          ) : isPaidActive ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20">
              <Check className="h-3.5 w-3.5" />
              Pro {currentPlan === "annual" ? "Annual" : "Monthly"} Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-smoke px-3 py-1 text-xs font-semibold text-muted border border-line">
              Inactive
            </span>
          )}
        </div>
      </div>

      {/* Floating Interactive Toast */}
      {toastMessage && (
        <div className="rounded-[14px] bg-title text-white p-3.5 text-sm font-medium shadow-lg flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-white/60 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. CURRENT ACTIVE PLAN CARD                                  */}
      {/* ============================================================ */}
      <Card className="rounded-xl border border-line/80 bg-white p-5 sm:p-6 shadow-xs">
        {/* Card Header Status & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line/60 pb-4">
          <div className="flex items-center gap-2">
            <span className="font-display text-xs font-semibold uppercase tracking-wider text-muted">
              Current Plan
            </span>
            <span className="text-muted/40">·</span>
            {isCancelled ? (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 border border-red-200/60">
                Cancelled
              </span>
            ) : isPaidActive ? (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary border border-primary/20">
                <Check className="h-3 w-3" />
                Pro {currentPlan === "annual" ? "Annual" : "Monthly"} Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-title border border-slate-200">
                90-Day Free Trial
              </span>
            )}
          </div>

          {/* Quick Management Buttons */}
          <div className="flex items-center gap-2">
            {!active || cancelled ? (
              <Button type="button" size="sm" onClick={handleStartTrial} className="h-8 font-medium text-xs rounded-lg">
                <Play className="h-3.5 w-3.5 mr-1.5" />
                Start Free Trial
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCancelAutoRenew}
                className="h-8 text-xs font-medium text-muted hover:text-error hover:bg-red-50 rounded-lg"
              >
                Cancel renewal
              </Button>
            )}
          </div>
        </div>

        {/* Plan Details & Pricing */}
        <div className="mt-4 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-title tracking-tight">
              {isCancelled
                ? "Subscription Inactive"
                : isPaidActive
                ? currentPlan === "annual"
                  ? "Pro Annual"
                  : "Pro Monthly"
                : "Pro 3-Month Free Trial"}
            </h2>
            <p className="max-w-xl text-sm text-muted">
              {isCancelled
                ? "Cancelled. Start again to quote."
                : isPaidActive
                ? `Renews ${currentRenewalDate}.`
                : `Free through ${currentRenewalDate}.`}
            </p>
          </div>

          <div className="md:text-right shrink-0">
            <div className="flex items-baseline md:justify-end gap-1.5">
              <span className="font-display text-3xl sm:text-4xl font-bold text-title tracking-tight">
                {isCancelled
                  ? "$19.99"
                  : isPaidActive
                  ? currentPlan === "annual"
                    ? "$14.99"
                    : "$19.99"
                  : "$0.00"}
              </span>
              <span className="text-xs font-medium text-muted">
                {isCancelled
                  ? "/ month"
                  : isPaidActive
                  ? currentPlan === "annual"
                    ? "/ mo ($179.88/yr)"
                    : "/ month"
                  : "/ month"}
              </span>
            </div>
            {!isTrialActive ? (
              <p className="mt-0.5 text-xs text-muted">
                {isPaidActive ? `Renews ${currentRenewalDate}` : "No billing"}
              </p>
            ) : null}
          </div>
        </div>

        {/* Trial Days Progress Bar */}
        {isTrialActive && (
          <div className="mt-5 pt-4 border-t border-line/60">
            <div className="flex items-center justify-between text-xs font-medium text-title mb-2">
              <span className="flex items-center gap-1.5 text-muted">
                <Clock className="h-3.5 w-3.5 text-primary" />
                Trial Progress · Day {90 - trialDaysLeft} of 90
              </span>
              <span className="text-primary font-semibold">{trialDaysLeft} days remaining</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${Math.round(((90 - trialDaysLeft) / 90) * 100)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted">No charge before {currentRenewalDate}.</p>
          </div>
        )}
      </Card>

      {/* ============================================================ */}
      {/* 3. PLAN SELECTION & UPGRADE PATH                             */}
      {/* ============================================================ */}
      <div className="space-y-3">
        <h2 className="font-display text-base font-semibold text-title">
          {isTrialActive ? `After trial · ${currentRenewalDate}` : "Plans"}
        </h2>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div
            className={cn(
              "flex flex-col rounded-xl border bg-white p-5",
              billingPreference === "annual" || currentPlan === "annual"
                ? "border-primary"
                : "border-line",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-base font-bold text-title">Annual</h3>
                <p className="mt-1 font-display text-2xl font-bold text-title">
                  $14.99 <span className="text-sm font-medium text-muted">/mo</span>
                </p>
                <p className="mt-1 text-xs text-muted">$179.88 billed yearly</p>
              </div>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                Save 25%
              </span>
            </div>
            <Button
              type="button"
              size="sm"
              variant={currentPlan === "annual" ? "secondary" : "primary"}
              onClick={() => {
                setBillingPreference("annual");
                handleSelectPlan("annual", false);
              }}
              className="mt-5 w-full"
            >
              {currentPlan === "annual" ? "Selected" : "Select annual"}
            </Button>
          </div>

          <div
            className={cn(
              "flex flex-col rounded-xl border bg-white p-5",
              billingPreference === "monthly" && currentPlan !== "annual"
                ? "border-primary"
                : "border-line",
            )}
          >
            <div>
              <h3 className="font-display text-base font-bold text-title">Monthly</h3>
              <p className="mt-1 font-display text-2xl font-bold text-title">
                $19.99 <span className="text-sm font-medium text-muted">/mo</span>
              </p>
              <p className="mt-1 text-xs text-muted">Billed monthly</p>
            </div>
            <Button
              type="button"
              size="sm"
              variant={currentPlan === "monthly" ? "secondary" : "ghost"}
              onClick={() => {
                setBillingPreference("monthly");
                handleSelectPlan("monthly", false);
              }}
              className="mt-5 w-full border border-line"
            >
              {currentPlan === "monthly" ? "Selected" : "Select monthly"}
            </Button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. PAYMENT METHOD & BILLING INFO                             */}
      {/* ============================================================ */}
      <Card className="rounded-xl border border-line/80 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-700 shrink-0 border border-slate-200/60">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-sm sm:text-base font-semibold text-title flex items-center gap-2">
                <span>{paymentMethod?.brand ?? "Visa"} •••• {paymentMethod?.last4 ?? "4242"}</span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 border border-slate-200/60">
                  Primary Card
                </span>
              </p>
              <p className="mt-0.5 text-xs text-muted">Expires {paymentMethod?.exp ?? "08/29"}</p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowCardModal(true)}
            className="border border-line/80 text-xs font-medium rounded-lg self-start sm:self-auto hover:bg-slate-50"
          >
            Update Payment Card ↗
          </Button>
        </div>
      </Card>

      <Link
        href="/pro/transactions"
        className="flex items-center justify-between rounded-xl border border-line bg-white px-5 py-4 hover:border-primary/40"
      >
        <span className="font-display text-sm font-semibold text-title">Transaction history</span>
        <ChevronRight className="h-4 w-4 text-muted" />
      </Link>

      {/* ============================================================ */}
      {/* MODAL 1: UPDATE PAYMENT CARD MODAL                           */}
      {/* ============================================================ */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-[22px] border border-line bg-white p-6 shadow-xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="font-display text-lg font-bold text-title flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Update Payment Card
              </h3>
              <button
                type="button"
                onClick={() => setShowCardModal(false)}
                className="text-muted hover:text-title"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCard} className="mt-4 space-y-4">
              <Field label="Cardholder Name">
                <TextField
                  value={cardForm.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCardForm({ ...cardForm, name: e.target.value })
                  }
                  placeholder="Luis Ortega"
                  required
                />
              </Field>

              <Field label="Card Number">
                <TextField
                  value={cardForm.number}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCardForm({ ...cardForm, number: e.target.value })
                  }
                  placeholder="4242 4242 4242 4242"
                  maxLength={19}
                  required
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Exp Date (MM/YY)">
                  <TextField
                    value={cardForm.exp}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCardForm({ ...cardForm, exp: e.target.value })
                    }
                    placeholder="08/29"
                    maxLength={5}
                    required
                  />
                </Field>
                <Field label="CVC">
                  <TextField
                    value={cardForm.cvc}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCardForm({ ...cardForm, cvc: e.target.value })
                    }
                    placeholder="123"
                    maxLength={4}
                    required
                  />
                </Field>
              </div>

              <p className="text-xs text-muted flex items-center gap-1.5 pt-1">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                PCI-DSS Level 1 compliant. Your card will only be charged when your paid billing cycle starts.
              </p>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowCardModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 font-semibold">
                  Save Card
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
