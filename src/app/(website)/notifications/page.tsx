import { redirect } from "next/navigation";
import getProfile from "@/helpers/next-fetch/core/getProfile";

export default async function GeneralNotificationsPage() {
  const user = await getProfile();

  if (!user) {
    redirect("/login?redirect=/notifications");
  }

  if (user.role === "ARTISAN") {
    redirect("/pro/notifications");
  } else {
    redirect("/account/notifications");
  }
}
