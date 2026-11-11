import { redirect } from "next/navigation";

export default async function ServiceProsRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/browse-pros?service=${id}`);
}
