import type { Metadata } from "next";
import { getServiceCategories } from "@/helpers/next-fetch/apiActions/artisanActions";
import { PostJobWizard } from "@/components/web-pages/customer-dashboard/post-job";

export const metadata: Metadata = {
  title: "Post a Service Request · Nutsumo",
  description:
    "Post your home repair, installation, or maintenance project and receive fast competitive quotes from verified local artisans.",
};

export default async function PostJobPage() {
  const categoriesRes = await getServiceCategories();
  const categories =
    categoriesRes.success && Array.isArray(categoriesRes.data)
      ? categoriesRes.data
      : [];

  return <PostJobWizard categories={categories} />;
}
