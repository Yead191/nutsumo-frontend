import { ArtisanReputationManager } from "@/components/web-pages/artisan-reputation-manager";

export const metadata = {
  title: "Reputation & Badges | Nutsumo",
  description: "View your verified platform badges, customer ratings, completed jobs, and Super Artisan status.",
};

export default function ProReputationPage() {
  return <ArtisanReputationManager />;
}
