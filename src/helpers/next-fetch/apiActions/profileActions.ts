"use server";

import { nextFetch } from "../core/NextFetch";
import { revalidateTags } from "../core/revalidateTags";

/** PATCH /user/profile — form-data (name, contact, image, …) */
export async function updateUserProfile(formData: FormData) {
  const result = await nextFetch("/user/profile", {
    method: "PATCH",
    body: formData,
  });

  if (result.success) {
    await revalidateTags(["user-profile"]);
  }

  return result;
}

/** POST /auth/change-password */
export async function changePassword(body: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  return nextFetch("/auth/change-password", {
    method: "POST",
    body,
  });
}
