"use server";

import { cookies } from "next/headers";
const getProfile = async (): Promise<any | null> => {
  // Get request-bound data immediately
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return null;
  }

  try {
    const res = await fetch(`${process.env.BASE_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      // cache: "no-store",
      cache: "default",
      next: {
        tags: ["user-profile"],
        revalidate: 30,
      },
    });

    if (res.status === 401 || res.status === 403) {
      console.warn(
        `Profile API rejected with ${res.status}. Invalidating session.`,
      );
      try {
        cookieStore.delete("accessToken");
        cookieStore.delete("role");
        // revalidatePath("/");
      } catch {
        // Ignore if called in read-only phase
      }
      return null;
    }

    if (!res.ok) {
      return null;
    }

    const { data } = await res.json();
    if (data?.status === "blocked") {
      try {
        cookieStore.delete("accessToken");
        cookieStore.delete("role");
      } catch {
        // Ignore if called in read-only phase
      }
      return null;
    }

    return data ?? null;
  } catch {
    console.error("Profile fetch error: server not reachable");
    return null;
  }
};

export default getProfile;
