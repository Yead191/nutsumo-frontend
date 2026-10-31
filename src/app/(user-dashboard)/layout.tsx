import { redirect } from "next/navigation";
import getProfile from "@/helpers/next-fetch/core/getProfile";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { NavServer } from "@/components/layout/NavServer";

const items = [
  { href: "/account/bookings", label: "My Bookings" },
  { href: "/account", label: "Service Requests" },
  { href: "/account/post-job", label: "Post a request" },
  { href: "/account/messages", label: "Messages" },
  { href: "/account/notifications", label: "Notifications" },
  { href: "/account/saved", label: "Saved pros" },
  { href: "/account/profile", label: "Profile" },
  { href: "/account/password", label: "Password" },
];

export default async function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getProfile();

  // If not authenticated, redirect to login
  if (!user) {
    redirect("/login?redirect=/account");
  }

  // If user is an artisan, redirect them to pro dashboard
  if (user.role === "ARTISAN") {
    redirect("/pro");
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface pt-20">
      <NavServer />
      <div className="container-site flex flex-1 flex-col items-stretch gap-6 pt-6 pb-12 md:flex-row md:items-start md:gap-8 md:pt-8 md:pb-16">
        <DashboardSidebar items={items} />
        <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}
