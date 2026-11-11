import { redirect } from "next/navigation";

export default async function BrowseProsIdRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/job-seeker/${id}`);
}
