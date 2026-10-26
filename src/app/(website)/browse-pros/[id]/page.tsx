import { notFound } from "next/navigation";
import { ProProfileContent } from "@/components/web-pages/pro-profile-content";
import { getPro } from "@/Mockdata";

export default async function ProPublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pro = getPro(id);
  if (!pro || pro.clearance !== "cleared") notFound();
  return <ProProfileContent pro={pro} />;
}
