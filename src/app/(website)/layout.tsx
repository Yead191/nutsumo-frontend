import { Footer } from "@/components/layout/footer";
import { NavServer } from "@/components/layout/NavServer";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <NavServer />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
