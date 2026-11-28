import type { Metadata } from "next";
import {
  getServiceCategories,
  getCatalogServices,
} from "@/helpers/next-fetch/apiActions/artisanActions";
import { PostJobWizard } from "@/components/web-pages/customer-dashboard/post-job";

export const metadata: Metadata = {
  title: "Post a Service Request · Nutsumo",
  description:
    "Post any job  household help, driving, catering, childcare, security, repairs, office or creative work  and receive fast competitive quotes from verified professionals.",
};

export default async function PostJobPage() {
  const [categoriesRes, servicesRes] = await Promise.all([
    getServiceCategories({ page: 1, limit: 15 }),
    getCatalogServices({ page: 1, limit: 15 }),
  ]);

  const categories =
    categoriesRes.success && Array.isArray(categoriesRes.data)
      ? categoriesRes.data
      : [];

  const initialServices =
    servicesRes.success && Array.isArray(servicesRes.data)
      ? servicesRes.data
      : [];

  return (
    <PostJobWizard
      categories={categories}
      initialServices={initialServices}
    />
  );
}
