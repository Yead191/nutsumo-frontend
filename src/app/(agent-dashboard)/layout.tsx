import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { NavServer } from "@/components/layout/NavServer";

const items = [
  { href: "/pro", label: "Overview" },
  { href: "/pro/profile", label: "Professional Profile" },
  { href: "/pro/services", label: "Services & Rates" },
  { href: "/pro/portfolio", label: "Portfolio Showcase" },
  { href: "/pro/reputation", label: "Reputation & Badges" },
  { href: "/pro/jobs", label: "Jobs & Schedule" },
  { href: "/pro/messages", label: "Messages" },
  { href: "/pro/reviews", label: "Reviews" },
  { href: "/pro/pricing", label: "Subscription" },
  { href: "/pro/password", label: "Password" },
];

export default function AgentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
