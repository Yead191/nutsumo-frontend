"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { loginHref } from "@/lib/role-access";
import { useAppSelector } from "@/redux/hooks";

const items = [
  { href: "/account/bookings", label: "My Bookings" },
  { href: "/account", label: "Service Requests" },
  { href: "/account/post-job", label: "Post a request" },
  { href: "/account/messages", label: "Messages" },
  { href: "/account/saved", label: "Saved pros" },
  { href: "/account/profile", label: "Profile" },
  { href: "/account/password", label: "Password" },
];

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAppSelector((state) => state.auth.user);
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      const next = pathname?.startsWith("/account") ? pathname : "/account/post-job";
      router.replace(loginHref({ next }));
      return;
    }
    if (user.role === "pro") router.replace("/pro");
  }, [hydrated, pathname, router, user]);

  if (!hydrated || !user || user.role !== "homeowner") return null;

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />
      <div className="container-site flex flex-1 flex-col items-stretch gap-6 pt-6 pb-12 md:flex-row md:items-start md:gap-8 md:pt-8 md:pb-16">
        <DashboardSidebar items={items} />
        <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}
