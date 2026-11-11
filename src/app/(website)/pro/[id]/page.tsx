import { redirect } from "next/navigation";

export default async function ProRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/browse-pros/${id}`);
}
