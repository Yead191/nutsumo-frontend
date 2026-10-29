import type { Metadata } from "next";
import { ArtisanServicesManager } from "@/components/web-pages/artisan-services-manager";
import {
  getArtisanSelectedServices,
  getArtisanProfile,
} from "@/helpers/next-fetch/apiActions/artisanActions";

export const metadata: Metadata = {
  title: "Services & Pricing Rates · Nutsumo",
  description:
    "Manage your professional services, configure hourly or daily rates, and define service scopes.",
};

export default async function ProServicesPage() {
  // Fetch real authenticated artisan data on server (Exact Next.js App Router pattern)
  const [artisanServicesRes, profileRes] = await Promise.allSettled([
    getArtisanSelectedServices(),
    getArtisanProfile(),
  ]);

  let initialServices: any[] = [];

  if (
    artisanServicesRes.status === "fulfilled" &&
    artisanServicesRes.value?.success &&
    Array.isArray(artisanServicesRes.value.data) &&
    artisanServicesRes.value.data.length > 0
  ) {
    initialServices = artisanServicesRes.value.data.map((item: any) => ({
      _id: item._id,
      serviceId: item.service?._id || item.service,
      serviceName: item.service?.name || "Service",
      category: item.service?.category?._id || item.service?.category || "",
      categoryName: item.service?.category?.name || "Trade Service",
      rateType: (item.rateType?.toLowerCase() || "hourly") as "hourly" | "daily",
      rate: item.rateAmount || 0,
      description: item.description || "",
      catalogDescription: item.service?.description || "",
      isActive: item.isActive !== undefined ? item.isActive : true,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
  } else if (
    profileRes.status === "fulfilled" &&
    profileRes.value?.success &&
    profileRes.value.data?.services &&
    Array.isArray(profileRes.value.data.services)
  ) {
    initialServices = profileRes.value.data.services.map((s: any) => ({
      category: s.category?._id || s.category || "",
      categoryName: s.category?.name || "Trade Service",
      serviceName: s.serviceName,
      rateType: (s.rateType?.toLowerCase() || "hourly") as "hourly" | "daily",
      rate: s.rate || 0,
      description: s.description || "",
      catalogDescription: "",
      isActive: true,
    }));
  }

  return <ArtisanServicesManager initialServices={initialServices} />;
}
