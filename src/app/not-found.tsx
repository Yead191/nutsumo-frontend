import type { Metadata } from "next";
import { NavServer } from "@/components/layout/NavServer";
import { Footer } from "@/components/layout/footer";
import { NotFoundContent } from "@/components/shared/NotFoundContent";

export const metadata: Metadata = {
  title: "404 — Page Not Found · Nutsumo",
  description: "The page you are looking for could not be found on Nutsumo.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-800 ">
      <div className="">
      <NavServer />
      </div>
      <main className="flex-1 ">
        <NotFoundContent />
      </main>
      <Footer />
    </div>
  );
}
