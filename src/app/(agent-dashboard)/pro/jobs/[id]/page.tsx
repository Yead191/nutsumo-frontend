import { notFound } from "next/navigation";
import { ProJobLead } from "@/components/web-pages/pro-job-lead";
import { getJob } from "@/Mockdata";

export default async function ProJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id.startsWith("job-local-") && !getJob(id)) notFound();

  return <ProJobLead jobId={id} />;
}
