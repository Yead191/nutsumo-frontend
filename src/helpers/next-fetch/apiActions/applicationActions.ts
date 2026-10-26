"use server";

import { nextFetch } from "../core/NextFetch";

/** POST /application — submits a grant application as FormData */
export async function submitApplication(formData: FormData) {
  // FormData handling is automatically done by NextFetch (it skips Content-Type: application/json)
  const result = await nextFetch("/application", {
    method: "POST",
    body: formData,
  });

  return result;
}

/** GET /application/track — fetches a specific application by email, dob and optional periodId */
export async function trackApplicationStatus(
  email: string,
  dob: string,
  periodId?: string,
) {
  const params: Record<string, string> = { email, dob };
  if (periodId) {
    params.periodId = periodId;
  }
  const queryParams = new URLSearchParams(params);
  const result = await nextFetch(
    `/application/track?${queryParams.toString()}`,
    {
      method: "GET",
      // We shouldn't heavily cache this since status updates are important
      cache: "no-store",
    },
  );
  return result;
}
