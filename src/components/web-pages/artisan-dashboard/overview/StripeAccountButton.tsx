"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { connectStripeAccountAction } from "@/helpers/next-fetch/apiActions/walletActions";

export function StripeAccountButton({
  connected,
  size = "sm",
}: {
  connected: boolean;
  size?: "sm" | "md";
}) {
  const [isPending, startTransition] = useTransition();

  const openStripe = () => {
    startTransition(async () => {
      const result = await connectStripeAccountAction();
      if (!result.success || !result.data?.url) {
        toast.error(result.message || "Could not open Stripe");
        return;
      }
      window.location.assign(result.data.url);
    });
  };

  return (
    <Button type="button" size={size} onClick={openStripe} disabled={isPending}>
      {isPending ? "Opening Stripe…" : connected ? "Login Stripe" : "Connect Stripe"}
    </Button>
  );
}
