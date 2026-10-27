"use server";

import { cookies } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";
import { nextFetch, FetchResponse } from "../core/NextFetch";
import { revalidateTags } from "../core/revalidateTags";

export interface GoogleLoginResponseData {
  createToken: string;
  role?: string;
  user?: any;
}

/**
 * Sends Google ID token to the backend to authenticate or register the user.
 * Endpoint: POST /auth/google-login
 */
export async function loginWithGoogle(
  idToken: string,
): Promise<FetchResponse<GoogleLoginResponseData>> {
  return nextFetch<GoogleLoginResponseData>("/auth/google-login", {
    method: "POST",
    body: { idToken },
  });
}

/**
 * Clears authentication cookies on the server and revalidates layout and user profile tags.
 */
export async function logoutUser(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("role");
  } catch {
    // Ignore if called in read-only phase
  }

  try {
    revalidateTags(["user-profile"]);
    revalidatePath("/", "layout");
  } catch {
    // Ignore in case of environment limitation
  }

  return { success: true };
}

/** Submit Artisan National ID (Front, Back) and Live Selfie */
export async function submitArtisanIdentity(formData: FormData) {
  return nextFetch("/auth/verify-identity", {
    method: "POST",
    body: formData,
  });
}

/** Get Artisan Identity Verification Status */
export async function getIdentityStatus(email?: string) {
  const query = email ? `?email=${encodeURIComponent(email)}` : "";
  return nextFetch(`/auth/identity-status${query}`, {
    method: "GET",
  });
}
