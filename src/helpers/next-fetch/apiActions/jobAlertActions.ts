"use server";

import { nextFetch } from "../core/NextFetch";
import { revalidatePath } from "next/cache";

export async function saveJobAlertAction(payload: {
  keywords: string;
  category?: string;
  service?: string;
}) {
  const result = await nextFetch("/job-alert", {
    method: "POST",
    body: payload,
    cache: "no-store",
  });
  if (result.success) {
    revalidatePath("/pro/jobs");
  }
  return result;
}
