"use server";

import { nextFetch, FetchResponse } from "../core/NextFetch";

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
