import { ArtisanServicesManager } from "@/components/web-pages/artisan-services-manager";

export const metadata = {
  title: "Services & Pricing Rates | Nutsumo",
  description: "Select services from admin categories and set your hourly or daily artisan rates.",
};

export default function ProServicesPage() {
  return <ArtisanServicesManager />;
}
