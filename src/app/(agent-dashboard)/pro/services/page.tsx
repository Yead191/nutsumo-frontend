import type { Metadata } from "next";
import { ArtisanServicesManager } from "@/components/web-pages/artisan-services-manager";
import {
  getArtisanSelectedServices,
  getArtisanProfile,
} from "@/helpers/next-fetch/apiActions/artisanActions";
import type { ArtisanServiceItem } from "@/components/web-pages/artisan-dashboard/artisan-services/types";

export const metadata: Metadata = {
  title: "Services & Pricing Rates · Nutsumo",
  description:
    "Manage your professional services, configure hourly or daily rates, and define service scopes.",
};

interface ServiceCategoryRef {
  _id?: string;
  name?: string;
}

interface SelectedServiceRecord {
  _id?: string;
  service?:
    | {
        _id?: string;
        name?: string;
        description?: string;
        category?: ServiceCategoryRef | string;
      }
    | string;
  rateType?: string;
  rateAmount?: number;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ProfileServiceRecord {
  category?: ServiceCategoryRef | string;
  serviceName?: string;
  rateType?: string;
  rate?: number;
  description?: string;
}

function asRateType(value?: string): "hourly" | "daily" {
  return value?.toLowerCase() === "daily" ? "daily" : "hourly";
}

function categoryId(category?: ServiceCategoryRef | string) {
  if (!category) return "";
  return typeof category === "object" ? category._id || "" : category;
}

function categoryName(category?: ServiceCategoryRef | string) {
  if (!category || typeof category !== "object") return "Trade Service";
  return category.name || "Trade Service";
}

function mapSelectedService(item: SelectedServiceRecord): ArtisanServiceItem {
  const service = item.service && typeof item.service === "object" ? item.service : null;

  return {
    _id: item._id,
    serviceId: service?._id || (typeof item.service === "string" ? item.service : undefined),
    serviceName: service?.name || "Service",
    category: categoryId(service?.category),
    categoryName: categoryName(service?.category),
    rateType: asRateType(item.rateType),
    rate: item.rateAmount || 0,
    description: item.description || "",
    catalogDescription: service?.description || "",
    isActive: item.isActive !== false,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function mapProfileService(item: ProfileServiceRecord): ArtisanServiceItem {
  return {
    category: categoryId(item.category),
    categoryName: categoryName(item.category),
    serviceName: item.serviceName || "Service",
    rateType: asRateType(item.rateType),
    rate: item.rate || 0,
    description: item.description || "",
    catalogDescription: "",
    isActive: true,
  };
}

export default async function ProServicesPage() {
  const [servicesRes, profileRes] = await Promise.all([
    getArtisanSelectedServices(),
    getArtisanProfile(),
  ]);

  const selected = Array.isArray(servicesRes.data)
    ? (servicesRes.data as SelectedServiceRecord[])
    : null;

  const services: ArtisanServiceItem[] =
    servicesRes.success && selected
      ? selected.map(mapSelectedService)
      : Array.isArray(profileRes.data?.services)
        ? (profileRes.data.services as ProfileServiceRecord[]).map(mapProfileService)
        : [];

  return <ArtisanServicesManager initialServices={services} />;
}
