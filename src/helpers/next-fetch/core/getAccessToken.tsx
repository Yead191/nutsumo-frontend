"use server";

import { cookies } from "next/headers";

export const getAccessToken = async (): Promise<string | undefined> => {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("accessToken")?.value;
  } catch {
    return undefined;
  }
};